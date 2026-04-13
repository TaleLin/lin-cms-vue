import axios from 'axios'
import { ElMessage } from 'element-plus'

import { useUserStore } from '@/store/modules/user'
import router from '@/router'
import Config from '@/config'
import ErrorCode from '@/config/error-code'
import { scheduleAutoJump } from '@/lin/util/auto-jump'
import { createRequestError, markRequestErrorAsNotified } from '@/lin/util/request-error'
import { logoutAndRedirectToLogin } from '@/lin/util/session'
import { getToken, saveAccessToken } from '@/lin/util/token'

import { createRefreshRequestRetry, isAccessTokenException, scheduleLogoutOnRefreshFailure } from './axios-auth-helpers'
import { handleAxiosTransportError, normalizeAxiosRequestConfig } from './axios-helpers'
import { resolveResponseErrorMessage } from './axios-response-helpers'

const config = {
  baseURL: Config.baseURL || '',
  timeout: 5 * 1000,
  crossOrigin: true,
  validateStatus(status) {
    return status >= 200 && status < 510
  },
}

export const axiosConfig = config

export function createRequestInterceptor({
  routerInstance,
  scheduleAutoJumpFn,
  normalizeRequestConfig,
  getAccessToken,
  getRefreshToken,
} = {}) {
  return originConfig => {
    scheduleAutoJumpFn?.(routerInstance)

    return normalizeRequestConfig(originConfig, {
      accessToken: getAccessToken?.(),
      refreshToken: getRefreshToken?.(),
    })
  }
}

export function createResponseSuccessHandler({
  getUserStore,
  routerInstance,
  logoutAndRedirectToLoginFn,
  scheduleLogoutOnRefreshFailureFn,
  isAccessTokenExceptionFn,
  retryAfterRefresh,
  resolveResponseErrorMessageFn,
  useFrontEndErrorMsg,
  errorCodeMap,
  messageApi,
} = {}) {
  return async res => {
    if (res.status.toString().charAt(0) === '2') {
      return res.data
    }

    const { code, message } = res.data || {}
    const requestError = createRequestError(res)

    if (
      scheduleLogoutOnRefreshFailureFn?.(code, {
        getUserStore,
        router: routerInstance,
        logoutAndRedirectToLogin: logoutAndRedirectToLoginFn,
      })
    ) {
      return Promise.reject(requestError)
    }

    if (isAccessTokenExceptionFn?.(code)) {
      try {
        return await retryAfterRefresh?.(res)
      } catch (refreshError) {
        return Promise.reject(createRequestError(refreshError))
      }
    }

    if (res.config.handleError) {
      return Promise.reject(requestError)
    }

    const tipMessage =
      resolveResponseErrorMessageFn?.({
        code,
        message,
        useFrontEndErrorMsg,
        showBackend: res.config.showBackend,
        errorCodeMap,
      }) || ''

    const messageToShow = tipMessage || requestError.message

    if (messageToShow) {
      messageApi?.error?.(messageToShow)
      markRequestErrorAsNotified(requestError, messageToShow)
    }

    return Promise.reject(requestError)
  }
}

export function createResponseErrorHandler({ handleAxiosTransportErrorFn, messageApi } = {}) {
  return error => {
    const requestError = createRequestError(error)
    const notifiedMessage = handleAxiosTransportErrorFn?.(messageApi, requestError) || ''

    if (notifiedMessage) {
      markRequestErrorAsNotified(requestError, notifiedMessage)
    }

    return Promise.reject(requestError)
  }
}

export function createRequestClient({
  axiosLib = axios,
  baseConfig = config,
  routerInstance = router,
  scheduleAutoJumpFn = scheduleAutoJump,
  normalizeRequestConfig = normalizeAxiosRequestConfig,
  getAccessToken = () => getToken('access_token'),
  getRefreshToken = () => getToken('refresh_token'),
  getUserStore = () => useUserStore(),
  logoutAndRedirectToLoginFn = logoutAndRedirectToLogin,
  scheduleLogoutOnRefreshFailureFn = scheduleLogoutOnRefreshFailure,
  isAccessTokenExceptionFn = isAccessTokenException,
  createRefreshRetry = createRefreshRequestRetry,
  saveAccessTokenFn = saveAccessToken,
  resolveResponseErrorMessageFn = resolveResponseErrorMessage,
  handleAxiosTransportErrorFn = handleAxiosTransportError,
  useFrontEndErrorMsg = Config.useFrontEndErrorMsg,
  errorCodeMap = ErrorCode,
  messageApi = ElMessage,
} = {}) {
  const client = axiosLib.create(baseConfig)
  const retryAfterRefresh = createRefreshRetry({
    request: client,
    saveAccessToken: saveAccessTokenFn,
  })

  client.interceptors.request.use(
    createRequestInterceptor({
      routerInstance,
      scheduleAutoJumpFn,
      normalizeRequestConfig,
      getAccessToken,
      getRefreshToken,
    }),
    error => Promise.reject(error),
  )

  client.interceptors.response.use(
    createResponseSuccessHandler({
      getUserStore,
      routerInstance,
      logoutAndRedirectToLoginFn,
      scheduleLogoutOnRefreshFailureFn,
      isAccessTokenExceptionFn,
      retryAfterRefresh,
      resolveResponseErrorMessageFn,
      useFrontEndErrorMsg,
      errorCodeMap,
      messageApi,
    }),
    createResponseErrorHandler({
      handleAxiosTransportErrorFn,
      messageApi,
    }),
  )

  return client
}

export function createRequestMethods(requestFn) {
  return {
    request(requestConfig) {
      return requestFn(requestConfig)
    },
    post(url, data = {}, params = {}) {
      return requestFn({
        method: 'post',
        url,
        data,
        params,
      })
    },
    get(url, params = {}) {
      return requestFn({
        method: 'get',
        url,
        params,
      })
    },
    put(url, data = {}, params = {}) {
      return requestFn({
        method: 'put',
        url,
        params,
        data,
      })
    },
    _delete(url, params = {}) {
      return requestFn({
        method: 'delete',
        url,
        params,
      })
    },
  }
}
