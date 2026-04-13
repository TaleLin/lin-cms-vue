import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearAuthStorage,
  getToken,
  normalizeStoredToken,
  saveAccessToken,
  saveTokens,
  useTokenRef,
} from '@/lin/util/token'

describe('token helpers', () => {
  beforeEach(() => {
    clearAuthStorage()
    localStorage.clear()
  })

  it('normalizes bearer tokens without duplicating the prefix', () => {
    expect(normalizeStoredToken('access-token')).toBe('Bearer access-token')
    expect(normalizeStoredToken('Bearer access-token')).toBe('Bearer access-token')
    expect(normalizeStoredToken('   ')).toBe('')
  })

  it('keeps reactive token refs in sync with saves and clears', () => {
    const accessToken = useTokenRef('access_token')
    const refreshToken = useTokenRef('refresh_token')

    expect(accessToken.value).toBeNull()
    expect(refreshToken.value).toBeNull()

    saveTokens('access-token', 'Bearer refresh-token')

    expect(accessToken.value).toBe('Bearer access-token')
    expect(refreshToken.value).toBe('Bearer refresh-token')
    expect(getToken('access_token')).toBe('Bearer access-token')

    saveAccessToken('Bearer next-token')

    expect(accessToken.value).toBe('Bearer next-token')
    expect(getToken('access_token')).toBe('Bearer next-token')

    clearAuthStorage()

    expect(accessToken.value).toBeNull()
    expect(refreshToken.value).toBeNull()
    expect(getToken('access_token')).toBeNull()
  })
})
