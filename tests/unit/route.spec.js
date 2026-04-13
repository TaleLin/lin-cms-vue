import { describe, expect, it, vi } from 'vitest'

import { createAppRoutes } from '@/router/route'

describe('route config', () => {
  it('uses the configured default route instead of a hardcoded home redirect', () => {
    const rootComponent = vi.fn()
    const loginComponent = vi.fn()
    const homeRoutes = [{ path: '/dashboard', name: 'dashboard' }]

    expect(
      createAppRoutes({
        homeRoutes,
        defaultRoute: '/dashboard',
        rootComponent,
        loginComponent,
      }),
    ).toEqual([
      {
        path: '/',
        name: 'Home',
        redirect: '/dashboard',
        component: rootComponent,
        children: homeRoutes,
      },
      {
        path: '/login',
        name: 'login',
        component: loginComponent,
      },
      {
        path: '/:pathMatch(.*)',
        redirect: '/404',
      },
    ])
  })
})
