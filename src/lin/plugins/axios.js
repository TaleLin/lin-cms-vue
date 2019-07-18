// ajax 封装插件, 使用 axios
import Vue from 'vue'
import axios from 'axios'
import Config from '@/config'
import store from '@/store'
import { getToken } from '@/lin/utils/token'
import User from '@/lin/models/user'


// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || ''
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const config = {
  baseURL: Config.baseUrl || process.env.apiUrl || '',
  timeout: 5 * 1000, // 请求超时时间设置
  crossDomain: true,
  // withCredentials: true, // Check cross-site Access-Control
  // 定义可获得的http响应状态码
  // return true、设置为null或者undefined，promise将resolved,否则将rejected
  validateStatus(status) {
    return status >= 200 && status < 500
  },
}

// const retryTime = 2 // 请求失败重试次数
// const retryDelay = 1500 // 请求失败重试间隔

// 创建请求实例
const _axios = axios.create(config)

_axios.interceptors.request.use((originConfig) => {
  const reqConfig = { ...originConfig }

  // step1: 容错处理
  if (!reqConfig.url) {
    /* eslint-disable-next-line */
    console.error('request need url')
    throw new Error({
      source: 'axiosInterceptors',
      message: 'request need url',
    })
  }

  if (!reqConfig.method) { // 默认使用 get 请求
    reqConfig.method = 'get'
  }
  // 大小写容错
  reqConfig.method = reqConfig.method.toLowerCase()

  // 参数容错
  if (reqConfig.method === 'get') {
    if (!reqConfig.params) { // 防止字段用错
      reqConfig.params = reqConfig.data || {}
    }
  } else if (reqConfig.method === 'post') {
    if (!reqConfig.data) { // 防止字段用错
      reqConfig.data = reqConfig.params || {}
    }

    // 检测是否包含文件类型, 若包含则进行 formData 封装
    // 检查子项是否有 Object 类型, 若有则字符串化
    let hasFile = false
    Object.keys(reqConfig.data).forEach((key) => {
      if (typeof reqConfig.data[key] === 'object') {
        const item = reqConfig.data[key]
        if (item instanceof FileList || item instanceof File || item instanceof Blob) {
          hasFile = true
        } else if (Object.prototype.toString.call(item) === '[object Object]') {
          reqConfig.data[key] = JSON.stringify(reqConfig.data[key])
        }
      }
    })

    // 检测到存在文件使用 FormData 提交数据
    if (hasFile) {
      const formData = new FormData()
      Object.keys(reqConfig.data).forEach((key) => {
        formData.append(key, reqConfig.data[key])
      })
      reqConfig.data = formData
    }
  } else {
    // TODO: 其他类型请求数据格式处理
    /* eslint-disable-next-line */
    console.warn(`其他请求类型: ${reqConfig.method}, 暂无自动处理`)
  }

  // step2: auth 处理
  if (reqConfig.url === 'cms/user/refresh') {
    const refreshToken = getToken('refresh_token')
    if (refreshToken) {
      // eslint-disable-next-line no-param-reassign
      reqConfig.headers.Authorization = refreshToken
    }
  } else {
    // 有access_token
    const accessToken = getToken('access_token')
    if (accessToken) {
      // eslint-disable-next-line no-param-reassign
      reqConfig.headers.Authorization = accessToken
    }
  }
  return reqConfig
}, (error) => {
  Promise.reject(error)
})

// Add a response interceptor
_axios.interceptors.response.use(async (res) => {
  if (res.status.toString().charAt(0) === '2') {
    return res.data
  }

  return new Promise(async (resolve, reject) => {
    // 将本次失败请求保存
    const { params, url, method } = res.config
    store.commit('SET_REFERSH_OPTION', {
      params,
      url,
      method,
    })

    // 处理 API 异常
    let { error_code, msg } = res.data // eslint-disable-line
    if (msg instanceof Object) {
      let showMsg = ''
      Object.getOwnPropertyNames(msg).forEach((key, index) => {
        if (index === 0) {
          showMsg = msg[key] // 如果是数组，展示第一条
        }
      })
      msg = showMsg
    }
    // 如果令牌无效或者是refreshToken相关异常
    if (error_code === 10000 || error_code === 10100) {
      setTimeout(() => {
        store.dispatch('loginOut')
        const { origin } = window.location
        window.location.href = origin
      }, 1500)
    }
    // 令牌相关，刷新令牌
    if (error_code === 10040 || error_code === 10050) {
      // TODO: 重试一次，待优化
      const cache = {}
      if (cache.url !== url) {
        cache.url = url
        await User.getRefreshToken()
        const result = await _axios(store.state.refreshOptions)
        resolve(result)
        return
      }
    }

    Vue.prototype.$message({
      message: msg || '未知的error_code',
      type: 'error',
    })
    reject(res.data)
  })
}, (error) => {
  if (!error.response) {
    Vue.prototype.$notify({
      title: 'Network Error',
      dangerouslyUseHTMLString: true,
      message: '<strong class="my-notify">请检查 API 是否异常</strong>',
    })
    console.log('error', error)
  }

  // 判断请求超时
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    Vue.prototype.$message({
      type: 'warning',
      message: '请求超时',
    })
  }
  return Promise.reject(error)
})


// eslint-disable-next-line
Plugin.install = function (Vue, options) {
  // eslint-disable-next-line
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios
      },
    },
    $axios: {
      get() {
        return _axios
      },
    },
  })
}

if (!Vue.axios) {
  Vue.use(Plugin)
}

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
