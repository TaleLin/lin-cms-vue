import { reactive, ref, toValue, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'

import { MAX_SUCCESS_CODE } from '@/config/global'
import { changeUserPassword } from '@/model/admin'

import { createUserPasswordRules, hasUserPasswordInput, validateElementForm } from './user-helpers'

export function useUserPasswordForm({ id, onSubmitted }) {
  const form = useTemplateRef('form')
  const loading = ref(false)
  const passwordForm = reactive({
    newPassword: '',
    confirmPassword: '',
  })
  const rules = createUserPasswordRules(passwordForm, form)

  async function submitForm() {
    if (!hasUserPasswordInput(passwordForm)) {
      onSubmitted(true)
      return
    }

    const valid = await validateElementForm(form.value)

    if (!valid) {
      ElMessage.error('请填写正确的密码信息')
      return
    }

    loading.value = true

    try {
      const res = await changeUserPassword({
        id: toValue(id),
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      })

      if (res.code < MAX_SUCCESS_CODE) {
        ElMessage.success(res.message)
        resetForm()
        onSubmitted(true)
        return
      }

      ElMessage.error(res.message)
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    form.value?.resetFields()
  }

  return {
    passwordForm,
    loading,
    resetForm,
    rules,
    submitForm,
  }
}
