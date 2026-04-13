import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  changeUserPassword: vi.fn(),
  ElMessage: {
    error: vi.fn(),
    success: vi.fn(),
  },
  useTemplateRef: vi.fn(),
}))

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')

  return {
    ...actual,
    useTemplateRef: mocks.useTemplateRef,
  }
})

vi.mock('element-plus', () => ({
  ElMessage: mocks.ElMessage,
}))

vi.mock('@/model/admin', () => ({
  changeUserPassword: mocks.changeUserPassword,
}))

import { useUserPasswordForm } from '@/view/admin/user/use-user-password-form'

function createFormRef({ valid = true } = {}) {
  const resetFields = vi.fn()
  const validateField = vi.fn()
  const validate = valid ? vi.fn().mockResolvedValue(undefined) : vi.fn().mockRejectedValue(new Error('invalid'))

  return {
    refValue: ref({
      resetFields,
      validateField,
      validate,
    }),
    resetFields,
    validateField,
    validate,
  }
}

describe('use-user-password-form', () => {
  beforeEach(() => {
    mocks.changeUserPassword.mockReset()
    mocks.ElMessage.error.mockReset()
    mocks.ElMessage.success.mockReset()
    mocks.useTemplateRef.mockReset()
  })

  it('short-circuits empty password submissions and only notifies the caller', async () => {
    const onSubmitted = vi.fn()
    const { refValue, validate } = createFormRef()
    mocks.useTemplateRef.mockReturnValue(refValue)

    const { submitForm, loading } = useUserPasswordForm({
      id: () => 9,
      onSubmitted,
    })

    await submitForm()

    expect(onSubmitted).toHaveBeenCalledWith(true)
    expect(validate).not.toHaveBeenCalled()
    expect(mocks.changeUserPassword).not.toHaveBeenCalled()
    expect(mocks.ElMessage.error).not.toHaveBeenCalled()
    expect(loading.value).toBe(false)
  })

  it('shows a validation error before submitting invalid password data', async () => {
    const onSubmitted = vi.fn()
    const { refValue, validate } = createFormRef({ valid: false })
    mocks.useTemplateRef.mockReturnValue(refValue)

    const { passwordForm, submitForm } = useUserPasswordForm({
      id: () => 9,
      onSubmitted,
    })

    passwordForm.newPassword = 'new-pass'
    passwordForm.confirmPassword = 'new-pass'

    await submitForm()

    expect(validate).toHaveBeenCalledTimes(1)
    expect(mocks.ElMessage.error).toHaveBeenCalledWith('请填写正确的密码信息')
    expect(mocks.changeUserPassword).not.toHaveBeenCalled()
    expect(onSubmitted).not.toHaveBeenCalled()
  })

  it('submits valid passwords, resets the form, and emits completion on success', async () => {
    const onSubmitted = vi.fn()
    const { refValue, resetFields } = createFormRef()
    mocks.useTemplateRef.mockReturnValue(refValue)
    mocks.changeUserPassword.mockResolvedValue({
      code: 0,
      message: '修改成功',
    })

    const { passwordForm, submitForm, loading, resetForm } = useUserPasswordForm({
      id: () => 12,
      onSubmitted,
    })

    passwordForm.newPassword = 'new-pass'
    passwordForm.confirmPassword = 'new-pass'

    await submitForm()
    resetForm()

    expect(mocks.changeUserPassword).toHaveBeenCalledWith({
      id: 12,
      newPassword: 'new-pass',
      confirmPassword: 'new-pass',
    })
    expect(mocks.ElMessage.success).toHaveBeenCalledWith('修改成功')
    expect(resetFields).toHaveBeenCalledTimes(2)
    expect(onSubmitted).toHaveBeenCalledWith(true)
    expect(loading.value).toBe(false)
  })

  it('surfaces backend failure messages without resetting the form', async () => {
    const onSubmitted = vi.fn()
    const { refValue, resetFields } = createFormRef()
    mocks.useTemplateRef.mockReturnValue(refValue)
    mocks.changeUserPassword.mockResolvedValue({
      code: 10000,
      message: '修改失败',
    })

    const { passwordForm, submitForm, loading } = useUserPasswordForm({
      id: 18,
      onSubmitted,
    })

    passwordForm.newPassword = 'new-pass'
    passwordForm.confirmPassword = 'new-pass'

    await submitForm()

    expect(mocks.changeUserPassword).toHaveBeenCalledWith({
      id: 18,
      newPassword: 'new-pass',
      confirmPassword: 'new-pass',
    })
    expect(mocks.ElMessage.error).toHaveBeenCalledWith('修改失败')
    expect(mocks.ElMessage.success).not.toHaveBeenCalled()
    expect(resetFields).not.toHaveBeenCalled()
    expect(onSubmitted).not.toHaveBeenCalled()
    expect(loading.value).toBe(false)
  })
})
