export function hasBinaryPayload(data = {}) {
  return Object.keys(data).some(key => {
    const item = data[key]
    return item instanceof FileList || item instanceof File || item instanceof Blob
  })
}

export function normalizeAxiosRequestConfig(originConfig, { accessToken = null, refreshToken = null } = {}) {
  const reqConfig = {
    ...originConfig,
    headers: originConfig.headers || {},
  }

  if (!reqConfig.url) {
    throw new Error('request need url')
  }

  reqConfig.method = (reqConfig.method || 'get').toLowerCase()

  if (reqConfig.method === 'get') {
    if (!reqConfig.params) {
      reqConfig.params = reqConfig.data || {}
    }
  } else if (reqConfig.method === 'post') {
    if (!reqConfig.data) {
      reqConfig.data = reqConfig.params || {}
    }

    if (hasBinaryPayload(reqConfig.data)) {
      const formData = new FormData()
      Object.keys(reqConfig.data).forEach(key => {
        formData.append(key, reqConfig.data[key])
      })
      reqConfig.data = formData
    }
  }

  const normalizedUrl = reqConfig.url.replace(/^\/+/, '')

  if (normalizedUrl === 'cms/user/refresh') {
    if (refreshToken) {
      reqConfig.headers.Authorization = refreshToken
    }
  } else if (accessToken) {
    reqConfig.headers.Authorization = accessToken
  }

  return reqConfig
}

export function isTimeoutError(error) {
  return error?.code === 'ECONNABORTED' && typeof error?.message === 'string' && error.message.includes('timeout')
}

export function handleAxiosTransportError(messageApi, error) {
  if (isTimeoutError(error)) {
    messageApi?.warning?.('请求超时')
    return '请求超时'
  }

  if (!error?.response) {
    messageApi?.error?.('请检查 API 是否异常')
    return '请检查 API 是否异常'
  }

  return ''
}
