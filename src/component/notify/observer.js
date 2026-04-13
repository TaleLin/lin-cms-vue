import { defaultWindow } from '@vueuse/core'

export const SOCKET_EVENTS = ['onmessage', 'onclose', 'onerror', 'onopen']

export function normalizeConnectionUrl(connectionUrl) {
  if (connectionUrl.startsWith('//')) {
    const scheme = defaultWindow?.location?.protocol === 'https:' ? 'wss' : 'ws'
    return `${scheme}:${connectionUrl}`
  }

  return connectionUrl
}

export function attachJsonSender(socket) {
  if (!('sendObj' in socket)) {
    socket.sendObj = payload => socket.send(JSON.stringify(payload))
  }
}

export function parseSocketMessageData(event) {
  if (!event?.data) {
    return null
  }

  try {
    return JSON.parse(event.data)
  } catch (_error) {
    return null
  }
}

export function createSocketObserver(connectionUrl, opts = {}) {
  const state = {
    format: opts.format?.toLowerCase(),
    connectionUrl: normalizeConnectionUrl(connectionUrl),
    opts,
    events: opts.events || {},
    reconnection: opts.reconnection || false,
    reconnectionAttempts: opts.reconnectionAttempts || Infinity,
    reconnectionDelay: opts.reconnectionDelay || 1000,
    reconnectTimeoutId: 0,
    reconnectionCount: 0,
    passToStoreHandler: opts.passToStoreHandler || false,
    socket: null,
    store: opts.store || null,
    mutations: opts.mutations || null,
    manuallyDisconnected: false,
  }

  function clearReconnectTimeout() {
    clearTimeout(state.reconnectTimeoutId)
    state.reconnectTimeoutId = 0
  }

  function defaultPassToStore(eventName, event) {
    if (!eventName.startsWith('SOCKET_')) {
      return
    }

    let method = 'commit'
    let target = eventName.toUpperCase()
    let payload = event

    if (state.format === 'json' && event.data) {
      payload = parseSocketMessageData(event)

      if (!payload) {
        return
      }

      if (payload.mutation) {
        target = [payload.namespace || '', payload.mutation].filter(Boolean).join('/')
      } else if (payload.action) {
        method = 'dispatch'
        target = [payload.namespace || '', payload.action].filter(Boolean).join('/')
      }
    }

    if (state.mutations) {
      target = state.mutations[target] || target
    }

    state.store[method](target, payload)
  }

  function passToStore(eventName, event) {
    if (state.passToStoreHandler) {
      state.passToStoreHandler(eventName, event, defaultPassToStore)
      return
    }

    defaultPassToStore(eventName, event)
  }

  function bindSocketEvents() {
    SOCKET_EVENTS.forEach(eventType => {
      state.socket[eventType] = event => {
        state.events[eventType]?.(event)

        if (state.store) {
          passToStore(`SOCKET_${eventType}`, event)
        }

        if (state.reconnection && eventType === 'onopen') {
          state.opts.$setInstance?.(event.currentTarget)
          state.reconnectionCount = 0
        }

        if (state.reconnection && !state.manuallyDisconnected && eventType === 'onclose') {
          reconnect()
        }
      }
    })
  }

  function connect(nextConnectionUrl = state.connectionUrl, nextOpts = state.opts) {
    state.manuallyDisconnected = false
    const protocol = nextOpts.protocol || ''
    const WebSocketImpl = nextOpts.WebSocket || WebSocket

    state.socket = typeof WebSocketImpl === 'function' ? new WebSocketImpl(nextConnectionUrl, protocol) : WebSocketImpl

    if (state.format === 'json') {
      attachJsonSender(state.socket)
    }

    bindSocketEvents()

    return state.socket
  }

  function reconnect() {
    if (state.reconnectionCount <= state.reconnectionAttempts) {
      state.reconnectionCount += 1
      clearReconnectTimeout()

      state.reconnectTimeoutId = setTimeout(() => {
        if (state.store) {
          passToStore('SOCKET_RECONNECT', state.reconnectionCount)
        }

        connect(state.connectionUrl, state.opts)
      }, state.reconnectionDelay)
      return
    }

    if (state.store) {
      passToStore('SOCKET_RECONNECT_ERROR', true)
    }
  }

  function disconnect() {
    state.manuallyDisconnected = true
    clearReconnectTimeout()

    if (!state.socket) {
      return
    }

    SOCKET_EVENTS.forEach(eventType => {
      state.socket[eventType] = null
    })

    if (typeof state.socket?.close === 'function') {
      state.socket.close()
    }
  }

  connect()

  return {
    connect,
    defaultPassToStore,
    disconnect,
    passToStore,
    get WebSocket() {
      return state.socket
    },
    get connectionUrl() {
      return state.connectionUrl
    },
    get reconnection() {
      return state.reconnection
    },
    set reconnection(value) {
      state.reconnection = value
    },
    get reconnectionCount() {
      return state.reconnectionCount
    },
  }
}
