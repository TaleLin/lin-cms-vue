import { beforeEach, describe, expect, it, vi } from 'vitest'

const vueRouterMocks = vi.hoisted(() => ({
  createRouter: vi.fn(() => ({
    beforeEach: vi.fn(),
  })),
  createWebHashHistory: vi.fn(() => 'history-instance'),
}))

const helperMocks = vi.hoisted(() => ({
  createPublicRouteNameSet: vi.fn(() => new Set(['login'])),
  createRouteGuard: vi.fn(() => 'guard-handler'),
}))

vi.mock('vue-router', () => ({
  createRouter: vueRouterMocks.createRouter,
  createWebHashHistory: vueRouterMocks.createWebHashHistory,
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
  },
}))

vi.mock('@/config/index', () => ({
  default: {
    notLoginRoute: ['login'],
    defaultRoute: '/about',
  },
}))

vi.mock('@/lin/util/auto-jump', () => ({
  scheduleAutoJump: vi.fn(),
}))

vi.mock('@/lin/util/permission', () => ({
  hasPermission: vi.fn(),
}))

vi.mock('@/store/modules/user', () => ({
  useUserStore: vi.fn(),
}))

vi.mock('@/lin/util/session', () => ({
  hasLoggedInSession: vi.fn(),
}))

vi.mock('@/router/route', () => ({
  default: [{ path: '/login', name: 'login' }],
}))

vi.mock('@/router/router-helpers', () => ({
  createPublicRouteNameSet: helperMocks.createPublicRouteNameSet,
  createRouteGuard: helperMocks.createRouteGuard,
}))

import { createAppRouter, registerAppRouteGuard } from '@/router'

describe('router entry', () => {
  beforeEach(() => {
    vueRouterMocks.createRouter.mockClear()
    vueRouterMocks.createWebHashHistory.mockClear()
    helperMocks.createPublicRouteNameSet.mockClear()
    helperMocks.createRouteGuard.mockClear()
  })

  it('creates the app router from explicit history and route dependencies', () => {
    const createRouterFn = vi.fn(() => ({ beforeEach: vi.fn() }))
    const createHistoryFn = vi.fn(() => 'memory-history')
    const appRoutes = [{ path: '/about', name: 'about' }]

    const router = createAppRouter({
      createRouterFn,
      createHistoryFn,
      baseUrl: '/cms/',
      appRoutes,
    })

    expect(createHistoryFn).toHaveBeenCalledWith('/cms/')
    expect(createRouterFn).toHaveBeenCalledWith({
      scrollBehavior: expect.any(Function),
      history: 'memory-history',
      routes: appRoutes,
    })
    expect(createRouterFn.mock.calls[0][0].scrollBehavior()).toEqual({ top: 0 })
    expect(router).toEqual({ beforeEach: expect.any(Function) })
  })

  it('registers the route guard with explicit dependencies and router instance context', () => {
    const beforeEach = vi.fn()
    const routerInstance = { beforeEach }
    const createGuard = vi.fn(() => 'guard-handler')
    const scheduleAutoJumpFn = vi.fn()
    const routeNames = new Set(['login'])
    const getUserStore = vi.fn(() => ({ id: 'store' }))
    const hasLoggedInSessionFn = vi.fn()
    const hasPermissionFn = vi.fn()
    const showNoPermissionMessage = vi.fn()

    const guard = registerAppRouteGuard(routerInstance, {
      createGuard,
      routeNames,
      getUserStore,
      hasLoggedInSessionFn,
      hasPermissionFn,
      showNoPermissionMessage,
      scheduleAutoJumpFn,
      noPermissionRedirectPath: '/dashboard',
    })

    expect(createGuard).toHaveBeenCalledWith({
      publicRouteNames: routeNames,
      getUserStore,
      hasLoggedInSession: hasLoggedInSessionFn,
      hasPermission: hasPermissionFn,
      showNoPermissionMessage,
      scheduleAutoJump: expect.any(Function),
      noPermissionRedirectPath: '/dashboard',
    })
    expect(beforeEach).toHaveBeenCalledWith('guard-handler')
    expect(guard).toBe('guard-handler')

    createGuard.mock.calls[0][0].scheduleAutoJump()
    expect(scheduleAutoJumpFn).toHaveBeenCalledWith(routerInstance)
  })
})
