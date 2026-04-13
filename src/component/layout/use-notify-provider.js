import { onBeforeUnmount, provide } from 'vue'
import { createNotifyController } from '@/component/notify/controller'
import { notifyConnectKey, notifyDisconnectKey } from '@/component/notify'

export function useNotifyProvider(connection, options = {}) {
  const { connect, disconnect } = createNotifyController(connection, options)

  provide(notifyConnectKey, connect)
  provide(notifyDisconnectKey, disconnect)

  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    connect,
    disconnect,
  }
}

export { notifyConnectKey, notifyDisconnectKey }
