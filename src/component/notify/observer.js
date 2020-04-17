/* eslint-disable*/
import Emitter from './emitter'

export default class {
  constructor(connectionUrl, opts = {}) {
    this.format = opts.format && opts.format.toLowerCase()

    if (connectionUrl.startsWith('//')) {
      const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
      connectionUrl = `${scheme}:${connectionUrl}`
    }

    this.connectionUrl = connectionUrl
    this.opts = opts

    this.reconnection = this.opts.reconnection || false
    this.reconnectionAttempts = this.opts.reconnectionAttempts || Infinity
    this.reconnectionDelay = this.opts.reconnectionDelay || 1000
    this.reconnectTimeoutId = 0
    this.reconnectionCount = 0

    this.passToStoreHandler = this.opts.passToStoreHandler || false

    this.connect(connectionUrl, opts)

    if (opts.store) {
      this.store = opts.store
    }
    if (opts.mutations) {
      this.mutations = opts.mutations
    }
    this.onEvent()
  }

  connect(connectionUrl, opts = {}) {
    const protocol = opts.protocol || ''
    this.WebSocket =
      opts.WebSocket || (protocol === '' ? new WebSocket(connectionUrl) : new WebSocket(connectionUrl, protocol))
    if (this.format === 'json') {
      if (!('sendObj' in this.WebSocket)) {
        this.WebSocket.sendObj = obj => this.WebSocket.send(JSON.stringify(obj))
      }
    }

    return this.WebSocket
  }

  reconnect() {
    if (this.reconnectionCount <= this.reconnectionAttempts) {
      this.reconnectionCount++
      clearTimeout(this.reconnectTimeoutId)

      this.reconnectTimeoutId = setTimeout(() => {
        if (this.store) {
          this.passToStore('SOCKET_RECONNECT', this.reconnectionCount)
        }

        this.connect(this.connectionUrl, this.opts)
        this.onEvent()
      }, this.reconnectionDelay)
    } else if (this.store) {
      this.passToStore('SOCKET_RECONNECT_ERROR', true)
    }
  }

  onEvent() {
    ;['onmessage', 'onclose', 'onerror', 'onopen'].forEach(eventType => {
      this.WebSocket[eventType] = event => {
        Emitter.emit(eventType, event)

        if (this.store) {
          this.passToStore(`SOCKET_${eventType}`, event)
        }

        if (this.reconnection && eventType === 'onopen') {
          this.opts.$setInstance(event.currentTarget)
          this.reconnectionCount = 0
        }

        if (this.reconnection && eventType === 'onclose') {
          this.reconnect()
        }
      }
    })
  }

  passToStore(eventName, event) {
    if (this.passToStoreHandler) {
      this.passToStoreHandler(eventName, event, this.defaultPassToStore.bind(this))
    } else {
      this.defaultPassToStore(eventName, event)
    }
  }

  defaultPassToStore(eventName, event) {
    if (!eventName.startsWith('SOCKET_')) {
      return
    }
    let method = 'commit'
    let target = eventName.toUpperCase()
    let msg = event
    if (this.format === 'json' && event.data) {
      msg = JSON.parse(event.data)
      if (msg.mutation) {
        target = [msg.namespace || '', msg.mutation].filter(e => !!e).join('/')
      } else if (msg.action) {
        method = 'dispatch'
        target = [msg.namespace || '', msg.action].filter(e => !!e).join('/')
      }
    }
    if (this.mutations) {
      target = this.mutations[target] || target
    }
    this.store[method](target, msg)
  }
}
