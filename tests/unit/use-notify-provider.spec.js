import { defineComponent, inject } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const controllerMocks = vi.hoisted(() => ({
  connect: vi.fn(() => ({ id: 'socket' })),
  disconnect: vi.fn(),
  createNotifyController: vi.fn(),
}))

vi.mock('@/component/notify/controller', () => ({
  createNotifyController: controllerMocks.createNotifyController,
}))

import { notifyConnectKey as pluginConnectKey, notifyDisconnectKey as pluginDisconnectKey } from '@/component/notify'
import { useNotifyProvider, notifyConnectKey, notifyDisconnectKey } from '@/component/layout/use-notify-provider'

describe('use-notify-provider', () => {
  beforeEach(() => {
    controllerMocks.connect.mockReset()
    controllerMocks.disconnect.mockReset()
    controllerMocks.createNotifyController.mockReset().mockReturnValue({
      connect: controllerMocks.connect,
      disconnect: controllerMocks.disconnect,
    })
  })

  it('reuses the plugin injection keys instead of creating a second symbol contract', () => {
    expect(notifyConnectKey).toBe(pluginConnectKey)
    expect(notifyDisconnectKey).toBe(pluginDisconnectKey)
  })

  it('provides connect and disconnect handlers under the shared notify keys', () => {
    const Consumer = defineComponent({
      name: 'NotifyProviderConsumer',
      setup() {
        const connect = inject(pluginConnectKey, null)
        const disconnect = inject(pluginDisconnectKey, null)

        return {
          connect,
          disconnect,
        }
      },
      render() {
        return null
      },
    })

    const Host = defineComponent({
      name: 'NotifyProviderHost',
      components: { Consumer },
      setup() {
        useNotifyProvider('ws://notify.example.test', {
          reconnection: true,
        })

        return {}
      },
      template: '<Consumer ref="consumer" />',
    })

    const wrapper = mount(Host)
    const consumer = wrapper.getComponent(Consumer).vm

    expect(controllerMocks.createNotifyController).toHaveBeenCalledWith('ws://notify.example.test', {
      reconnection: true,
    })
    expect(typeof consumer.connect).toBe('function')
    expect(typeof consumer.disconnect).toBe('function')
    expect(consumer.connect()).toEqual({ id: 'socket' })
    consumer.disconnect()
    expect(controllerMocks.connect).toHaveBeenCalledTimes(1)
    expect(controllerMocks.disconnect).toHaveBeenCalledTimes(1)
  })

  it('disconnects the active notify observer when the provider host unmounts', () => {
    const Host = defineComponent({
      name: 'NotifyProviderUnmountHost',
      setup() {
        useNotifyProvider('ws://notify.example.test', {
          reconnection: true,
        })

        return {}
      },
      render() {
        return null
      },
    })

    const wrapper = mount(Host)

    wrapper.unmount()

    expect(controllerMocks.disconnect).toHaveBeenCalledTimes(1)
  })
})
