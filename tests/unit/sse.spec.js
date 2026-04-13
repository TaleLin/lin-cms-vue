import { describe, expect, it, vi } from 'vitest'

import { createSseConnection, parseEventPayload } from '@/lin/util/sse'

function createSourceStub() {
  return {
    addEventListener: vi.fn(),
    onerror: null,
    onopen: null,
  }
}

describe('sse', () => {
  it('parses event payloads safely', () => {
    expect(parseEventPayload({ data: '{"message":"hello"}' })).toEqual({
      message: 'hello',
    })
    expect(parseEventPayload({ data: 'invalid-json' })).toBeNull()
    expect(parseEventPayload(null)).toBeNull()
  })

  it('marks unread messages and warns through injected dependencies', () => {
    const source = createSourceStub()
    const eventSourceFactory = vi.fn(() => source)
    const userStore = {
      markUnreadMessage: vi.fn(),
    }
    const message = {
      warning: vi.fn(),
    }

    createSseConnection('https://api.example.test/sse', ['notice'], {
      accessToken: 'Bearer access-token',
      eventSourceFactory,
      message,
      userStore,
    })

    const [, listener] = source.addEventListener.mock.calls[0]
    listener({
      data: '{"message":"新通知","content":"hello"}',
      lastEventId: 'evt-1',
    })

    expect(eventSourceFactory).toHaveBeenCalledWith('https://api.example.test/sse', {
      headers: {
        Authorization: 'Bearer access-token',
      },
    })
    expect(userStore.markUnreadMessage).toHaveBeenCalledWith({
      message: '新通知',
      content: 'hello',
      id: 'evt-1',
      is_read: false,
    })
    expect(message.warning).toHaveBeenCalledWith('新通知')
  })

  it('ignores invalid payloads and forwards lifecycle hooks without logging', () => {
    const source = createSourceStub()
    const onOpen = vi.fn()
    const onError = vi.fn()
    const userStore = {
      markUnreadMessage: vi.fn(),
    }
    const message = {
      warning: vi.fn(),
    }

    createSseConnection('https://api.example.test/sse', ['notice'], {
      accessToken: 'Bearer access-token',
      eventSourceFactory: () => source,
      message,
      onError,
      onOpen,
      userStore,
    })

    const [, listener] = source.addEventListener.mock.calls[0]
    listener({
      data: 'invalid-json',
      lastEventId: 'evt-2',
    })
    source.onopen?.({ type: 'open' })
    source.onerror?.({ type: 'error' })

    expect(userStore.markUnreadMessage).not.toHaveBeenCalled()
    expect(message.warning).not.toHaveBeenCalled()
    expect(onOpen).toHaveBeenCalledWith({ type: 'open' })
    expect(onError).toHaveBeenCalledWith({ type: 'error' })
  })

  it('exposes the connection factory and the active source', () => {
    const source = createSourceStub()
    const connection = createSseConnection('https://api.example.test/sse', [], {
      accessToken: 'Bearer access-token',
      eventSourceFactory: () => source,
      userStore: null,
    })

    expect(connection.source).toBe(source)
  })
})
