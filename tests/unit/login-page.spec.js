import { reactive, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchCaptchaMock = vi.fn()
const loginMock = vi.fn()
const notifyRequestErrorMock = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
  },
}))

vi.mock('@/lin/util/rate-limit', () => ({
  createThrottledHandler: handler => handler,
}))

vi.mock('@/lin/util/request-error', () => ({
  notifyRequestError: (...args) => notifyRequestErrorMock(...args),
}))

vi.mock('@/store/modules/user', () => ({
  useUserStore: () => ({
    loggedIn: false,
  }),
}))

vi.mock('@/view/login/use-login', () => ({
  useLogin: () => ({
    account: reactive({
      username: '',
      password: '',
      captcha: '',
    }),
    captchaImage: ref('captcha-image'),
    fetchCaptcha: fetchCaptchaMock,
    loading: ref(false),
    login: loginMock,
  }),
}))

describe('login page', () => {
  beforeEach(() => {
    fetchCaptchaMock.mockReset()
    loginMock.mockReset()
    notifyRequestErrorMock.mockReset()
    fetchCaptchaMock.mockResolvedValue(undefined)
    loginMock.mockResolvedValue(undefined)
  })

  it('fetches captcha on mount and submits login through the throttled handler', async () => {
    const LoginPage = (await import('@/view/login/login.vue')).default
    const wrapper = mount(LoginPage)

    await flushPromises()

    expect(fetchCaptchaMock).toHaveBeenCalledTimes(1)
    expect(wrapper.find('.captcha').attributes('src')).toBe('captcha-image')

    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()

    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(notifyRequestErrorMock).not.toHaveBeenCalled()
  })

  it('reports request errors when login fails', async () => {
    const failure = new Error('登录失败')
    loginMock.mockRejectedValue(failure)

    const LoginPage = (await import('@/view/login/login.vue')).default
    const wrapper = mount(LoginPage)

    await flushPromises()
    await wrapper.get('form').trigger('submit.prevent')
    await flushPromises()

    expect(loginMock).toHaveBeenCalledTimes(1)
    expect(notifyRequestErrorMock).toHaveBeenCalledWith(expect.any(Object), failure, '登录失败')
  })
})
