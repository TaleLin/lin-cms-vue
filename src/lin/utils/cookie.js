import cookies from 'js-cookie'
import { getDateAfterHours, getDateAfterDays } from './date'
// const after = new Date(now.setHours(now.getHours() + 3));
/**
 * 存储tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 */
export function saveTokens(accessToken, refreshToken) {
  // 存储tokens tokens只进入cookies，不进入vuex全局管理
  cookies.set('access_token', `Bearer ${accessToken}`, {
    expires: getDateAfterHours(2),
  })
  cookies.set('refresh_token', `Bearer ${refreshToken}`, {
    expires: getDateAfterDays(30),
  })
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
