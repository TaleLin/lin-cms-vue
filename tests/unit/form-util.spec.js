import { describe, expect, it, vi } from 'vitest'

import {
  createErrorMessageValidator,
  createRequiredRule,
  getConfirmedValueError,
  getPasswordError,
  getRequiredFieldError,
  validateElementForm,
} from '@/lin/util/form'

describe('form util', () => {
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

  it('returns common validation messages', () => {
    expect(getRequiredFieldError('', '用户名不能为空')).toBe('用户名不能为空')
    expect(getRequiredFieldError('admin', '用户名不能为空')).toBe('')
    expect(getPasswordError('')).toBe('请输入密码')
    expect(getPasswordError('12345')).toBe('密码长度不能少于6位数')
    expect(getPasswordError('123456')).toBe('')
    expect(getConfirmedValueError('', '123456')).toBe('请再次输入密码')
    expect(getConfirmedValueError('654321', '123456')).toBe('两次输入密码不一致!')
    expect(getConfirmedValueError('123456', '123456')).toBe('')
  })

  it('creates reusable element validators and rules', () => {
    const onSuccess = vi.fn()
    const callback = vi.fn()
    const errorCallback = vi.fn()
    const validator = createErrorMessageValidator(value => getRequiredFieldError(value, '分组名称不能为空'), {
      onSuccess,
    })

    validator(null, '编辑组', callback)
    validator(null, '', errorCallback)

    expect(onSuccess).toHaveBeenCalledWith('编辑组')
    expect(callback).toHaveBeenCalledWith()
    expect(errorCallback).toHaveBeenCalledWith(expect.any(Error))
    expect(errorCallback.mock.calls[0][0].message).toBe('分组名称不能为空')

    const requiredRule = createRequiredRule('信息不能为空')
    expect(requiredRule.required).toBe(true)
    expect(requiredRule.trigger).toBe('blur')
  })
})
