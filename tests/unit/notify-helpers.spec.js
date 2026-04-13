import { describe, expect, it } from 'vitest'

import {
  buildNotifySocketPath,
  createNotifySocketEvents,
  getUnreadNotificationCount,
  mergeNotificationMessages,
  parseNotifySocketMessage,
} from '@/component/layout/notify-helpers'

describe('notify helpers', () => {
  it('builds websocket paths from bearer tokens', () => {
    expect(buildNotifySocketPath('Bearer token-123')).toBe('//api.s.colorful3.com/ws/message?token=token-123')
    expect(buildNotifySocketPath('')).toBe('')
  })

  it('parses websocket payloads safely', () => {
    expect(parseNotifySocketMessage({ data: '{"id":1,"content":"hello"}' })).toEqual({
      id: 1,
      content: 'hello',
    })
    expect(parseNotifySocketMessage({ data: 'invalid-json' })).toBeNull()
    expect(parseNotifySocketMessage(null)).toBeNull()
  })

  it('merges notifications and counts unread items', () => {
    const unreadMessages = [
      { id: 1, is_read: false },
      { id: 2, is_read: false },
    ]
    const alreadyReadMessages = [{ id: 3, is_read: true }]

    expect(mergeNotificationMessages(unreadMessages, alreadyReadMessages)).toEqual([
      { id: 1, is_read: false },
      { id: 2, is_read: false },
      { id: 3, is_read: true },
    ])
    expect(getUnreadNotificationCount([...unreadMessages, ...alreadyReadMessages])).toBe(2)
  })

  it('creates socket handlers that only forward valid messages to the store', () => {
    const userStore = {
      markUnreadMessage: vi.fn(),
    }
    const onError = vi.fn()
    const events = createNotifySocketEvents(userStore, { onError })

    events.onmessage({ data: '{"id":1,"content":"hello"}' })
    events.onmessage({ data: 'invalid-json' })
    events.onerror(new Error('socket error'))

    expect(userStore.markUnreadMessage).toHaveBeenCalledTimes(1)
    expect(userStore.markUnreadMessage).toHaveBeenCalledWith({
      id: 1,
      content: 'hello',
    })
    expect(onError).toHaveBeenCalledTimes(1)
  })
})
