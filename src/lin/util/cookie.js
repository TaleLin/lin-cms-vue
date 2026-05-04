import cookies from 'js-cookie'

/**
 * 确保token不重复添加 Bearer 前缀
 * @param {string} token
 */
function ensureBearerPrefix(token) {
  if (!token) return ''
  return token.startsWith('Bearer ') ? token : `Bearer ${token}`
}

/**
 * 存储tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 */
export function saveTokens(accessToken, refreshToken) {
  // 存储tokens tokens只进入cookies，不进入vuex全局管理
  cookies.set('access_token', ensureBearerPrefix(accessToken))
  cookies.set('refresh_token', ensureBearerPrefix(refreshToken))
}

/**
 * 存储access_token
 * @param {string} accessToken
 */
export function saveAccessToken(accessToken) {
  cookies.set('access_token', ensureBearerPrefix(accessToken))
}

/**
 * 获得某个token
 * @param {string} tokenKey
 */
export function getToken(tokenKey) {
  return cookies.get(tokenKey)
}
