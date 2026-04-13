import { describe, expect, it, vi } from 'vitest'

import { applyLoggedInUser, useLogin } from '@/view/login/use-login'

describe('use-login', () => {
  it('stores the authenticated user after merging the current store snapshot', () => {
    const userStore = {
      user: {
        nickname: '旧昵称',
        roles: ['reader'],
      },
      setUserAndState: vi.fn(),
    }
    const user = {
      id: 9,
      permissions: [{ group: [{ permission: '查看日志' }] }],
    }

    applyLoggedInUser(userStore, user)

    expect(userStore.setUserAndState).toHaveBeenCalledWith({
      id: 9,
      nickname: '旧昵称',
      roles: ['reader'],
      permissions: [{ group: [{ permission: '查看日志' }] }],
    })
  })

  it('logs in successfully, stores the current user and navigates to the default route', async () => {
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      getPermissions: vi.fn().mockResolvedValue({
        id: 1,
        permissions: [{ id: 1 }],
      }),
      getToken: vi.fn().mockResolvedValue({}),
      requestCaptcha: vi.fn().mockResolvedValue({
        image: 'data:image/png;base64,abc',
        tag: 'captcha-tag',
      }),
    }
    const userStore = {
      user: {
        nickname: '持久化昵称',
      },
      loginOut: vi.fn(),
      setUserAndState: vi.fn(),
    }
    const router = {
      push: vi.fn().mockResolvedValue(),
    }
    const { account, fetchCaptcha, login, loading } = useLogin({
      message,
      router,
      userModel,
      userStore,
    })

    await fetchCaptcha()
    account.username = 'lin'
    account.password = '123456'
    account.captcha = 'ABCD'

    await expect(login()).resolves.toEqual({
      id: 1,
      nickname: '持久化昵称',
      permissions: [{ id: 1 }],
    })

    expect(userModel.getToken).toHaveBeenCalledWith('lin', '123456', 'ABCD', 'captcha-tag')
    expect(userStore.setUserAndState).toHaveBeenCalledWith({
      id: 1,
      nickname: '持久化昵称',
      permissions: [{ id: 1 }],
    })
    expect(router.push).toHaveBeenCalledWith('/about')
    expect(message.success).toHaveBeenCalledWith('登录成功')
    expect(message.error).not.toHaveBeenCalled()
    expect(loading.value).toBe(false)
  })

  it('clears the partial session and refreshes captcha when loading the current user fails', async () => {
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const requestCaptcha = vi
      .fn()
      .mockResolvedValueOnce({
        image: 'data:image/png;base64,first',
        tag: 'first-tag',
      })
      .mockResolvedValueOnce({
        image: 'data:image/png;base64,second',
        tag: 'second-tag',
      })
    const userModel = {
      getPermissions: vi.fn().mockRejectedValue(new Error('权限加载失败')),
      getToken: vi.fn().mockResolvedValue({}),
      requestCaptcha,
    }
    const userStore = {
      user: {},
      loginOut: vi.fn(),
      setUserAndState: vi.fn(),
    }
    const router = {
      push: vi.fn(),
    }
    const { account, captchaImage, fetchCaptcha, login } = useLogin({
      message,
      router,
      userModel,
      userStore,
    })

    await fetchCaptcha()
    account.username = 'lin'
    account.password = '123456'
    account.captcha = 'ABCD'

    await expect(login()).rejects.toThrow('权限加载失败')

    expect(userStore.loginOut).toHaveBeenCalledTimes(1)
    expect(message.error).toHaveBeenCalledWith('权限加载失败')
    expect(message.success).not.toHaveBeenCalled()
    expect(router.push).not.toHaveBeenCalled()
    expect(captchaImage.value).toBe('data:image/png;base64,second')
  })

  it('refreshes captcha after the login request fails without duplicating interceptor messages', async () => {
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const requestCaptcha = vi
      .fn()
      .mockResolvedValueOnce({
        image: 'data:image/png;base64,first',
        tag: 'first-tag',
      })
      .mockResolvedValueOnce({
        image: 'data:image/png;base64,second',
        tag: 'second-tag',
      })
    const userModel = {
      getPermissions: vi.fn(),
      getToken: vi.fn().mockRejectedValue({
        config: {},
        data: {
          message: '账号或密码错误',
        },
        status: 401,
      }),
      requestCaptcha,
    }
    const userStore = {
      user: {},
      loginOut: vi.fn(),
      setUserAndState: vi.fn(),
    }
    const router = {
      push: vi.fn(),
    }
    const { account, captchaImage, fetchCaptcha, login } = useLogin({
      message,
      router,
      userModel,
      userStore,
    })

    await fetchCaptcha()
    account.username = 'lin'
    account.password = 'wrong-pass'
    account.captcha = 'ABCD'

    await expect(login()).rejects.toMatchObject({ status: 401 })

    expect(userModel.getPermissions).not.toHaveBeenCalled()
    expect(message.error).not.toHaveBeenCalled()
    expect(message.success).not.toHaveBeenCalled()
    expect(captchaImage.value).toBe('data:image/png;base64,second')
  })
})
