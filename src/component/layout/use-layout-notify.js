import { computed } from 'vue'

import { createNotifySocketEvents, mergeNotificationMessages } from './notify-helpers'

export function useLayoutNotify({
  onError,
  userStore,
  mergeMessages = mergeNotificationMessages,
  createSocketEvents = createNotifySocketEvents,
} = {}) {
  const messages = computed(() => mergeMessages(userStore.unreadMessages, userStore.alreadyReadMessages))
  const unreadCount = computed(() => userStore.unreadMessageCount)
  const hidden = computed(() => unreadCount.value === 0)

  function readAll() {
    userStore.readAllMessages()
  }

  function readMessage(message) {
    userStore.readMessage(message)
  }

  function createLayoutNotifyEvents() {
    return createSocketEvents(userStore, { onError })
  }

  return {
    messages,
    unreadCount,
    hidden,
    readAll,
    readMessage,
    createLayoutNotifyEvents,
  }
}
