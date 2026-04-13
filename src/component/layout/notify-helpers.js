const NOTIFY_SOCKET_BASE = '//api.s.colorful3.com/ws/message'

export function buildNotifySocketPath(accessToken = '') {
  if (!accessToken) {
    return ''
  }

  const [, token = accessToken] = accessToken.split(' ')
  return `${NOTIFY_SOCKET_BASE}?token=${token}`
}

export function parseNotifySocketMessage(event) {
  if (!event?.data) {
    return null
  }

  try {
    return JSON.parse(event.data)
  } catch (_error) {
    return null
  }
}

export function mergeNotificationMessages(unreadMessages = [], alreadyReadMessages = []) {
  return [...unreadMessages, ...alreadyReadMessages]
}

export function getUnreadNotificationCount(messages = []) {
  return messages.filter(message => message.is_read === false).length
}

export function createNotifySocketEvents(userStore, { onError } = {}) {
  return {
    onmessage(event) {
      const message = parseNotifySocketMessage(event)

      if (message) {
        userStore?.markUnreadMessage?.(message)
      }
    },
    onerror(event) {
      onError?.(event)
    },
  }
}
