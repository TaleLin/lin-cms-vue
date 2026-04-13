import { beforeEach, describe, expect, it, vi } from 'vitest'

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  request: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@/lin/plugin/axios', () => ({
  get: axiosMocks.get,
  request: axiosMocks.request,
  put: axiosMocks.put,
}))

vi.mock('@/lin/util/token', () => ({
  saveTokens: vi.fn(),
}))

import { saveTokens } from '@/lin/util/token'
import * as userModel from '@/model/user'

describe('user model', () => {
  beforeEach(() => {
    axiosMocks.get.mockReset()
    axiosMocks.request.mockReset()
    axiosMocks.put.mockReset()
    saveTokens.mockReset()
  })

  it('exposes only the canonical user API methods', () => {
    expect(Object.keys(userModel).sort()).toEqual([
      'getInformation',
      'getPermissions',
      'getToken',
      'register',
      'requestCaptcha',
      'updatePassword',
      'updateProfile',
    ])
  })

  it('maps semantic registration, profile, captcha, and password payloads to backend fields', () => {
    userModel.requestCaptcha()

    userModel.register({
      email: 'reader@example.com',
      username: 'reader',
      password: '123456',
      groupIds: [2, 3],
      confirmPassword: '123456',
    })

    expect(axiosMocks.request).toHaveBeenCalledWith({
      method: 'post',
      url: 'cms/user/register',
      data: {
        email: 'reader@example.com',
        username: 'reader',
        password: '123456',
        group_ids: [2, 3],
        confirm_password: '123456',
      },
    })

    expect(axiosMocks.request).toHaveBeenNthCalledWith(1, {
      method: 'POST',
      url: 'cms/user/captcha',
    })

    expect(axiosMocks.request).toHaveBeenNthCalledWith(2, {
      method: 'post',
      url: 'cms/user/register',
      data: {
        email: 'reader@example.com',
        username: 'reader',
        password: '123456',
        group_ids: [2, 3],
        confirm_password: '123456',
      },
    })

    userModel.updateProfile({
      nickname: '新昵称',
    })

    expect(axiosMocks.request).toHaveBeenNthCalledWith(3, {
      method: 'put',
      url: '/cms/user',
      data: {
        nickname: '新昵称',
      },
      showBackend: true,
    })

    userModel.updatePassword({
      oldPassword: 'old-pass',
      newPassword: 'new-pass',
      confirmPassword: 'new-pass',
    })

    expect(axiosMocks.put).toHaveBeenCalledWith('cms/user/change_password', {
      new_password: 'new-pass',
      confirm_password: 'new-pass',
      old_password: 'old-pass',
    })
  })

  it('requests login tokens and persists the access pair', async () => {
    const tokens = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
    }
    axiosMocks.request.mockResolvedValue(tokens)

    await expect(userModel.getToken('reader', '123456', 'ABCD', 'login-form')).resolves.toBe(tokens)

    expect(axiosMocks.request).toHaveBeenCalledWith({
      url: 'cms/user/login',
      method: 'POST',
      data: {
        captcha: 'ABCD',
        username: 'reader',
        password: '123456',
      },
      headers: {
        tag: 'login-form',
      },
    })
    expect(saveTokens).toHaveBeenCalledWith('access-token', 'refresh-token')
  })

  it('returns the fetched information and permissions without reading store state', async () => {
    axiosMocks.get
      .mockResolvedValueOnce({
        nickname: '新昵称',
        email: 'reader@example.com',
      })
      .mockResolvedValueOnce({
        permissions: ['book:create'],
      })

    await expect(userModel.getInformation()).resolves.toEqual({
      nickname: '新昵称',
      email: 'reader@example.com',
    })

    await expect(userModel.getPermissions()).resolves.toEqual({
      permissions: ['book:create'],
    })

    expect(axiosMocks.get).toHaveBeenNthCalledWith(1, 'cms/user/information')
    expect(axiosMocks.get).toHaveBeenNthCalledWith(2, 'cms/user/permissions')
  })
})
