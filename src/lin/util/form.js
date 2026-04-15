export async function validateElementForm(form) {
  if (!form) {
    return false
  }

  try {
    await form.validate()
    return true
  } catch {
    return false
  }
}

export function getRequiredFieldError(value, message = '信息不能为空') {
  return value ? '' : message
}

export function getPasswordError(
  value,
  { emptyMessage = '请输入密码', minLength = 6, minLengthMessage = `密码长度不能少于${minLength}位数` } = {},
) {
  if (value === '') {
    return emptyMessage
  }

  if (value.length < minLength) {
    return minLengthMessage
  }

  return ''
}

export function getConfirmedValueError(
  value,
  expectedValue,
  { emptyMessage = '请再次输入密码', mismatchMessage = '两次输入密码不一致!' } = {},
) {
  if (value === '') {
    return emptyMessage
  }

  if (value !== expectedValue) {
    return mismatchMessage
  }

  return ''
}

export function createErrorMessageValidator(resolveErrorMessage, { onSuccess } = {}) {
  return (_, value, callback) => {
    const errorMessage = resolveErrorMessage(value)

    if (errorMessage) {
      callback(new Error(errorMessage))
      return
    }

    onSuccess?.(value)
    callback()
  }
}

export function createRequiredRule(message = '信息不能为空', { trigger = 'blur' } = {}) {
  return {
    required: true,
    trigger,
    validator: createErrorMessageValidator(value => getRequiredFieldError(value, message)),
  }
}
