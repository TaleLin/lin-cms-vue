function getCodeMessage(code, errorCodeMap, fallbackCode = '777') {
  const matchedMessage = errorCodeMap?.[code?.toString()]
  if (typeof matchedMessage === 'string' && matchedMessage !== '') {
    return matchedMessage
  }

  return errorCodeMap?.[fallbackCode] || ''
}

export function extractResponseMessage(message) {
  if (typeof message === 'string') {
    return message
  }

  if (Array.isArray(message)) {
    return extractResponseMessage(message[0])
  }

  if (message && typeof message === 'object') {
    return extractResponseMessage(Object.values(message).flat()[0])
  }

  return ''
}

export function resolveResponseErrorMessage({
  code,
  message,
  useFrontEndErrorMsg = false,
  showBackend = false,
  errorCodeMap = {},
  fallbackCode = '777',
} = {}) {
  let tipMessage = ''

  if (useFrontEndErrorMsg && !showBackend) {
    tipMessage = getCodeMessage(code, errorCodeMap, fallbackCode)
  }

  const backendMessage = extractResponseMessage(message)

  return backendMessage || tipMessage
}
