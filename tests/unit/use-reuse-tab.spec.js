import { nextTick, reactive, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@vueuse/core', () => ({
  onClickOutside: vi.fn(),
}))

import { useReuseTab } from '@/component/layout/use-reuse-tab'

describe('use-reuse-tab', () => {
  let currentRoute
  let navigate
  let userStore
  let storedHistories
  let reuseTabRef
  let emitHistoryCountChange

  beforeEach(() => {
    currentRoute = reactive({
      name: 'log',
      path: '/log',
      matched: [{ path: '/' }, { path: '/log' }],
    })
    navigate = vi.fn()
    userStore = reactive({
      loggedIn: true,
      permissionStageConfig: [],
      defaultRoute: '/about',
      getStageByName: vi.fn(name => (name === 'log' ? { name: 'log', route: '/log', title: '日志管理' } : null)),
      getStageByRoute: vi.fn(path =>
        path === '/about'
          ? { name: 'about', route: '/about', title: '关于' }
          : path === '/log'
            ? { name: 'log', route: '/log', title: '日志管理' }
            : null,
      ),
    })
    storedHistories = ref([
      { path: '/about', routePath: '/about' },
      { path: '/log', routePath: '/log' },
    ])
    reuseTabRef = ref({
      offsetWidth: 200,
      getBoundingClientRect: () => ({ left: 100 }),
    })
    emitHistoryCountChange = vi.fn()
  })

  it('restores histories and keeps only the selected tab when closing others', async () => {
    const reuseTab = useReuseTab({
      currentRoute,
      navigate,
      getStageByName: userStore.getStageByName,
      getStageByRoute: userStore.getStageByRoute,
      defaultRoute: () => userStore.defaultRoute,
      loggedIn: () => userStore.loggedIn,
      permissionStageConfig: () => userStore.permissionStageConfig,
      storedHistories,
      reuseTabRef,
      emitHistoryCountChange,
    })

    reuseTab.openContextMenu(1, { clientX: 150 })
    reuseTab.closeOthers()
    await nextTick()

    expect(navigate).toHaveBeenCalledWith('/log')
    expect(reuseTab.resolvedHistories.value.map(item => item.path)).toEqual(['/log'])
    expect(storedHistories.value).toEqual([
      {
        path: '/log',
        routePath: '/log',
        stageId: 'log',
      },
    ])
  })

  it('clears all tabs and routes back to the default page on logout', async () => {
    const reuseTab = useReuseTab({
      currentRoute,
      navigate,
      getStageByName: userStore.getStageByName,
      getStageByRoute: userStore.getStageByRoute,
      defaultRoute: () => userStore.defaultRoute,
      loggedIn: () => userStore.loggedIn,
      permissionStageConfig: () => userStore.permissionStageConfig,
      storedHistories,
      reuseTabRef,
      emitHistoryCountChange,
    })

    userStore.loggedIn = false
    await nextTick()

    expect(navigate).toHaveBeenCalledWith('/about')
    expect(reuseTab.resolvedHistories.value).toEqual([])
  })

  it('updates context-menu state and can close menu state explicitly', async () => {
    const reuseTab = useReuseTab({
      currentRoute,
      navigate,
      getStageByName: userStore.getStageByName,
      getStageByRoute: userStore.getStageByRoute,
      defaultRoute: () => userStore.defaultRoute,
      loggedIn: () => userStore.loggedIn,
      permissionStageConfig: () => userStore.permissionStageConfig,
      storedHistories,
      reuseTabRef,
      emitHistoryCountChange,
    })

    reuseTab.openContextMenu(0, { clientX: 180 })

    expect(reuseTab.visible.value).toBe(true)
    expect(reuseTab.hasLeft.value).toBe(false)
    expect(reuseTab.hasRight.value).toBe(true)
    expect(reuseTab.contextMenuStyle.value).toEqual({
      left: '74px',
      top: '18px',
    })

    reuseTab.closeMenu()
    await nextTick()

    expect(reuseTab.visible.value).toBe(false)
    expect(reuseTab.hasLeft.value).toBe(true)
    expect(reuseTab.hasRight.value).toBe(true)
  })

  it('closes left and right histories around the selected tab', async () => {
    const reuseTab = useReuseTab({
      currentRoute,
      navigate,
      getStageByName: userStore.getStageByName,
      getStageByRoute: userStore.getStageByRoute,
      defaultRoute: () => userStore.defaultRoute,
      loggedIn: () => userStore.loggedIn,
      permissionStageConfig: () => userStore.permissionStageConfig,
      storedHistories,
      reuseTabRef,
      emitHistoryCountChange,
    })

    currentRoute.path = '/about'
    currentRoute.name = 'about'
    currentRoute.matched = [{ path: '/' }, { path: '/about' }]
    await nextTick()

    currentRoute.path = '/log'
    currentRoute.name = 'log'
    currentRoute.matched = [{ path: '/' }, { path: '/log' }]
    await nextTick()

    reuseTab.openContextMenu(1, { clientX: 180 })
    reuseTab.closeLeft()
    await nextTick()

    expect(reuseTab.resolvedHistories.value.map(item => item.path)).toEqual(['/log'])

    currentRoute.path = '/about'
    currentRoute.name = 'about'
    currentRoute.matched = [{ path: '/' }, { path: '/about' }]
    await nextTick()

    reuseTab.openContextMenu(0, { clientX: 180 })
    reuseTab.closeRight()
    await nextTick()

    expect(reuseTab.resolvedHistories.value.map(item => item.path)).toEqual(['/about'])
  })

  it('closes the current tab, routes to the next path, and persists clearTabs updates', async () => {
    const reuseTab = useReuseTab({
      currentRoute,
      navigate,
      getStageByName: userStore.getStageByName,
      getStageByRoute: userStore.getStageByRoute,
      defaultRoute: () => userStore.defaultRoute,
      loggedIn: () => userStore.loggedIn,
      permissionStageConfig: () => userStore.permissionStageConfig,
      storedHistories,
      reuseTabRef,
      emitHistoryCountChange,
    })

    reuseTab.close(1)
    await nextTick()

    expect(navigate).toHaveBeenCalledWith('/about')
    expect(storedHistories.value.map(item => item.path)).toEqual(['/about'])

    reuseTab.clearTabs()
    await nextTick()

    expect(storedHistories.value).toEqual([])
    expect(emitHistoryCountChange).toHaveBeenLastCalledWith(0)
  })
})
