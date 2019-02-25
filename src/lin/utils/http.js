import axios from 'axios'
import Config from '@/config'
import { getToken } from './cookie'
import store from '../../store'
import tip from './exception'

// 创建一个拥有通用配置的axios实例
const http = axios.create({
  baseURL: Config.baseUrl, // api 的 base_url
  transformResponse: [data => JSON.parse(data)], // 对 data 进行任意转换处理
  timeout: 5000, // 请求超时
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  // validateStatus(status) {
  //   return status >= 200 && status < 500
  // },
})

// 添加一个请求拦截器
http.interceptors.request.use(
  (requestConfig) => {
    if (requestConfig.url === 'cms/user/refresh') {
      const refreshToken = getToken('refresh_token')
      if (refreshToken) {
        // eslint-disable-next-line no-param-reassign
        requestConfig.headers.Authorization = refreshToken
        return requestConfig
      }
    } else {
      // 有access_token
      const accessToken = getToken('access_token')
      if (accessToken) {
        // eslint-disable-next-line no-param-reassign
        requestConfig.headers.Authorization = accessToken
        return requestConfig
      }
    }
    return requestConfig
  },
  error => Promise.reject(error),
)

http.interceptors.request.use(
  (requestConfig) => {
    store.commit('SET_STOP_TIME', new Date().getTime())
    return requestConfig
  },
  error => Promise.reject(error),
)
// 返回结果处理
http.interceptors.response.use(
  res => res.data,
  (error) => {
    tip(error)
  },
)

// http instance
export default http

/**
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function post(url, data = {}, params = {}) {
  return http({
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
  return http({
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
  return http({
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
  return http({
    method: 'delete',
    url,
    params,
  })
}
