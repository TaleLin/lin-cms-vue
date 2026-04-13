import { nextTick, reactive } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useLayoutNotify } from '@/component/layout/use-layout-notify'

function createUserStore() {
  return reactive({
    unreadMessages: [{ id: 1, title: '未读消息', is_read: false }],
    alreadyReadMessages: [{ id: 2, title: '已读消息', is_read: true }],
    get unreadMessageCount() {
      return this.unreadMessages.length
    },
    readAllMessages: vi.fn(function readAllMessages() {
      this.alreadyReadMessages = [
        ...this.alreadyReadMessages,
        ...this.unreadMessages.map(message => ({ ...message, is_read: true })),
      ]
      this.unreadMessages = []
    }),
    readMessage: vi.fn(function readMessage(message) {
      this.unreadMessages = this.unreadMessages.filter(item => item.id !== message.id)
      this.alreadyReadMessages = [...this.alreadyReadMessages, { ...message, is_read: true }]
    }),
    markUnreadMessage: vi.fn(function markUnreadMessage(message) {
      this.unreadMessages = [...this.unreadMessages, message]
    }),
  })
}

describe('use-layout-notify', () => {
  it('derives merged messages and unread visibility from the user store', async () => {
    const userStore = createUserStore()
    const { hidden, messages, unreadCount } = useLayoutNotify({ userStore })

    expect(messages.value.map(item => item.id)).toEqual([1, 2])
    expect(unreadCount.value).toBe(1)
    expect(hidden.value).toBe(false)

    userStore.unreadMessages = []
    await nextTick()

    expect(unreadCount.value).toBe(0)
    expect(hidden.value).toBe(true)
  })

  it('forwards read operations to the user store', () => {
    const userStore = createUserStore()
    const { readAll, readMessage } = useLayoutNotify({ userStore })

    readMessage({ id: 1, title: '未读消息', is_read: false })
    expect(userStore.readMessage).toHaveBeenCalledWith({ id: 1, title: '未读消息', is_read: false })

    readAll()
    expect(userStore.readAllMessages).toHaveBeenCalledTimes(1)
  })

  it('creates socket events from the shared notify helper contract', () => {
    const userStore = createUserStore()
    const onError = vi.fn()
    const socketEvents = {
      onmessage: vi.fn(),
      onerror: vi.fn(),
    }
    const createSocketEvents = vi.fn(() => socketEvents)
    const { createLayoutNotifyEvents } = useLayoutNotify({
      onError,
      userStore,
      createSocketEvents,
    })

    const events = createLayoutNotifyEvents()

    expect(createSocketEvents).toHaveBeenCalledWith(userStore, { onError })
    expect(events).toBe(socketEvents)
  })
})
