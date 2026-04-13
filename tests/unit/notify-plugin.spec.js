import { describe, expect, it, vi } from 'vitest'

import LinNotify, { notifyConnectKey, notifyDisconnectKey } from '@/component/notify'

class MockWebSocket {
  constructor(url) {
    this.url = url
    this.close = vi.fn()
    this.onmessage = null
    this.onclose = null
    this.onerror = null
    this.onopen = null
  }
}

function createAppStub() {
  const provided = new Map()

  return {
    provided,
    provide: vi.fn((key, value) => {
      provided.set(key, value)
    }),
  }
}

describe('notify plugin', () => {
  it('provides explicit connect and disconnect handlers without globally registering the notify component', () => {
    const app = createAppStub()

    LinNotify.install(app, 'ws://default.example.test', {
      WebSocket: MockWebSocket,
      reconnection: true,
    })

    const connect = app.provided.get(notifyConnectKey)
    const disconnect = app.provided.get(notifyDisconnectKey)

    expect(typeof connect).toBe('function')
    expect(typeof disconnect).toBe('function')

    const socket = connect('ws://custom.example.test')
    expect(socket.url).toBe('ws://custom.example.test')

    disconnect()
    expect(socket.close).toHaveBeenCalledTimes(1)
  })

  it('accepts an options object as the first install argument and falls back to an empty default connection', () => {
    const app = createAppStub()

    LinNotify.install(app, {
      WebSocket: MockWebSocket,
      reconnection: false,
    })

    const connect = app.provided.get(notifyConnectKey)
    const disconnect = app.provided.get(notifyDisconnectKey)
    const socket = connect()

    expect(socket.url).toBe('')

    disconnect()
    expect(socket.close).toHaveBeenCalledTimes(1)
  })
})
