/**
 * 封装 axios
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

import store from '@/store'
import router from '@/router'
import Config from '@/config'
import autoJump from '@/lin/util/auto-jump'
import ErrorCode from '@/config/error-code'
import { getToken, saveAccessToken } from '@/lin/util/token'

const config = {
  baseURL: Config.baseURL || '',
  timeout: 5 * 1000, // 请求超时时间设置
  crossDomain: true,
  // withCredentials: true, // Check cross-site Access-Control
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus(status) {
    // Keep original behavior: 2xx-4xx go to success interceptor (not 5xx)
    // This allows token refresh logic (code 10041/10051) to run for business-auth errors on 200
    return status < 510
  },
}

/**
 * 错误码是否是refresh相关
 * @param { number } code 错误码
 */
function refreshTokenException(code) {
  const codes = [10000, 10042, 10050, 10052, 10012]
  return codes.includes(code)
}

// 创建请求实例
const _axios = axios.create(config)

// Module-scope token refresh deduplication
let isRefreshing = false
let refreshSubscribers = []

function onRefreshed(newToken) {
  refreshSubscribers.forEach(({ resolve }) => resolve(newToken))
  refreshSubscribers = []
}

function addRefreshSubscriber() {
  return new Promise(resolve => {
    refreshSubscribers.push({ resolve })
  })
}

_axios.interceptors.request.use(
  originConfig => {
    // 有 API 请求重新计时
    autoJump(router)

    const reqConfig = { ...originConfig }

    // step1: 容错处理
    if (!reqConfig.url) {
      console.error('request need url')
    }

    reqConfig.method = reqConfig.method.toLowerCase() // 大小写容错

    // 参数容错
    if (reqConfig.method === 'get') {
      if (!reqConfig.params) {
        reqConfig.params = reqConfig.data || {}
      }
    } else if (reqConfig.method === 'post') {
      if (!reqConfig.data) {
        reqConfig.data = reqConfig.params || {}
      }

      // 检测是否包含文件类型, 若包含则进行 formData 封装
      let hasFile = false
      Object.keys(reqConfig.data).forEach(key => {
        if (typeof reqConfig.data[key] === 'object') {
          const item = reqConfig.data[key]
          if (item instanceof FileList || item instanceof File || item instanceof Blob) {
            hasFile = true
          }
        }
      })

      // 检测到存在文件使用 FormData 提交数据
      if (hasFile) {
        const formData = new FormData()
        Object.keys(reqConfig.data).forEach(key => {
          formData.append(key, reqConfig.data[key])
        })
        reqConfig.data = formData
      }
    }

    // step2: permission 处理
    if (reqConfig.url === 'cms/user/refresh') {
      const refreshToken = getToken('refresh_token')
      if (refreshToken) {
        reqConfig.headers.Authorization = refreshToken
      }
    } else {
      const accessToken = getToken('access_token')
      if (accessToken) {
        reqConfig.headers.Authorization = accessToken
      }
    }

    return reqConfig
  },
  error => Promise.reject(error),
)

// Add a response interceptor
_axios.interceptors.response.use(
  res => {
    // All responses pass through here because validateStatus always returns true
    const { status, data } = res
    const { code, message } = data

    let tipMessage = ''

    // Non-2xx HTTP status (e.g. 401/403 from some proxies)
    if (status.toString().charAt(0) !== '2') {
      return Promise.reject(res)
    }

    // refresh_token 异常，直接登出
    if (refreshTokenException(code)) {
      setTimeout(() => {
        store.dispatch('loginOut')
        const { origin } = window.location
        window.location.href = origin
      }, 1500)
      return Promise.resolve(null)
    }
    // assessToken相关，刷新令牌（去重：并发请求只刷新一次）
    if (code === 10041 || code === 10051) {
      if (!isRefreshing) {
        isRefreshing = true
        _axios('cms/user/refresh')
          .then(refreshResult => {
            saveAccessToken(refreshResult.access_token)
            onRefreshed(refreshResult.access_token)
          })
          .catch(() => {
            // Reject all queued subscribers before logout
            refreshSubscribers.forEach(({ reject }) => reject(new Error('refresh_failed')))
            refreshSubscribers = []
            store.dispatch('loginOut')
            const { origin } = window.location
            window.location.href = origin
          })
          .finally(() => {
            isRefreshing = false
          })
      }
      // 将当前请求排队，等刷新完成后重发
      return addRefreshSubscriber().then(() => _axios(res.config))
    }

    // 弹出信息提示的第一种情况：直接提示后端返回的异常信息（框架默认为此配置）；
    // 特殊情况：如果本次请求添加了 handleError: true，用户自行通过 try catch 处理，框架不做额外处理
    if (res.config.handleError) {
      return Promise.reject(res)
    }

    // 弹出信息提示的第二种情况：采用前端自己定义的一套异常提示信息（需自行在配置项开启）；
    // 特殊情况：如果本次请求添加了 showBackend: true, 弹出后端返回错误信息。
    if (Config.useFrontEndErrorMsg && !res.config.showBackend) {
      // 弹出前端自定义错误信息
      const errorArr = Object.entries(ErrorCode).filter(v => v[0] === code.toString())
      // 匹配到前端自定义的错误码
      if (errorArr.length > 0 && errorArr[0][1] !== '') {
        ;[[, tipMessage]] = errorArr
      } else {
        tipMessage = ErrorCode['777']
      }
    }

    if (typeof message === 'string') {
      tipMessage = message
    }
    if (Object.prototype.toString.call(message) === '[object Object]') {
      ;[tipMessage] = Object.values(message).flat()
    }
    if (Object.prototype.toString.call(message) === '[object Array]') {
      ;[tipMessage] = message
    }
    ElMessage.error(tipMessage)
    return Promise.reject(res)
  },
  error => {
    if (!error.response) {
      ElMessage.error('请检查 API 是否异常')
      console.log('error', error)
      return Promise.reject(error)
    }

    // 判断请求超时
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      ElMessage.warning('请求超时')
      return Promise.reject(error)
    }

    // HTTP-level auth errors (401/403) — treat same as business code 10041/10051
    const { status } = error.response
    if (status === 401 || status === 403) {
      if (!isRefreshing) {
        isRefreshing = true
        _axios('cms/user/refresh')
          .then(refreshResult => {
            saveAccessToken(refreshResult.access_token)
            onRefreshed(refreshResult.access_token)
          })
          .catch(() => {
            // Reject all queued subscribers before logout
            refreshSubscribers.forEach(({ reject }) => reject(error))
            refreshSubscribers = []
            store.dispatch('loginOut')
            const { origin } = window.location
            window.location.href = origin
          })
          .finally(() => {
            isRefreshing = false
          })
      }
      // Queue this request to retry after refresh
      return addRefreshSubscriber().then(() => _axios(error.config))
    }

    return Promise.reject(error)
  },
)

// 导出常用函数

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post(url, data = {}, params = {}) {
  return _axios({
    method: 'post',
    url,
    data,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function get(url, params = {}) {
  return _axios({
    method: 'get',
    url,
    params,
  })
}

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put(url, data = {}, params = {}) {
  return _axios({
    method: 'put',
    url,
    params,
    data,
  })
}

/**
 * @param {string} url
 * @param {object} params
 */
export function _delete(url, params = {}) {
  return _axios({
    method: 'delete',
    url,
    params,
  })
}

export default _axios
