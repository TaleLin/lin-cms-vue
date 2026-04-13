import { defaultWindow } from '@vueuse/core'
import { getToken } from './token'

export const LOGIN_ROUTE_PATH = '/login'
export const AUTH_FREE_PATHS = ['/', LOGIN_ROUTE_PATH]

export function hasTokenValue(token = '') {
  return typeof token === 'string' && token.trim() !== ''
}

export function hasStoredAccessToken() {
  return hasTokenValue(getToken('access_token'))
}

export function hasLoggedInSession(userStore) {
  return Boolean(userStore?.loggedIn && hasStoredAccessToken())
}

export function isAuthFreePath(path = '') {
  return AUTH_FREE_PATHS.includes(path)
}

export async function redirectToLogin(router) {
  try {
    if (router?.currentRoute?.value?.path !== LOGIN_ROUTE_PATH) {
      await router?.replace(LOGIN_ROUTE_PATH)
    }
  } catch {
    // Fall back to the hash assignment below when router navigation is unavailable.
  }

  if (defaultWindow?.location?.hash !== '#/login') {
    defaultWindow.location.hash = '/login'
  }
}

export async function logoutAndRedirectToLogin(userStore, router) {
  userStore?.loginOut()
  await redirectToLogin(router)
}
