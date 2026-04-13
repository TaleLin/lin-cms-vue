import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'

const mockUserStore = vi.hoisted(() => ({
  unreadMessages: [],
  alreadyReadMessages: [],
  unreadMessageCount: 0,
  readAllMessages: vi.fn(),
  readMessage: vi.fn(),
  markUnreadMessage: vi.fn(),
}))

vi.mock('@/store/modules/user', () => ({
  useUserStore: () => mockUserStore,
}))

import Config from '@/config'
import { buildNotifySocketPath } from '@/component/layout/notify-helpers'
import { notifyConnectKey, notifyDisconnectKey } from '@/component/layout/use-notify-provider'
import { clearAuthStorage, saveAccessToken } from '@/lin/util/token'

const LinNotifyStub = defineComponent({
  name: 'LinNotify',
  emits: ['readAll', 'readMessage', 'viewAll'],
  setup(_, { emit }) {
    return () =>
      h('div', { class: 'lin-notify-stub' }, [
        h('button', {
          class: 'lin-notify-read-all',
          onClick: () => emit('readAll'),
        }),
        h('button', {
          class: 'lin-notify-read-message',
          onClick: () => emit('readMessage', { id: 9 }),
        }),
        h('button', {
          class: 'lin-notify-view-all',
          onClick: () => emit('viewAll'),
        }),
      ])
  },
})

const ClearTabStub = defineComponent({
  name: 'ClearTab',
  emits: ['clear'],
  setup(_, { emit }) {
    return () =>
      h('button', {
        class: 'clear-tab-stub',
        onClick: () => emit('clear'),
      })
  },
})

describe('NavBar', () => {
  beforeEach(() => {
    clearAuthStorage()
    localStorage.clear()
    Config.websocketEnable = true
    mockUserStore.readAllMessages.mockReset()
    mockUserStore.readMessage.mockReset()
    mockUserStore.markUnreadMessage.mockReset()
  })

  it('reacts to token changes by reconnecting and disconnecting the notify socket', async () => {
    saveAccessToken('first-token')

    const connect = vi.fn()
    const disconnect = vi.fn()
    const notifyEvents = {
      onmessage: vi.fn(),
      onerror: vi.fn(),
    }
    const NavBar = (await import('@/component/layout/nav-bar.vue')).default
    const wrapper = mount(NavBar, {
      props: {
        stageInfo: [{ title: '控制台', route: '/dashboard' }],
        messages: [],
        unreadCount: 0,
        hidden: true,
        logout: vi.fn(),
        navigateToCenter: vi.fn(),
        notifyEvents,
        userStore: mockUserStore,
      },
      global: {
        provide: {
          [notifyConnectKey]: connect,
          [notifyDisconnectKey]: disconnect,
        },
        stubs: {
          LinNotify: LinNotifyStub,
          ThemeSwitcher: true,
          ClearTab: ClearTabStub,
          Screenfull: true,
          User: true,
        },
      },
    })

    expect(connect).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('.item')).toHaveLength(1)
    expect(wrapper.get('.item').text()).toBe('控制台')
    expect(connect).toHaveBeenCalledWith(buildNotifySocketPath('Bearer first-token'), {
      format: 'json',
      events: expect.objectContaining({
        onmessage: expect.any(Function),
        onerror: expect.any(Function),
      }),
    })

    saveAccessToken('second-token')
    await nextTick()

    expect(connect).toHaveBeenCalledTimes(2)
    expect(connect).toHaveBeenLastCalledWith(buildNotifySocketPath('Bearer second-token'), {
      format: 'json',
      events: expect.objectContaining({
        onmessage: expect.any(Function),
        onerror: expect.any(Function),
      }),
    })

    clearAuthStorage()
    await nextTick()

    expect(disconnect).toHaveBeenCalledTimes(1)

    wrapper.unmount()

    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  it('does not connect when websocket support is disabled', async () => {
    Config.websocketEnable = false
    saveAccessToken('disabled-token')

    const connect = vi.fn()
    const disconnect = vi.fn()
    const notifyEvents = {
      onmessage: vi.fn(),
      onerror: vi.fn(),
    }
    const NavBar = (await import('@/component/layout/nav-bar.vue')).default

    mount(NavBar, {
      props: {
        stageInfo: [],
        messages: [],
        unreadCount: 0,
        hidden: true,
        logout: vi.fn(),
        navigateToCenter: vi.fn(),
        notifyEvents,
        userStore: mockUserStore,
      },
      global: {
        provide: {
          [notifyConnectKey]: connect,
          [notifyDisconnectKey]: disconnect,
        },
        stubs: {
          LinNotify: LinNotifyStub,
          ThemeSwitcher: true,
          ClearTab: ClearTabStub,
          Screenfull: true,
          User: true,
        },
      },
    })

    expect(connect).not.toHaveBeenCalled()
    expect(disconnect).not.toHaveBeenCalled()
  })

  it('forwards notify and clear-tab events through explicit handlers', async () => {
    saveAccessToken('forward-token')

    const connect = vi.fn()
    const disconnect = vi.fn()
    const NavBar = (await import('@/component/layout/nav-bar.vue')).default
    const wrapper = mount(NavBar, {
      props: {
        stageInfo: [{ title: '控制台', route: '/dashboard' }],
        messages: [],
        unreadCount: 0,
        hidden: true,
        logout: vi.fn(),
        navigateToCenter: vi.fn(),
        notifyEvents: {
          onmessage: vi.fn(),
          onerror: vi.fn(),
        },
        userStore: mockUserStore,
      },
      global: {
        provide: {
          [notifyConnectKey]: connect,
          [notifyDisconnectKey]: disconnect,
        },
        stubs: {
          LinNotify: LinNotifyStub,
          ThemeSwitcher: true,
          ClearTab: ClearTabStub,
          Screenfull: true,
          User: true,
        },
      },
    })

    await wrapper.get('.lin-notify-read-all').trigger('click')
    await wrapper.get('.lin-notify-read-message').trigger('click')
    await wrapper.get('.lin-notify-view-all').trigger('click')
    await wrapper.get('.clear-tab-stub').trigger('click')

    expect(wrapper.emitted('readAll')).toEqual([[]])
    expect(wrapper.emitted('readMessage')).toEqual([[{ id: 9 }]])
    expect(wrapper.emitted('viewAll')).toEqual([[]])
    expect(wrapper.emitted('clearReuseTab')).toEqual([[]])
    expect(wrapper.findAll('.item')).toHaveLength(1)
    expect(wrapper.get('.item').text()).toBe('控制台')
  })
})
