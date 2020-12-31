import cookies from 'js-cookie'
/**
 * 存储tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 */
export function saveTokens(accessToken, refreshToken) {
  // 存储tokens tokens只进入cookies，不进入vuex全局管理
  cookies.set('access_token', `Bearer ${accessToken}`)
  cookies.set('refresh_token', `Bearer ${refreshToken}`)
}

/**
 * 存储access_token
 * @param {string} accessToken
 */
export function saveAccessToken(accessToken) {
  cookies.set('access_token', `Bearer ${accessToken}`)
}

/**
 * 获得某个token
 * @param {string} tokenKey
 */
export function getToken(tokenKey) {
  return cookies.get(tokenKey)
}

/**
 * 移除token
 */
export function removeToken() {
  cookies.remove('access_token')
  cookies.remove('refresh_token')
  sessionStorage.removeItem('flag')
  sessionStorage.clear()
  localStorage.clear()
}
