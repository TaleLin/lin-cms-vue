export function createUserInfoDraft() {
  return {
    email: '',
    username: '',
    password: '',
    groupIds: [],
    confirmPassword: '',
  }
}

export function createUserDetailDraft() {
  return {
    email: '',
    username: '',
    groups: [],
  }
}

export function populateUserInfoDraft(target, userDetail = {}) {
  const nextValue = {
    email: userDetail.email ?? '',
    username: userDetail.username ?? '',
    password: '',
    groupIds: (userDetail.groups ?? []).map(item => item.id),
    confirmPassword: '',
  }

  Object.assign(target, nextValue)
}

export function populateUserDetailDraft(target, userDetail = {}) {
  Object.assign(target, {
    email: userDetail.email ?? '',
    username: userDetail.username ?? '',
    groups: userDetail.groups ?? [],
  })
}

export function getUserNameError(value) {
  return value ? '' : '用户名不能为空'
}

export function getUserPasswordError(value) {
  if (value === '') {
    return '请输入密码'
  }

  if (value.length < 6) {
    return '密码长度不能少于6位数'
  }

  return ''
}

export function getUserConfirmPasswordError(value, password) {
  if (value === '') {
    return '请再次输入密码'
  }

  if (value !== password) {
    return '两次输入密码不一致!'
  }

  return ''
}

export function hasUserPasswordInput(passwordForm = {}) {
  return Boolean(passwordForm.newPassword || passwordForm.confirmPassword)
}

export function shouldMoveToPreviousPage(totalNum, pageCount, currentPage) {
  return totalNum % pageCount === 1 && currentPage !== 1
}

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

export function createUserInfoRules(userInfo) {
  const checkUserName = (_, value, callback) => {
    const message = getUserNameError(value)

    if (message) {
      callback(new Error(message))
      return
    }

    callback()
  }

  const validatePassword = (_, value, callback) => {
    const message = getUserPasswordError(value)

    if (message) {
      callback(new Error(message))
      return
    }

    callback()
  }

  const validatePassword2 = (_, value, callback) => {
    const message = getUserConfirmPasswordError(value, userInfo.password)

    if (message) {
      callback(new Error(message))
      return
    }

    callback()
  }

  return {
    password: [{ validator: validatePassword, trigger: 'blur', required: true }],
    username: [{ validator: checkUserName, trigger: ['blur', 'change'], required: true }],
    confirmPassword: [{ validator: validatePassword2, trigger: 'blur', required: true }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址或者不填', trigger: ['blur', 'change'] }],
  }
}

export function createUserPasswordRules(passwordForm, formRef) {
  const validatePassword = (_, value, callback) => {
    const message = getUserPasswordError(value)

    if (message) {
      callback(new Error(message))
      return
    }

    if (passwordForm.confirmPassword) {
      formRef.value?.validateField('confirmPassword')
    }

    callback()
  }

  const validatePassword2 = (_, value, callback) => {
    const message = getUserConfirmPasswordError(value, passwordForm.newPassword)

    if (message) {
      callback(new Error(message))
      return
    }

    callback()
  }

  return {
    newPassword: [{ validator: validatePassword, trigger: 'blur', required: true }],
    confirmPassword: [{ validator: validatePassword2, trigger: 'blur', required: true }],
  }
}

export function mapUserRows(users = []) {
  return users.map(user => ({
    ...user,
    groupNames: user.groups.map(item => item.name).join('，'),
  }))
}

export function hasGroupSelectionChanged(groupIds = [], groups = []) {
  const selected = [...groupIds].sort((left, right) => left - right)
  const original = groups.map(item => item.id).sort((left, right) => left - right)

  return selected.join(',') !== original.join(',')
}

export function createUserUpdatePayload(userId, userInfo) {
  return {
    id: userId,
    email: userInfo.email,
    groupIds: [...userInfo.groupIds],
  }
}
