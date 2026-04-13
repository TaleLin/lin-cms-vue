import { beforeEach, describe, expect, it, vi } from 'vitest'

import { hasLoggedInSession, hasTokenValue, logoutAndRedirectToLogin, redirectToLogin } from '@/lin/util/session'

describe('session helpers', () => {
  beforeEach(() => {
    localStorage.clear()
    window.location.hash = '#/about'
  })

  it('detects non-empty bearer tokens', () => {
    expect(hasTokenValue('Bearer token-123')).toBe(true)
    expect(hasTokenValue('')).toBe(false)
    expect(hasTokenValue('   ')).toBe(false)
  })

  it('requires both persisted login state and access token', () => {
    expect(hasLoggedInSession({ loggedIn: true })).toBe(false)

    localStorage.setItem('access_token', 'Bearer token-123')

    expect(hasLoggedInSession({ loggedIn: false })).toBe(false)
    expect(hasLoggedInSession({ loggedIn: true })).toBe(true)
  })

  it('redirects to the login hash route', async () => {
    const replace = vi.fn().mockResolvedValue()
    const router = {
      currentRoute: {
        value: {
          path: '/about',
        },
      },
      replace,
    }

    await redirectToLogin(router)

    expect(replace).toHaveBeenCalledWith('/login')
    expect(window.location.hash).toBe('#/login')
  })

  it('falls back to the login hash route when router navigation rejects', async () => {
    const replace = vi.fn().mockRejectedValue(new Error('navigation failed'))
    const router = {
      currentRoute: {
        value: {
          path: '/about',
        },
      },
      replace,
    }

    await expect(redirectToLogin(router)).resolves.toBeUndefined()

    expect(replace).toHaveBeenCalledWith('/login')
    expect(window.location.hash).toBe('#/login')
  })

  it('logs out before redirecting to login', async () => {
    const replace = vi.fn().mockResolvedValue()
    const loginOut = vi.fn()
    const router = {
      currentRoute: {
        value: {
          path: '/about',
        },
      },
      replace,
    }

    await logoutAndRedirectToLogin({ loginOut }, router)

    expect(loginOut).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/login')
    expect(window.location.hash).toBe('#/login')
  })
})
