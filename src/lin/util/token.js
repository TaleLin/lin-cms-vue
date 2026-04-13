import { ref } from 'vue'
import { defaultWindow } from '@vueuse/core'

const tokenRefs = new Map()

function readStoredToken(tokenKey) {
  return defaultWindow?.localStorage?.getItem(tokenKey) ?? null
}

function getTokenRef(tokenKey) {
  if (!tokenRefs.has(tokenKey)) {
    tokenRefs.set(tokenKey, ref(readStoredToken(tokenKey)))
  }

  return tokenRefs.get(tokenKey)
}

function syncTokenRef(tokenKey, value) {
  getTokenRef(tokenKey).value = value
}

function writeStoredToken(tokenKey, value) {
  if (!value) {
    defaultWindow?.localStorage?.removeItem(tokenKey)
    defaultWindow?.sessionStorage?.removeItem(tokenKey)
    syncTokenRef(tokenKey, null)
    return
  }

  defaultWindow?.localStorage?.setItem(tokenKey, value)
  syncTokenRef(tokenKey, value)
}

export function normalizeStoredToken(token) {
  if (typeof token !== 'string') {
    return ''
  }

  const trimmedToken = token.trim()

  if (!trimmedToken) {
    return ''
  }

  return trimmedToken.startsWith('Bearer ') ? trimmedToken : `Bearer ${trimmedToken}`
}

/**
 * 存储tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 */
export function saveTokens(accessToken, refreshToken) {
  writeStoredToken('access_token', normalizeStoredToken(accessToken))
  writeStoredToken('refresh_token', normalizeStoredToken(refreshToken))
}

/**
 * 存储access_token
 * @param {string} accessToken
 */
export function saveAccessToken(accessToken) {
  writeStoredToken('access_token', normalizeStoredToken(accessToken))
}

/**
 * 获得某个token
 * @param {string} tokenKey
 */
export function getToken(tokenKey) {
  const token = readStoredToken(tokenKey)
  syncTokenRef(tokenKey, token)
  return token
}

export function useTokenRef(tokenKey) {
  const tokenRef = getTokenRef(tokenKey)
  const storedToken = readStoredToken(tokenKey)

  if (tokenRef.value !== storedToken) {
    tokenRef.value = storedToken
  }

  return tokenRef
}

export function clearAuthStorage(extraKeys = []) {
  const keys = ['access_token', 'refresh_token', ...extraKeys]

  keys.forEach(key => {
    writeStoredToken(key, null)
  })
}

/**
 * 移除token
 */
export function removeToken() {
  clearAuthStorage()
}
