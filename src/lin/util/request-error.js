function extractMessageValue(message) {
  if (typeof message === 'string') {
    return message.trim()
  }

  if (Array.isArray(message)) {
    return message.map(extractMessageValue).find(Boolean) || ''
  }

  if (message && typeof message === 'object') {
    return Object.values(message).map(extractMessageValue).find(Boolean) || ''
  }

  return ''
}

function isResponseLikeError(error) {
  return Boolean(error && typeof error === 'object' && 'config' in error && 'data' in error && 'status' in error)
}

export function markRequestErrorAsNotified(error, message = '') {
  const requestError = createRequestError(error)

  requestError.isNotified = true

  if (message) {
    requestError.notifiedMessage = message
  }

  return requestError
}

export function createRequestError(error, fallbackMessage = '操作失败，请稍后重试') {
  if (error?.isRequestError) {
    return error
  }

  const response = isResponseLikeError(error) ? error : error?.response
  const data = response?.data ?? error?.data
  const status = response?.status ?? error?.status
  const config = response?.config ?? error?.config
  const message = extractMessageValue(data?.message ?? error?.message) || fallbackMessage
  const requestError = error instanceof Error ? error : new Error(message)

  requestError.name = 'RequestError'
  requestError.message = requestError.message || message
  requestError.isRequestError = true
  requestError.response = response
  requestError.data = data
  requestError.status = status
  requestError.config = config
  requestError.code = data?.code
  requestError.isNotified = Boolean(error?.isNotified)
  requestError.notifiedMessage = error?.notifiedMessage || ''

  return requestError
}

export function getRequestErrorMessage(error, fallbackMessage = '操作失败，请稍后重试') {
  if (typeof error === 'string') {
    return error.trim() || fallbackMessage
  }

  if (!error || typeof error !== 'object') {
    return fallbackMessage
  }

  const requestError = createRequestError(error, fallbackMessage)
  const responseData = requestError.response?.data
  const message = extractMessageValue(responseData?.message ?? requestError.data?.message ?? requestError.message)

  return message || fallbackMessage
}

export function shouldNotifyRequestError(error) {
  if (!error || typeof error !== 'object') {
    return true
  }

  if (error.isNotified) {
    return false
  }

  const requestConfig = error.config || error.response?.config

  if (!requestConfig) {
    return true
  }

  if (requestConfig.handleError === true) {
    return isResponseLikeError(error) || Boolean(error.response?.data)
  }

  return false
}

export function notifyRequestError(messageApi, error, fallbackMessage) {
  if (!shouldNotifyRequestError(error)) {
    return
  }

  messageApi?.error?.(getRequestErrorMessage(error, fallbackMessage))
}
