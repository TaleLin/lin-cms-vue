import { get, put, request } from '@/lin/plugin/axios'
import { saveTokens } from '@/lin/util/token'

export function requestCaptcha() {
  return request({
    method: 'POST',
    url: 'cms/user/captcha',
  })
}

export function register(user) {
  return request({
    method: 'post',
    url: 'cms/user/register',
    data: {
      email: user.email,
      username: user.username,
      password: user.password,
      group_ids: user.groupIds,
      confirm_password: user.confirmPassword,
    },
  })
}

export async function getToken(username, password, captcha, tag) {
  const tokens = await request({
    url: 'cms/user/login',
    method: 'POST',
    data: {
      captcha,
      username,
      password,
    },
    headers: {
      tag,
    },
  })

  saveTokens(tokens.access_token, tokens.refresh_token)
  return tokens
}

export async function getInformation() {
  return get('cms/user/information')
}

export async function getPermissions() {
  return get('cms/user/permissions')
}

export function updatePassword({ oldPassword, newPassword, confirmPassword }) {
  return put('cms/user/change_password', {
    new_password: newPassword,
    confirm_password: confirmPassword,
    old_password: oldPassword,
  })
}

export function updateProfile(profile) {
  return request({
    method: 'put',
    url: '/cms/user',
    data: profile,
    showBackend: true,
  })
}
