import { post, get, put } from '@/lin/plugin/axios'

import Config from '@/config'
import { createSseConnection } from '@/lin/util/sse'

export function createNotifyModel(
  url,
  {
    apiGet = get,
    apiPost = post,
    apiPut = put,
    baseURL = Config.baseURL,
    sseFactory = (connectionUrl, events) => createSseConnection(connectionUrl, events),
  } = {},
) {
  const state = {
    url,
    events: null,
    sse: null,
  }

  async function getEvents() {
    const result = await apiGet('cms/notify/events')
    state.events = result.events
    return state.events
  }

  async function initSse() {
    const events = await getEvents()
    state.sse = sseFactory(baseURL + state.url, events)
    return state.sse
  }

  function createEvents(groupId, events) {
    return apiPost('cms/notify/events', {
      group_id: groupId,
      events,
    })
  }

  function updateEvents(groupId, events) {
    return apiPut('cms/notify/events', {
      group_id: groupId,
      events,
    })
  }

  return {
    createEvents,
    getEvents,
    initSse,
    get events() {
      return state.events
    },
    get sse() {
      return state.sse
    },
    updateEvents,
    get url() {
      return state.url
    },
  }
}

export const notifyModel = createNotifyModel('')
