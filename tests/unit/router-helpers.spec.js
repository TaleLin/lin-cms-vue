import { describe, expect, it, vi } from 'vitest'

import {
  assertViewRouteConfig,
  createRouteMeta,
  createPublicRouteNameSet,
  createRouteGuard,
  isRedirectOnlyRoute,
  normalizeRouteName,
  requiresLogin,
  shouldCheckRoutePermission,
} from '@/router/router-helpers'

describe('router-helpers', () => {
  it('creates route meta from a fixed semantic field set', () => {
    expect(
      createRouteMeta({
        title: '日志管理',
        icon: 'Memo',
        permission: ['查询所有日志'],
        type: 'view',
        blueBaseColor: '#1890ff',
        inNav: true,
        order: 2,
      }),
    ).toEqual({
      title: '日志管理',
      icon: 'Memo',
      permission: ['查询所有日志'],
      type: 'view',
      blueBaseColor: '#1890ff',
    })

    expect(
      createRouteMeta({
        title: '关于',
      }),
    ).toEqual({
      title: '关于',
      blueBaseColor: '',
    })
  })

  it('fails fast when a routable stage is missing required route fields', () => {
    expect(() => assertViewRouteConfig()).toThrow('Invalid route config: expected an object')
    expect(() =>
      assertViewRouteConfig({
        name: Symbol('about'),
        filePath: 'view/about/about.vue',
      }),
    ).toThrow('Invalid route config: missing route')
    expect(() =>
      assertViewRouteConfig({
        route: '/about',
        name: Symbol('about'),
      }),
    ).toThrow('Invalid route config: missing filePath')
  })

  it('normalizes route names from strings and symbols', () => {
    expect(normalizeRouteName('login')).toBe('login')
    expect(normalizeRouteName(Symbol('login'))).toBe('login')
    expect(normalizeRouteName(Symbol())).toBe('')
    expect(normalizeRouteName(null)).toBe('')
  })

  it('builds the public route set from configured route names', () => {
    const publicRouteNames = createPublicRouteNameSet(['login', Symbol('preview'), '', null])

    expect(publicRouteNames.has('login')).toBe(true)
    expect(publicRouteNames.has('preview')).toBe(true)
    expect(publicRouteNames.size).toBe(2)
  })

  it('requires login when the route name is missing or not public', () => {
    const publicRouteNames = createPublicRouteNameSet(['login'])

    expect(requiresLogin('dashboard', publicRouteNames)).toBe(true)
    expect(requiresLogin(undefined, publicRouteNames)).toBe(true)
    expect(requiresLogin(Symbol('login'), publicRouteNames)).toBe(false)
  })

  it('skips permission checks for public routes and the configured fallback route', () => {
    const publicRouteNames = createPublicRouteNameSet(['login'])

    expect(
      shouldCheckRoutePermission(
        {
          name: 'login',
          path: '/login',
        },
        {
          publicRouteNames,
          noPermissionRedirectPath: '/about',
        },
      ),
    ).toBe(false)

    expect(
      shouldCheckRoutePermission(
        {
          name: 'about',
          path: '/about',
        },
        {
          publicRouteNames,
          noPermissionRedirectPath: '/about',
        },
      ),
    ).toBe(false)

    expect(
      shouldCheckRoutePermission(
        {
          name: 'log',
          path: '/log',
        },
        {
          publicRouteNames,
          noPermissionRedirectPath: '/about',
        },
      ),
    ).toBe(true)
  })

  it('treats redirect-only routes as navigation plumbing instead of protected pages', () => {
    expect(
      isRedirectOnlyRoute({
        path: '/:pathMatch(.*)',
        redirect: '/404',
      }),
    ).toBe(true)

    expect(
      isRedirectOnlyRoute({
        path: '/',
        redirect: '/about',
        component: () => null,
      }),
    ).toBe(false)
  })

  it('redirects unauthenticated users to login on protected routes', () => {
    const loginOut = vi.fn()
    const userStore = {
      loginOut,
      permissions: [],
      user: {},
    }
    const guard = createRouteGuard({
      publicRouteNames: createPublicRouteNameSet(['login']),
      getUserStore: () => userStore,
      hasLoggedInSession: () => false,
      hasPermission: vi.fn(),
      showNoPermissionMessage: vi.fn(),
      scheduleAutoJump: vi.fn(),
    })

    const result = guard({
      name: 'about',
      path: '/about',
      meta: {},
    })

    expect(loginOut).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ path: '/login' })
  })

  it('lets redirect-only routes continue without login or permission checks', () => {
    const hasLoggedInSession = vi.fn()
    const hasPermission = vi.fn()
    const scheduleAutoJump = vi.fn()
    const guard = createRouteGuard({
      publicRouteNames: createPublicRouteNameSet(['login']),
      getUserStore: () => ({
        loginOut: vi.fn(),
        permissions: [],
        user: {},
      }),
      hasLoggedInSession,
      hasPermission,
      showNoPermissionMessage: vi.fn(),
      scheduleAutoJump,
    })

    const result = guard({
      path: '/:pathMatch(.*)',
      redirect: '/404',
    })

    expect(result).toBeUndefined()
    expect(hasLoggedInSession).not.toHaveBeenCalled()
    expect(hasPermission).not.toHaveBeenCalled()
    expect(scheduleAutoJump).not.toHaveBeenCalled()
  })

  it('redirects to about when permission check fails', () => {
    const showNoPermissionMessage = vi.fn()
    const scheduleAutoJump = vi.fn()
    const guard = createRouteGuard({
      publicRouteNames: createPublicRouteNameSet(['login']),
      getUserStore: () => ({
        loginOut: vi.fn(),
        permissions: ['view:logs'],
        user: { admin: false },
      }),
      hasLoggedInSession: () => true,
      hasPermission: () => false,
      showNoPermissionMessage,
      scheduleAutoJump,
    })

    const result = guard({
      name: 'log',
      path: '/log',
      meta: { permission: ['view:logs'] },
    })

    expect(showNoPermissionMessage).toHaveBeenCalledTimes(1)
    expect(scheduleAutoJump).not.toHaveBeenCalled()
    expect(result).toEqual({ path: '/about' })
  })

  it('uses the configured fallback route instead of a hardcoded redirect path', () => {
    const guard = createRouteGuard({
      publicRouteNames: createPublicRouteNameSet(['login']),
      getUserStore: () => ({
        loginOut: vi.fn(),
        permissions: ['view:logs'],
        user: { admin: false },
      }),
      hasLoggedInSession: () => true,
      hasPermission: () => false,
      showNoPermissionMessage: vi.fn(),
      scheduleAutoJump: vi.fn(),
      noPermissionRedirectPath: '/dashboard',
    })

    const result = guard({
      name: 'log',
      path: '/log',
      meta: { permission: ['view:logs'] },
    })

    expect(result).toEqual({ path: '/dashboard' })
  })

  it('schedules auto jump after a successful navigation check', () => {
    const scheduleAutoJump = vi.fn()
    const guard = createRouteGuard({
      publicRouteNames: createPublicRouteNameSet(['login']),
      getUserStore: () => ({
        loginOut: vi.fn(),
        permissions: ['view:about'],
        user: { admin: false },
      }),
      hasLoggedInSession: () => true,
      hasPermission: () => true,
      showNoPermissionMessage: vi.fn(),
      scheduleAutoJump,
    })

    const result = guard({
      name: 'about',
      path: '/about',
      meta: { title: 'About' },
    })

    expect(scheduleAutoJump).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })
})
