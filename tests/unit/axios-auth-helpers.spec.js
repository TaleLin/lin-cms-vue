import { describe, expect, it, vi } from 'vitest'

import {
  createRefreshRequestRetry,
  isAccessTokenException,
  isRefreshTokenException,
  scheduleLogoutOnRefreshFailure,
} from '@/lin/plugin/axios-auth-helpers'

describe('axios auth helpers', () => {
  it('classifies refresh and access token exception codes', () => {
    expect(isRefreshTokenException(10042)).toBe(true)
    expect(isRefreshTokenException(10041)).toBe(false)
    expect(isAccessTokenException(10041)).toBe(true)
    expect(isAccessTokenException(10042)).toBe(false)
  })

  it('schedules logout when refresh token exceptions occur', () => {
    const setTimer = vi.fn(fn => fn())
    const logoutAndRedirectToLogin = vi.fn()
    const getUserStore = vi.fn(() => ({ id: 'user-store' }))
    const router = { push: vi.fn() }

    expect(
      scheduleLogoutOnRefreshFailure(10042, {
        getUserStore,
        router,
        logoutAndRedirectToLogin,
        setTimer,
        delay: 10,
      }),
    ).toBe(true)

    expect(setTimer).toHaveBeenCalledOnce()
    expect(logoutAndRedirectToLogin).toHaveBeenCalledWith({ id: 'user-store' }, router)
  })

  it('does not schedule logout for non-refresh-token errors', () => {
    const setTimer = vi.fn()

    expect(scheduleLogoutOnRefreshFailure(10041, { setTimer })).toBe(false)
    expect(setTimer).not.toHaveBeenCalled()
  })

  it('reuses the refresh request and retries the original request after saving the access token', async () => {
    const saveAccessToken = vi.fn()
    const request = vi.fn()
    let refreshResolved

    const refreshPromise = new Promise(resolve => {
      refreshResolved = resolve
    })

    request.mockImplementation(config => {
      if (config === 'cms/user/refresh') {
        return refreshPromise
      }

      return Promise.resolve({
        ok: true,
        config,
      })
    })

    const retryAfterRefresh = createRefreshRequestRetry({
      request,
      saveAccessToken,
    })

    const firstRetry = retryAfterRefresh({
      config: { url: 'cms/book', method: 'get' },
    })
    const secondRetry = retryAfterRefresh({
      config: { url: 'cms/log', method: 'get' },
    })

    expect(request).toHaveBeenCalledTimes(1)
    expect(request).toHaveBeenCalledWith('cms/user/refresh')

    refreshResolved({
      access_token: 'Bearer next-token',
    })

    await expect(firstRetry).resolves.toMatchObject({
      ok: true,
      config: { url: 'cms/book', method: 'get' },
    })
    await expect(secondRetry).resolves.toMatchObject({
      ok: true,
      config: { url: 'cms/log', method: 'get' },
    })

    expect(saveAccessToken).toHaveBeenCalledWith('Bearer next-token')
    expect(request).toHaveBeenCalledTimes(3)
  })

  it('propagates refresh failures without attempting to save a broken access token', async () => {
    const saveAccessToken = vi.fn()
    const refreshFailure = new Error('refresh failed')
    const request = vi.fn(config => {
      if (config === 'cms/user/refresh') {
        return Promise.reject(refreshFailure)
      }

      return Promise.resolve({
        ok: true,
        config,
      })
    })

    const retryAfterRefresh = createRefreshRequestRetry({
      request,
      saveAccessToken,
    })

    await expect(
      retryAfterRefresh({
        config: { url: 'cms/book', method: 'get' },
      }),
    ).rejects.toBe(refreshFailure)

    expect(saveAccessToken).not.toHaveBeenCalled()
    expect(request).toHaveBeenCalledTimes(1)
  })
})
