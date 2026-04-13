import { describe, expect, it, vi } from 'vitest'

import {
  createUserInfoDraft,
  createUserInfoRules,
  createUserPasswordRules,
  createUserDetailDraft,
  createUserUpdatePayload,
  getUserConfirmPasswordError,
  getUserNameError,
  getUserPasswordError,
  hasGroupSelectionChanged,
  hasUserPasswordInput,
  mapUserRows,
  populateUserInfoDraft,
  populateUserDetailDraft,
  shouldMoveToPreviousPage,
  validateElementForm,
} from '@/view/admin/user/user-helpers'

describe('admin user helpers', () => {
  it('maps group names without mutating the original user objects', () => {
    const users = [
      {
        id: 1,
        username: 'alice',
        groups: [
          { id: 1, name: '管理员' },
          { id: 2, name: '编辑' },
        ],
      },
    ]

    const rows = mapUserRows(users)

    expect(rows).toHaveLength(1)
    expect(rows[0].groupNames).toBe('管理员，编辑')
    expect(users[0].groupNames).toBeUndefined()
  })

  it('compares selected groups without being affected by order', () => {
    const groups = [{ id: 1 }, { id: 3 }]

    expect(hasGroupSelectionChanged([3, 1], groups)).toBe(false)
    expect(hasGroupSelectionChanged([1], groups)).toBe(true)
  })

  it('builds editable user drafts and pagination decisions', () => {
    expect(createUserInfoDraft()).toEqual({
      email: '',
      username: '',
      password: '',
      groupIds: [],
      confirmPassword: '',
    })

    const draft = {
      email: '',
      username: '',
      password: 'temp',
      groupIds: [],
      confirmPassword: 'temp',
    }

    populateUserInfoDraft(draft, {
      email: 'admin@example.com',
      username: 'admin',
      groups: [{ id: 2 }],
    })

    expect(draft).toEqual({
      email: 'admin@example.com',
      username: 'admin',
      password: '',
      groupIds: [2],
      confirmPassword: '',
    })

    expect(shouldMoveToPreviousPage(11, 10, 2)).toBe(true)
    expect(shouldMoveToPreviousPage(10, 10, 1)).toBe(false)
  })

  it('maps list-dialog state without mutating source groups', () => {
    const dialogState = createUserDetailDraft()
    const groups = [{ id: 3, name: '编辑' }]

    populateUserDetailDraft(dialogState, {
      email: 'editor@example.com',
      username: 'editor',
      groups,
    })

    expect(dialogState).toEqual({
      email: 'editor@example.com',
      username: 'editor',
      groups,
    })
  })

  it('returns validation messages for user forms', () => {
    expect(getUserNameError('')).toBe('用户名不能为空')
    expect(getUserNameError('admin')).toBe('')
    expect(getUserPasswordError('')).toBe('请输入密码')
    expect(getUserPasswordError('12345')).toBe('密码长度不能少于6位数')
    expect(getUserPasswordError('123456')).toBe('')
    expect(getUserConfirmPasswordError('', '123456')).toBe('请再次输入密码')
    expect(getUserConfirmPasswordError('654321', '123456')).toBe('两次输入密码不一致!')
    expect(getUserConfirmPasswordError('123456', '123456')).toBe('')
    expect(hasUserPasswordInput({ newPassword: '', confirmPassword: '' })).toBe(false)
    expect(hasUserPasswordInput({ newPassword: '123456', confirmPassword: '' })).toBe(true)
  })

  it('validates element forms defensively', async () => {
    await expect(validateElementForm()).resolves.toBe(false)
    await expect(
      validateElementForm({
        validate: () => Promise.resolve(),
      }),
    ).resolves.toBe(true)
    await expect(
      validateElementForm({
        validate: () => Promise.reject(new Error('invalid')),
      }),
    ).resolves.toBe(false)
  })

  it('builds user info validation rules that surface semantic errors', () => {
    const rules = createUserInfoRules({
      password: '123456',
    })
    const usernameCallback = vi.fn()
    const passwordCallback = vi.fn()
    const confirmCallback = vi.fn()

    rules.username[0].validator(null, '', usernameCallback)
    rules.password[0].validator(null, '12345', passwordCallback)
    rules.confirmPassword[0].validator(null, '654321', confirmCallback)

    expect(usernameCallback).toHaveBeenCalledWith(expect.any(Error))
    expect(usernameCallback.mock.calls[0][0].message).toBe('用户名不能为空')
    expect(passwordCallback.mock.calls[0][0].message).toBe('密码长度不能少于6位数')
    expect(confirmCallback.mock.calls[0][0].message).toBe('两次输入密码不一致!')
    expect(rules.email[0]).toEqual({
      type: 'email',
      message: '请输入正确的邮箱地址或者不填',
      trigger: ['blur', 'change'],
    })
  })

  it('builds user password rules that revalidate confirmation after password changes', () => {
    const validateField = vi.fn()
    const callback = vi.fn()
    const confirmCallback = vi.fn()
    const rules = createUserPasswordRules(
      {
        newPassword: '123456',
        confirmPassword: '123456',
      },
      {
        value: {
          validateField,
        },
      },
    )

    rules.newPassword[0].validator(null, '123456', callback)
    rules.confirmPassword[0].validator(null, '123456', confirmCallback)

    expect(validateField).toHaveBeenCalledWith('confirmPassword')
    expect(callback).toHaveBeenCalledWith()
    expect(confirmCallback).toHaveBeenCalledWith()
  })

  it('creates immutable update payloads for user edit submissions', () => {
    const userInfo = {
      email: 'admin@example.com',
      groupIds: [1, 3],
    }
    const payload = createUserUpdatePayload(9, userInfo)

    payload.groupIds.push(5)

    expect(payload).toEqual({
      id: 9,
      email: 'admin@example.com',
      groupIds: [1, 3, 5],
    })
    expect(userInfo.groupIds).toEqual([1, 3])
  })
})
