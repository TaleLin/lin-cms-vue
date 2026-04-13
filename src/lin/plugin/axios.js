/**
 * 封装 axios
 */
import { createRequestClient, createRequestMethods } from './axios-transport'

export {
  axiosConfig,
  createRequestClient,
  createRequestInterceptor,
  createRequestMethods,
  createResponseErrorHandler,
  createResponseSuccessHandler,
} from './axios-transport'

// 创建请求实例
const _axios = createRequestClient()

export const { request, post, get, put, _delete } = createRequestMethods(config => _axios(config))
