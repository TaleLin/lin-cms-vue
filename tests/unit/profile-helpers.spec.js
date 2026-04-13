import { describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_NICKNAME,
  getAvatarValidationMessage,
  revokeObjectUrl,
  shouldUpdateNickname,
} from '@/component/layout/profile-helpers'

describe('profile helpers', () => {
  it('validates avatar size and dimensions', () => {
    expect(getAvatarValidationMessage({ size: 6 * 1024 * 1024, width: 100, height: 100 })).toBe('文件过大超过5M')
    expect(getAvatarValidationMessage({ size: 1024, width: 40, height: 100 })).toBe(
      '图像宽度过小, 请选择大于50px的图像',
    )
    expect(getAvatarValidationMessage({ size: 1024, width: 100, height: 40 })).toBe(
      '图像高度过小, 请选择大于50px的图像',
    )
    expect(getAvatarValidationMessage({ size: 1024, width: 100, height: 100 })).toBe('')
  })

  it('only updates nickname when it really changed', () => {
    expect(DEFAULT_NICKNAME).toBe('佚名')
    expect(shouldUpdateNickname('新昵称', '旧昵称')).toBe(true)
    expect(shouldUpdateNickname('佚名', '旧昵称')).toBe(false)
    expect(shouldUpdateNickname('旧昵称', '旧昵称')).toBe(false)
    expect(shouldUpdateNickname('', '旧昵称')).toBe(false)
  })

  it('revokes only blob object urls', () => {
    const revokeObjectURL = vi.fn()
    window.URL.revokeObjectURL = revokeObjectURL

    revokeObjectUrl('blob:avatar')
    revokeObjectUrl('/images/avatar.png')

    expect(revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:avatar')
  })
})
