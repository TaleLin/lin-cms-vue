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

export function hasUserPasswordInput(passwordForm = {}) {
  return Boolean(passwordForm.newPassword || passwordForm.confirmPassword)
}

export function shouldMoveToPreviousPage(totalNum, pageCount, currentPage) {
  return totalNum % pageCount === 1 && currentPage !== 1
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
