const REFRESH_TOKEN_EXCEPTION_CODES = [10000, 10042, 10050, 10052, 10012]
const ACCESS_TOKEN_EXCEPTION_CODES = [10041, 10051]

export function isRefreshTokenException(code) {
  return REFRESH_TOKEN_EXCEPTION_CODES.includes(code)
}

export function isAccessTokenException(code) {
  return ACCESS_TOKEN_EXCEPTION_CODES.includes(code)
}

export function scheduleLogoutOnRefreshFailure(
  code,
  { getUserStore, router, logoutAndRedirectToLogin, delay = 1500, setTimer = setTimeout } = {},
) {
  if (!isRefreshTokenException(code)) {
    return false
  }

  setTimer(() => {
    void logoutAndRedirectToLogin?.(getUserStore?.(), router)
  }, delay)

  return true
}

export function createRefreshRequestRetry({ request, saveAccessToken, refreshUrl = 'cms/user/refresh' } = {}) {
  let refreshPromise = null

  return async function retryAfterRefresh(response) {
    if (!refreshPromise) {
      refreshPromise = request(refreshUrl).finally(() => {
        refreshPromise = null
      })
    }

    const refreshResult = await refreshPromise
    saveAccessToken?.(refreshResult.access_token)

    return request(response.config)
  }
}
