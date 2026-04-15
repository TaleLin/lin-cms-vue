import { describe, expect, it } from 'vitest'

import { DEFAULT_NICKNAME } from '@/component/layout/profile-helpers'
import {
  createCenterPasswordDraft,
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
})
