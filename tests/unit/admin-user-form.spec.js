import { reactive, ref, toValue } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useUserInfoForm = vi.fn()
const useUserPasswordForm = vi.fn()

vi.mock('@/view/admin/user/use-user-info-form', () => ({
  useUserInfoForm,
}))

vi.mock('@/view/admin/user/use-user-password-form', () => ({
  useUserPasswordForm,
}))

const globalOptions = {
  directives: {
    loading: {},
  },
  stubs: {
    ElForm: true,
    ElFormItem: true,
    ElInput: true,
    ElCheckboxGroup: true,
    ElCheckbox: true,
    ElButton: true,
  },
}

describe('admin user form components', () => {
  beforeEach(() => {
    useUserInfoForm.mockReset()
    useUserPasswordForm.mockReset()
  })

  it('wires UserInfo to the dedicated info-form composable', async () => {
    const submitForm = vi.fn()
    const resetForm = vi.fn()
    let capturedArgs

    useUserInfoForm.mockImplementation(args => {
      capturedArgs = args

      return {
        isEdited: ref(false),
        loading: ref(false),
        resetForm,
        rules: {},
        submitForm,
        userInfo: reactive({
          email: '',
          username: '',
          password: '',
          groupIds: [],
          confirmPassword: '',
        }),
      }
    })

    const component = (await import('@/view/admin/user/user-info.vue')).default
    const wrapper = mount(component, {
      props: {
        allGroups: [{ id: 1, name: '管理员' }],
        id: 12,
        layout: 'dialog',
        userDetail: { email: 'admin@example.com', groups: [] },
        pageType: 'edit',
      },
      global: globalOptions,
    })

    expect(useUserInfoForm).toHaveBeenCalledTimes(1)
    expect(capturedArgs.id()).toBe(12)
    expect(capturedArgs.pageType()).toBe('edit')
    expect(capturedArgs.userDetail()).toEqual({ email: 'admin@example.com', groups: [] })
    expect(wrapper.classes()).toContain('container--dialog')

    capturedArgs.onSubmitted(true)
    expect(wrapper.emitted('submitted')).toEqual([[true]])

    wrapper.vm.submitForm()
    wrapper.vm.resetForm()
    expect(submitForm).toHaveBeenCalledTimes(1)
    expect(resetForm).toHaveBeenCalledTimes(1)
  })

  it('wires UserPassword to the dedicated password-form composable', async () => {
    const submitForm = vi.fn()
    const resetForm = vi.fn()
    let capturedArgs

    useUserPasswordForm.mockImplementation(args => {
      capturedArgs = args

      return {
        passwordForm: reactive({
          newPassword: '',
          confirmPassword: '',
        }),
        loading: ref(false),
        resetForm,
        rules: {},
        submitForm,
      }
    })

    const component = (await import('@/view/admin/user/user-password.vue')).default
    const wrapper = mount(component, {
      props: {
        id: 9,
        layout: 'dialog',
      },
      global: globalOptions,
    })

    expect(useUserPasswordForm).toHaveBeenCalledTimes(1)
    expect(toValue(capturedArgs.id)).toBe(9)
    expect(wrapper.classes()).toContain('container--dialog')

    capturedArgs.onSubmitted(true)
    expect(wrapper.emitted('submitted')).toEqual([[true]])

    wrapper.vm.submitForm()
    wrapper.vm.resetForm()
    expect(submitForm).toHaveBeenCalledTimes(1)
    expect(resetForm).toHaveBeenCalledTimes(1)
  })
})
