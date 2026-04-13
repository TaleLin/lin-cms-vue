import { DEFAULT_NICKNAME } from '@/component/layout/profile-helpers'

export function createCenterPasswordDraft() {
  return {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  }
}

export function getDisplayNickname(user = {}) {
  return user?.nickname || DEFAULT_NICKNAME
}

export function hasPasswordChangeValues(form = {}) {
  return Boolean(form.oldPassword || form.newPassword || form.confirmPassword)
}

export function isReusedPassword(form = {}) {
  return Boolean(form.oldPassword && form.oldPassword === form.newPassword)
}

export function getCenterPasswordError(value) {
  if (value === '') {
    return '请输入密码'
  }

  if (value.length < 6) {
    return '密码长度不能少于6位数'
  }

  return ''
}

export function getCenterConfirmPasswordError(value, nextPassword) {
  if (value === '') {
    return '请再次输入密码'
  }

  if (value !== nextPassword) {
    return '两次输入密码不一致!'
  }

  return ''
}

export function createCenterPasswordRules(form, { revalidateConfirmPassword } = {}) {
  const validateOldPassword = (_, value, callback) => {
    if (!value) {
      callback(new Error('原始密码不能为空'))
      return
    }

    callback()
  }

  const validatePassword = (_, value, callback) => {
    const message = getCenterPasswordError(value)

    if (message) {
      callback(new Error(message))
      return
    }

    if (form.confirmPassword !== '') {
      revalidateConfirmPassword?.()
    }

    callback()
  }

  const validateConfirmPassword = (_, value, callback) => {
    const message = getCenterConfirmPasswordError(value, form.newPassword)

    if (message) {
      callback(new Error(message))
      return
    }

    callback()
  }

  return {
    oldPassword: [{ validator: validateOldPassword, trigger: 'blur', required: true }],
    newPassword: [{ validator: validatePassword, trigger: 'blur', required: true }],
    confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur', required: true }],
  }
}

export async function validateCenterForm(formRef) {
  if (!formRef) {
    return false
  }

  try {
    await formRef.validate()
    return true
  } catch {
    return false
  }
}
