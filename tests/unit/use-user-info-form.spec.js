import { nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useUserInfoForm } from '@/view/admin/user/use-user-info-form'

function createFormRef() {
  return ref({
    clearValidate: vi.fn(),
    resetFields: vi.fn(),
    validate: vi.fn(),
  })
}

function createBaseOptions(overrides = {}) {
  const formRef = overrides.formRef ?? createFormRef()
  const validateForm = overrides.validateForm ?? vi.fn().mockResolvedValue(true)
  const message = overrides.message ?? {
    error: vi.fn(),
    success: vi.fn(),
  }
  const notifyError = overrides.notifyError ?? vi.fn()
  const adminModel = overrides.adminModel ?? {
    updateUser: vi.fn(),
  }
  const userModel = overrides.userModel ?? {
    register: vi.fn(),
  }

  return {
    formRef,
    validateForm,
    message,
    notifyError,
    adminModel,
    userModel,
    successCode: 10000,
    ...overrides,
  }
}

describe('use-user-info-form', () => {
  it('creates user in add mode and resets form state on success', async () => {
    const options = createBaseOptions({
      userModel: {
        register: vi.fn().mockResolvedValue({
          code: 0,
          message: '创建成功',
        }),
      },
    })
    const { submitForm, userInfo, loading } = useUserInfoForm(
      {
        id: () => undefined,
        userDetail: () => ({}),
        pageType: () => 'add',
      },
      options,
    )

    userInfo.username = 'tester'
    userInfo.email = 'tester@example.com'
    userInfo.password = '123456'
    userInfo.confirmPassword = '123456'
    userInfo.groupIds = [2]

    await submitForm()

    expect(options.validateForm).toHaveBeenCalledWith(options.formRef.value)
    expect(options.userModel.register).toHaveBeenCalledWith(userInfo)
    expect(options.message.success).toHaveBeenCalledWith('创建成功')
    expect(options.formRef.value.resetFields).toHaveBeenCalledTimes(1)
    expect(userInfo.groupIds).toEqual([])
    expect(loading.value).toBe(false)
  })

  it('shows validation message and skips requests when the form is invalid', async () => {
    const options = createBaseOptions({
      validateForm: vi.fn().mockResolvedValue(false),
    })
    const { submitForm } = useUserInfoForm(
      {
        id: () => undefined,
        userDetail: () => ({}),
        pageType: () => 'add',
      },
      options,
    )

    await submitForm()

    expect(options.message.error).toHaveBeenCalledWith('请填写正确的信息')
    expect(options.userModel.register).not.toHaveBeenCalled()
    expect(options.adminModel.updateUser).not.toHaveBeenCalled()
  })

  it('surfaces add-mode request errors through shared request handling', async () => {
    const error = new Error('network')
    const options = createBaseOptions({
      userModel: {
        register: vi.fn().mockRejectedValue(error),
      },
    })
    const { submitForm } = useUserInfoForm(
      {
        id: () => undefined,
        userDetail: () => ({}),
        pageType: () => 'add',
      },
      options,
    )

    await submitForm()

    expect(options.notifyError).toHaveBeenCalledWith(options.message, error, '新增用户失败')
  })

  it('avoids edit requests when group selection is unchanged', async () => {
    const submitted = vi.fn()
    const detail = {
      email: 'admin@example.com',
      username: 'admin',
      groups: [{ id: 1 }],
    }
    const options = createBaseOptions()
    const { submitForm, userInfo } = useUserInfoForm(
      {
        id: () => 8,
        userDetail: () => detail,
        pageType: () => 'edit',
        onSubmitted: submitted,
      },
      options,
    )

    await nextTick()
    expect(userInfo.groupIds).toEqual([1])

    await submitForm()

    expect(options.adminModel.updateUser).not.toHaveBeenCalled()
    expect(submitted).toHaveBeenCalledWith(false)
  })

  it('blocks edit submission when user id is invalid', async () => {
    const submitted = vi.fn()
    const detail = {
      email: 'admin@example.com',
      username: 'admin',
      groups: [{ id: 1 }],
    }
    const options = createBaseOptions()
    const { submitForm, userInfo } = useUserInfoForm(
      {
        id: () => undefined,
        userDetail: () => detail,
        pageType: () => 'edit',
        onSubmitted: submitted,
      },
      options,
    )

    await nextTick()
    userInfo.groupIds = [3]

    await submitForm()

    expect(options.message.error).toHaveBeenCalledWith('无效的用户ID')
    expect(options.adminModel.updateUser).not.toHaveBeenCalled()
    expect(submitted).toHaveBeenCalledWith(false)
  })

  it('updates user groups in edit mode and notifies page callback', async () => {
    const submitted = vi.fn()
    const detail = {
      email: 'admin@example.com',
      username: 'admin',
      groups: [{ id: 1 }],
    }
    const options = createBaseOptions({
      adminModel: {
        updateUser: vi.fn().mockResolvedValue({
          code: 0,
          message: '更新成功',
        }),
      },
    })
    const { submitForm, userInfo, loading } = useUserInfoForm(
      {
        id: () => 12,
        userDetail: () => detail,
        pageType: () => 'edit',
        onSubmitted: submitted,
      },
      options,
    )

    await nextTick()
    userInfo.email = 'next@example.com'
    userInfo.groupIds = [2]

    await submitForm()

    expect(options.adminModel.updateUser).toHaveBeenCalledWith({
      id: 12,
      email: 'next@example.com',
      groupIds: [2],
    })
    expect(options.message.success).toHaveBeenCalledWith('更新成功')
    expect(submitted).toHaveBeenCalledWith(true)
    expect(loading.value).toBe(false)
  })
})
