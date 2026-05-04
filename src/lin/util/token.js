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
  localStorage.setItem('access_token', ensureBearerPrefix(accessToken))
  localStorage.setItem('refresh_token', ensureBearerPrefix(refreshToken))
}

/**
 * 存储access_token
 * @param {string} accessToken
 */
export function saveAccessToken(accessToken) {
  localStorage.setItem('access_token', ensureBearerPrefix(accessToken))
}

/**
 * 获得某个token
 * @param {string} tokenKey
 */
export function getToken(tokenKey) {
  return localStorage.getItem(tokenKey)
}
