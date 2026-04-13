import { onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

import { MAX_SUCCESS_CODE } from '@/config/global'
import { updatePassword } from '@/model/user'
import { logoutAndRedirectToLogin } from '@/lin/util/session'

import {
  createCenterPasswordDraft,
  createCenterPasswordRules,
  hasPasswordChangeValues,
  isReusedPassword,
  validateCenterForm,
} from './center-helpers'

const defaultUserModel = {
  updatePassword,
}

export function useCenterPasswordForm({
  formRef,
  userStore,
  logout = logoutAndRedirectToLogin,
  message = ElMessage,
  scheduleLogout = callback => setTimeout(callback, 1000),
  clearScheduledLogout = handle => clearTimeout(handle),
  userModel = defaultUserModel,
} = {}) {
  const loading = ref(false)
  const form = reactive(createCenterPasswordDraft())
  const rules = createCenterPasswordRules(form, {
    revalidateConfirmPassword: () => {
      formRef.value?.validateField('confirmPassword')
    },
  })
  let scheduledLogoutHandle = null

  function clearPendingLogout() {
    if (scheduledLogoutHandle === null) {
      return
    }

    clearScheduledLogout(scheduledLogoutHandle)
    scheduledLogoutHandle = null
  }

  async function submitPasswordForm() {
    if (!hasPasswordChangeValues(form)) {
      return
    }

    if (isReusedPassword(form)) {
      message.error('新密码不能与原始密码一样')
      return
    }

    const valid = await validateCenterForm(formRef.value)

    if (!valid) {
      message.error('请填写正确的信息')
      return
    }

    loading.value = true

    try {
      const res = await userModel.updatePassword(form)

      if (res.code < MAX_SUCCESS_CODE) {
        message.success(res.message)
        resetPasswordForm()
        clearPendingLogout()
        scheduledLogoutHandle = scheduleLogout(() => {
          scheduledLogoutHandle = null
          void logout(userStore)
        })
        return
      }

      message.error(res.message)
    } catch (error) {
      message.error(error?.message || '修改密码失败')
    } finally {
      loading.value = false
    }
  }

  function resetPasswordForm() {
    formRef.value?.resetFields()
  }

  onBeforeUnmount(() => {
    clearPendingLogout()
  })

  return {
    form,
    loading,
    resetPasswordForm,
    rules,
    submitPasswordForm,
  }
}
