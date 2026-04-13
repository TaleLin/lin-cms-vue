import { createNotifyController } from './controller'

export const notifyConnectKey = Symbol('lin-notify-connect')
export const notifyDisconnectKey = Symbol('lin-notify-disconnect')

function normalizeInstallArgs(connection, options) {
  if (typeof connection === 'object') {
    return {
      connection: '',
      options: connection,
    }
  }

  return {
    connection,
    options,
  }
}

const LinNotify = {
  install(app, rawConnection, rawOptions = {}) {
    const { connection, options } = normalizeInstallArgs(rawConnection, rawOptions)
    const { connect, disconnect } = createNotifyController(connection, options)

    app.provide(notifyConnectKey, connect)
    app.provide(notifyDisconnectKey, disconnect)
  },
}

export default LinNotify
