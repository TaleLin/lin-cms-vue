import { describe, expect, it } from 'vitest'

import { DEFAULT_NICKNAME } from '@/component/layout/profile-helpers'
import {
  createCenterPasswordDraft,
  createCenterPasswordRules,
  getCenterConfirmPasswordError,
  getCenterPasswordError,
  getDisplayNickname,
  hasPasswordChangeValues,
  isReusedPassword,
} from '@/view/center/center-helpers'

describe('center helpers', () => {
  it('derives display nicknames and password form state', () => {
    expect(createCenterPasswordDraft()).toEqual({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    expect(getDisplayNickname({ nickname: '七月' })).toBe('七月')
    expect(getDisplayNickname({})).toBe(DEFAULT_NICKNAME)

    expect(hasPasswordChangeValues({ oldPassword: '', newPassword: '', confirmPassword: '' })).toBe(false)
    expect(hasPasswordChangeValues({ oldPassword: 'old' })).toBe(true)
    expect(isReusedPassword({ oldPassword: 'same123', newPassword: 'same123' })).toBe(true)
  })

  it('returns validation messages for password fields', () => {
    expect(getCenterPasswordError('')).toBe('请输入密码')
    expect(getCenterPasswordError('12345')).toBe('密码长度不能少于6位数')
    expect(getCenterPasswordError('123456')).toBe('')

    expect(getCenterConfirmPasswordError('', '123456')).toBe('请再次输入密码')
    expect(getCenterConfirmPasswordError('654321', '123456')).toBe('两次输入密码不一致!')
    expect(getCenterConfirmPasswordError('123456', '123456')).toBe('')
  })

  it('builds password rules and revalidates the confirmation field when needed', () => {
    const revalidateConfirmPassword = vi.fn()
    const form = {
      oldPassword: '',
      newPassword: '123456',
      confirmPassword: '654321',
    }
    const rules = createCenterPasswordRules(form, {
      revalidateConfirmPassword,
    })
    const success = vi.fn()
    const fail = vi.fn()

    rules.newPassword[0].validator({}, form.newPassword, success)
    expect(revalidateConfirmPassword).toHaveBeenCalledTimes(1)

    rules.confirmPassword[0].validator({}, form.confirmPassword, fail)
    expect(fail).toHaveBeenCalledTimes(1)
    expect(fail.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(fail.mock.calls[0][0].message).toBe('两次输入密码不一致!')
  })
})
