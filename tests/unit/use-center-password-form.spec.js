import { defineComponent, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useCenterPasswordForm } from '@/view/center/use-center-password-form'

describe('use-center-password-form', () => {
  it('submits a valid password update and schedules logout', async () => {
    const validate = vi.fn().mockResolvedValue(undefined)
    const resetFields = vi.fn()
    const formRef = ref({
      resetFields,
      validate,
      validateField: vi.fn(),
    })
    const userStore = { id: 1 }
    const logout = vi.fn()
    const scheduleLogout = vi.fn(callback => callback())
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      updatePassword: vi.fn().mockResolvedValue({
        code: 0,
        message: '修改成功',
      }),
    }
    const { form, loading, submitPasswordForm } = useCenterPasswordForm({
      formRef,
      logout,
      message,
      scheduleLogout,
      userModel,
      userStore,
    })

    form.oldPassword = 'old-pass'
    form.newPassword = 'new-pass'
    form.confirmPassword = 'new-pass'

    await submitPasswordForm()

    expect(validate).toHaveBeenCalledTimes(1)
    expect(userModel.updatePassword).toHaveBeenCalledWith(form)
    expect(message.success).toHaveBeenCalledWith('修改成功')
    expect(resetFields).toHaveBeenCalledTimes(1)
    expect(scheduleLogout).toHaveBeenCalledTimes(1)
    expect(logout).toHaveBeenCalledWith(userStore)
    expect(loading.value).toBe(false)
  })

  it('blocks reused passwords before validating', async () => {
    const validate = vi.fn()
    const formRef = ref({
      resetFields: vi.fn(),
      validate,
      validateField: vi.fn(),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      updatePassword: vi.fn(),
    }
    const { form, submitPasswordForm } = useCenterPasswordForm({
      formRef,
      message,
      userModel,
      userStore: {},
    })

    form.oldPassword = 'same-pass'
    form.newPassword = 'same-pass'
    form.confirmPassword = 'same-pass'

    await submitPasswordForm()

    expect(message.error).toHaveBeenCalledWith('新密码不能与原始密码一样')
    expect(validate).not.toHaveBeenCalled()
    expect(userModel.updatePassword).not.toHaveBeenCalled()
  })

  it('shows validation errors and skips submission when the form is invalid', async () => {
    const validate = vi.fn().mockRejectedValue(new Error('invalid'))
    const formRef = ref({
      resetFields: vi.fn(),
      validate,
      validateField: vi.fn(),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      updatePassword: vi.fn(),
    }
    const { form, submitPasswordForm } = useCenterPasswordForm({
      formRef,
      message,
      userModel,
      userStore: {},
    })

    form.oldPassword = 'old-pass'
    form.newPassword = 'new-pass'
    form.confirmPassword = 'new-pass'

    await submitPasswordForm()

    expect(message.error).toHaveBeenCalledWith('请填写正确的信息')
    expect(userModel.updatePassword).not.toHaveBeenCalled()
  })

  it('surfaces backend failures from the password update request', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockResolvedValue(undefined),
      validateField: vi.fn(),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      updatePassword: vi.fn().mockResolvedValue({
        code: 10000,
        message: '修改失败',
      }),
    }
    const { form, submitPasswordForm } = useCenterPasswordForm({
      formRef,
      message,
      userModel,
      userStore: {},
    })

    form.oldPassword = 'old-pass'
    form.newPassword = 'new-pass'
    form.confirmPassword = 'new-pass'

    await submitPasswordForm()

    expect(message.error).toHaveBeenCalledWith('修改失败')
    expect(message.success).not.toHaveBeenCalled()
  })

  it('clears the pending logout timer when the host component unmounts', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockResolvedValue(undefined),
      validateField: vi.fn(),
    })
    const logout = vi.fn()
    const scheduleLogout = vi.fn().mockReturnValue('logout-timer')
    const clearScheduledLogout = vi.fn()
    const userModel = {
      updatePassword: vi.fn().mockResolvedValue({
        code: 0,
        message: '修改成功',
      }),
    }

    const Host = defineComponent({
      name: 'UseCenterPasswordFormHost',
      setup(_, { expose }) {
        const state = useCenterPasswordForm({
          clearScheduledLogout,
          formRef,
          logout,
          message: {
            error: vi.fn(),
            success: vi.fn(),
          },
          scheduleLogout,
          userModel,
          userStore: { id: 1 },
        })

        expose(state)
        return () => null
      },
    })

    const wrapper = mount(Host)
    wrapper.vm.form.oldPassword = 'old-pass'
    wrapper.vm.form.newPassword = 'new-pass'
    wrapper.vm.form.confirmPassword = 'new-pass'

    await wrapper.vm.submitPasswordForm()

    expect(scheduleLogout).toHaveBeenCalledTimes(1)
    expect(clearScheduledLogout).not.toHaveBeenCalled()

    wrapper.unmount()

    expect(clearScheduledLogout).toHaveBeenCalledWith('logout-timer')
    expect(logout).not.toHaveBeenCalled()
  })
})
