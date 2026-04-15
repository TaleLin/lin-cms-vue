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
