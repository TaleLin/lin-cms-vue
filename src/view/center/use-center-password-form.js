import { onBeforeUnmount, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

import {
  createErrorMessageValidator,
  getConfirmedValueError,
  getPasswordError,
  validateElementForm,
} from '@/lin/util/form'
import { updatePassword } from '@/model/user'
import { logoutAndRedirectToLogin } from '@/lin/util/session'
import { isSuccessfulResponse } from '@/lin/util/response'

import { createCenterPasswordDraft, hasPasswordChangeValues, isReusedPassword } from './center-helpers'

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
  const rules = {
    oldPassword: [
      {
        required: true,
        trigger: 'blur',
        validator: (_, value, callback) => {
          if (!value) {
            callback(new Error('原始密码不能为空'))
            return
          }

          callback()
        },
      },
    ],
    newPassword: [
      {
        required: true,
        trigger: 'blur',
        validator: createErrorMessageValidator(value => getPasswordError(value), {
          onSuccess: () => {
            if (form.confirmPassword !== '') {
              formRef.value?.validateField('confirmPassword')
            }
          },
        }),
      },
    ],
    confirmPassword: [
      {
        required: true,
        trigger: 'blur',
        validator: createErrorMessageValidator(value => getConfirmedValueError(value, form.newPassword)),
      },
    ],
  }
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

    const valid = await validateElementForm(formRef.value)

    if (!valid) {
      message.error('请填写正确的信息')
      return
    }

    loading.value = true

    try {
      const res = await userModel.updatePassword(form)

      if (isSuccessfulResponse(res)) {
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
