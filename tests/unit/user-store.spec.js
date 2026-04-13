import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useUserStore } from '@/store/modules/user'

describe('user store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes stage lookup methods without relying on computed wrapper getters', () => {
    const userStore = useUserStore()
    const aboutStage = userStore.getStageByRoute('/about')

    expect(aboutStage).toMatchObject({
      route: '/about',
      title: '林间有风',
    })
    expect(userStore.getStageByName(aboutStage.name)).toBe(aboutStage)
    expect(userStore.getStageInfo(aboutStage.name)).toEqual([aboutStage])
  })

  it('updates permission-based stage lookup when permissions change', () => {
    const userStore = useUserStore()

    expect(userStore.getStageByRoute('/log')).toBeUndefined()

    userStore.setUserPermissions([
      {
        group: [{ permission: '查询日志' }],
      },
    ])

    expect(userStore.getStageByRoute('/log')).toMatchObject({
      route: '/log',
      title: '日志管理',
    })
  })

  it('clears message state and permissions when logging out', () => {
    const userStore = useUserStore()

    userStore.setUser({ id: 1, nickname: 'lin' })
    userStore.setLoggedIn(true)
    userStore.setUserPermissions([
      {
        group: [{ permission: '查询日志' }],
      },
    ])
    userStore.markUnreadMessage({ id: 1 })
    userStore.markReadMessage({ id: 2 })

    userStore.loginOut()

    expect(userStore.loggedIn).toBe(false)
    expect(userStore.user).toEqual({})
    expect(userStore.permissions).toEqual([])
    expect(userStore.unreadMessages).toEqual([])
    expect(userStore.alreadyReadMessages).toEqual([])
  })

  it('marks unread messages as read in bulk', () => {
    const userStore = useUserStore()

    userStore.markUnreadMessage({ id: 1 })
    userStore.markUnreadMessage({ id: 2 })

    userStore.readAllMessages()

    expect(userStore.unreadMessages).toEqual([])
    expect(userStore.alreadyReadMessages).toEqual([
      { id: 1, is_read: true },
      { id: 2, is_read: true },
    ])
  })

  it('reads a single unread message and ignores unknown message ids', () => {
    const userStore = useUserStore()

    userStore.markUnreadMessage({ id: 1, content: '待处理' })
    userStore.markUnreadMessage({ id: 2, content: '待处理 2' })
    userStore.readMessage({ id: 2 })
    userStore.readMessage({ id: 99 })

    expect(userStore.unreadMessages).toEqual([{ id: 1, content: '待处理', is_read: false }])
    expect(userStore.alreadyReadMessages).toEqual([{ id: 2, content: '待处理 2', is_read: true }])
    expect(userStore.unreadMessageCount).toBe(1)
  })

  it('keeps unread state stable when removing a missing unread message and sets login state together', () => {
    const userStore = useUserStore()

    userStore.markUnreadMessage({ id: 1 })
    userStore.removeUnreadMessage(99)
    userStore.setUserAndState({ id: 7, nickname: 'lin' })

    expect(userStore.unreadMessages).toEqual([{ id: 1, is_read: false }])
    expect(userStore.user).toEqual({ id: 7, nickname: 'lin' })
    expect(userStore.loggedIn).toBe(true)
  })

  it('syncs flattened permissions when the authenticated user payload already contains permission groups', () => {
    const userStore = useUserStore()

    userStore.setUserAndState({
      id: 7,
      nickname: 'lin',
      permissions: [
        {
          group: [{ permission: '查询日志' }],
        },
      ],
    })

    expect(userStore.loggedIn).toBe(true)
    expect(userStore.permissions).toEqual(['查询日志'])
  })

  it('keeps log stage visible for legacy log permission names', () => {
    const userStore = useUserStore()

    userStore.setUserPermissions([
      {
        group: [{ permission: '查询所有日志' }],
      },
    ])

    expect(userStore.getStageByRoute('/log')).toMatchObject({
      route: '/log',
      title: '日志管理',
    })
  })

  it('keeps route and sidebar settings as static config values instead of mutable store state', () => {
    const userStore = useUserStore()

    expect(userStore.defaultRoute).toBe('/about')
    expect(userStore.sidebarLevel).toBe(3)
    expect('stageConfig' in userStore).toBe(false)
  })
})
