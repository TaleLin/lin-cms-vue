import { createSocketObserver } from './observer'

export function createNotifyController(defaultConnection, options = {}) {
  let observer = null

  function disconnect() {
    if (!observer) {
      return
    }

    observer.reconnection = false
    observer.disconnect()
    observer = null
  }

  function connect(connectionUrl = defaultConnection, connectionOptions = {}) {
    disconnect()

    const nextOptions = {
      ...options,
      ...connectionOptions,
    }

    observer = createSocketObserver(connectionUrl, nextOptions)
    return observer.WebSocket
  }

  return {
    connect,
    disconnect,
  }
}
