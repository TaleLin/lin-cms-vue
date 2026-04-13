import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  attachJsonSender,
  createSocketObserver,
  normalizeConnectionUrl,
  parseSocketMessageData,
} from '@/component/notify/observer'

class MockWebSocket {
  constructor(url, protocol = '') {
    this.url = url
    this.protocol = protocol
    this.close = vi.fn()
    this.send = vi.fn()
    this.onmessage = null
    this.onclose = null
    this.onerror = null
    this.onopen = null
  }
}

class CloseNotifyingWebSocket {
  constructor(url, protocol = '') {
    this.url = url
    this.protocol = protocol
    this.send = vi.fn()
    this.onmessage = null
    this.onclose = null
    this.onerror = null
    this.onopen = null
    this.close = vi.fn(() => {
      this.onclose?.({ code: 1000, reason: 'manual close' })
    })
  }
}

describe('notify observer', () => {
  beforeEach(() => {
    vi.useRealTimers()
  })

  it('normalizes relative socket urls, attaches json sender and dispatches explicit event handlers', () => {
    const handleMessage = vi.fn()
    const handleError = vi.fn()
    const observer = createSocketObserver('//socket.example.test/notify', {
      WebSocket: MockWebSocket,
      format: 'json',
      events: {
        onmessage: handleMessage,
        onerror: handleError,
      },
    })

    expect(observer.WebSocket.url).toBe('ws://socket.example.test/notify')
    expect(typeof observer.WebSocket.sendObj).toBe('function')

    observer.WebSocket.sendObj({ type: 'ping' })
    expect(observer.WebSocket.send).toHaveBeenCalledWith('{"type":"ping"}')

    const messageEvent = { data: '{"content":"hello"}' }
    const errorEvent = new Error('socket error')

    observer.WebSocket.onmessage(messageEvent)
    observer.WebSocket.onerror(errorEvent)

    expect(handleMessage).toHaveBeenCalledWith(messageEvent)
    expect(handleError).toHaveBeenCalledWith(errorEvent)
  })

  it('does not require an instance setter to handle reconnect open events', () => {
    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
      reconnection: true,
    })

    expect(() => {
      observer.WebSocket.onopen({
        currentTarget: observer.WebSocket,
      })
    }).not.toThrow()
    expect(observer.reconnectionCount).toBe(0)
  })

  it('ignores invalid json payloads instead of throwing during store dispatch', () => {
    const store = {
      commit: vi.fn(),
      dispatch: vi.fn(),
    }
    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
      format: 'json',
      store,
    })

    expect(() => {
      observer.WebSocket.onmessage({
        data: 'invalid-json',
      })
    }).not.toThrow()

    expect(store.commit).not.toHaveBeenCalled()
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('closes the active socket on disconnect', () => {
    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
    })

    observer.disconnect()

    expect(observer.WebSocket.close).toHaveBeenCalledTimes(1)
  })

  it('does not reconnect after an explicit disconnect closes the socket', async () => {
    vi.useFakeTimers()

    const store = {
      commit: vi.fn(),
      dispatch: vi.fn(),
    }
    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: CloseNotifyingWebSocket,
      reconnection: true,
      reconnectionDelay: 10,
      store,
    })

    observer.disconnect()
    await vi.advanceTimersByTimeAsync(10)

    expect(observer.WebSocket.close).toHaveBeenCalledTimes(1)
    expect(observer.reconnectionCount).toBe(0)
    expect(store.commit).not.toHaveBeenCalledWith('SOCKET_RECONNECT', 1)

    vi.useRealTimers()
  })

  it('exposes the observer factory and safely parses socket payloads', () => {
    expect(parseSocketMessageData({ data: '{"action":"sync"}' })).toEqual({
      action: 'sync',
    })
    expect(parseSocketMessageData({ data: 'invalid-json' })).toBeNull()

    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
    })

    expect(observer.connectionUrl).toBe('ws://socket.example.test/notify')
  })

  it('normalizes secure relative urls and only attaches a json sender once', () => {
    const originalProtocol = window.location.protocol
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...window.location,
        protocol: 'https:',
      },
    })

    expect(normalizeConnectionUrl('//socket.example.test/notify')).toBe('wss://socket.example.test/notify')

    const socket = {
      send: vi.fn(),
      sendObj: vi.fn(),
    }

    attachJsonSender(socket)
    socket.sendObj({ type: 'ping' })

    expect(socket.send).not.toHaveBeenCalled()

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...window.location,
        protocol: originalProtocol,
      },
    })
  })

  it('maps json socket payloads into store commits and dispatches', () => {
    const store = {
      commit: vi.fn(),
      dispatch: vi.fn(),
    }
    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
      format: 'json',
      store,
      mutations: {
        'chat/ADD_MESSAGE': 'message/add',
      },
    })

    observer.WebSocket.onmessage({
      data: JSON.stringify({
        mutation: 'ADD_MESSAGE',
        namespace: 'chat',
        content: 'hello',
      }),
    })
    observer.WebSocket.onmessage({
      data: JSON.stringify({
        action: 'SYNC_STATE',
        namespace: 'chat',
        content: 'world',
      }),
    })

    expect(store.commit).toHaveBeenCalledWith('message/add', {
      mutation: 'ADD_MESSAGE',
      namespace: 'chat',
      content: 'hello',
    })
    expect(store.dispatch).toHaveBeenCalledWith('chat/SYNC_STATE', {
      action: 'SYNC_STATE',
      namespace: 'chat',
      content: 'world',
    })
  })

  it('allows a custom pass-to-store handler to intercept socket events', () => {
    const store = {
      commit: vi.fn(),
      dispatch: vi.fn(),
    }
    const passToStoreHandler = vi.fn((eventName, event, fallback) => {
      if (eventName === 'SOCKET_onmessage') {
        fallback(eventName, event)
      }
    })

    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
      store,
      passToStoreHandler,
    })

    observer.WebSocket.onmessage({ data: 'plain-text' })
    observer.WebSocket.onerror(new Error('socket error'))

    expect(passToStoreHandler).toHaveBeenCalledTimes(2)
    expect(store.commit).toHaveBeenCalledWith('SOCKET_ONMESSAGE', {
      data: 'plain-text',
    })
    expect(store.dispatch).not.toHaveBeenCalled()
  })

  it('reconnects with store notifications and resets the instance on open', async () => {
    vi.useFakeTimers()

    const store = {
      commit: vi.fn(),
      dispatch: vi.fn(),
    }
    const setInstance = vi.fn()
    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
      reconnection: true,
      reconnectionAttempts: 0,
      reconnectionDelay: 10,
      store,
      $setInstance: setInstance,
    })

    observer.WebSocket.onopen({
      currentTarget: observer.WebSocket,
    })
    expect(setInstance).toHaveBeenCalledWith(observer.WebSocket)

    observer.WebSocket.onclose({ code: 1006 })
    await vi.advanceTimersByTimeAsync(10)

    expect(store.commit).toHaveBeenCalledWith('SOCKET_RECONNECT', 1)
    expect(observer.reconnectionCount).toBe(1)

    observer.disconnect()
    vi.useRealTimers()
  })

  it('reports reconnect exhaustion when the retry count has already been exceeded', () => {
    const store = {
      commit: vi.fn(),
      dispatch: vi.fn(),
    }
    const observer = createSocketObserver('ws://socket.example.test/notify', {
      WebSocket: MockWebSocket,
      reconnection: true,
      reconnectionAttempts: -1,
      store,
    })

    observer.WebSocket.onclose({ code: 1006 })

    expect(store.commit).toHaveBeenCalledWith('SOCKET_RECONNECT_ERROR', true)
  })

  it('accepts an already-instantiated socket object and respects the protocol option for constructors', () => {
    const providedSocket = {
      close: vi.fn(),
      send: vi.fn(),
    }

    const objectObserver = createSocketObserver('ws://socket.example.test/object', {
      WebSocket: providedSocket,
    })

    expect(objectObserver.WebSocket).toBe(providedSocket)

    const WebSocketCtor = vi.fn(function WebSocketCtor(url, protocol) {
      return new MockWebSocket(url, protocol)
    })
    const protocolObserver = createSocketObserver('ws://socket.example.test/protocol', {
      WebSocket: WebSocketCtor,
      protocol: 'json',
    })

    expect(WebSocketCtor).toHaveBeenCalledWith('ws://socket.example.test/protocol', 'json')
    expect(protocolObserver.WebSocket.protocol).toBe('json')
  })
})
