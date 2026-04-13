import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

import Config from '@/config'
import { getPermissions, getToken, requestCaptcha } from '@/model/user'
import { notifyRequestError } from '@/lin/util/request-error'
import { mergeUserSnapshot } from '@/store/modules/user-helpers'

import { createLoginAccount, extractCaptchaState } from './login-helpers'

const defaultUserModel = {
  getPermissions,
  getToken,
  requestCaptcha,
}

export function applyLoggedInUser(userStore, user = {}) {
  const nextUser = mergeUserSnapshot(userStore?.user, user)

  userStore?.setUserAndState?.(nextUser)
  return nextUser
}

export function useLogin({ router, userStore, message = ElMessage, userModel = defaultUserModel } = {}) {
  const account = reactive(createLoginAccount())
  const captchaImage = ref('')
  const loading = ref(false)
  const captchaTag = ref('')

  async function fetchCaptcha() {
    try {
      const result = await userModel.requestCaptcha()
      const captchaState = extractCaptchaState(result)
      captchaTag.value = captchaState.tag
      captchaImage.value = captchaState.image
      return captchaState
    } catch (error) {
      captchaTag.value = ''
      captchaImage.value = ''
      notifyRequestError(message, error, '获取验证码失败')
      throw error
    }
  }

  async function loadCurrentUser() {
    try {
      const user = await userModel.getPermissions()
      return applyLoggedInUser(userStore, user)
    } catch (error) {
      userStore?.loginOut?.()
      notifyRequestError(message, error, '获取当前用户信息失败')
      throw error
    }
  }

  async function login() {
    const { captcha, password, username } = account

    try {
      loading.value = true
      await userModel.getToken(username, password, captcha, captchaTag.value)

      const user = await loadCurrentUser()

      await router?.push?.(Config.defaultRoute)
      message.success('登录成功')
      return user
    } catch (error) {
      await fetchCaptcha().catch(() => null)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    account,
    captchaImage,
    fetchCaptcha,
    loading,
    login,
  }
}
