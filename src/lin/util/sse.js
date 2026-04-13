import { ElMessage } from 'element-plus'

import { EventSourcePolyfill } from 'event-source-polyfill'
import 'event-source-polyfill/src/eventsource'

import pinia from '@/store'
import { useUserStore } from '@/store/modules/user'
import { getToken } from './token'

export function parseEventPayload(event) {
  if (!event?.data) {
    return null
  }

  try {
    return JSON.parse(event.data)
  } catch (_error) {
    return null
  }
}

export function createSseConnection(
  url,
  events = [],
  {
    accessToken = getToken('access_token'),
    eventSourceFactory = (sourceUrl, sourceOptions) => new EventSourcePolyfill(sourceUrl, sourceOptions),
    message = ElMessage,
    onError = null,
    onOpen = null,
    userStore = useUserStore(pinia),
  } = {},
) {
  const state = {
    message,
    onError,
    onOpen,
    source: eventSourceFactory(url, {
      headers: {
        Authorization: accessToken,
      },
    }),
    userStore,
  }

  function open() {
    state.source.onopen = event => {
      state.onOpen?.(event)
    }
  }

  function error() {
    state.source.onerror = event => {
      state.onError?.(event)
    }
  }

  function addEventListener(eventName) {
    state.source.addEventListener(eventName, event => {
      const payload = parseEventPayload(event)

      if (!payload) {
        return
      }

      state.userStore?.markUnreadMessage?.({
        ...payload,
        id: event.lastEventId,
        is_read: false,
      })

      if (typeof payload.message === 'string' && payload.message) {
        state.message?.warning?.(payload.message)
      }
    })
  }

  open()
  error()
  events.forEach(addEventListener)

  return {
    addEventListener,
    error,
    open,
    get source() {
      return state.source
    },
  }
}
