import { describe, expect, it } from 'vitest'

import {
  DEFAULT_GROUP_NAME,
  DEFAULT_NICKNAME,
  getGroupDisplayName,
  getNicknameLabel,
} from '@/component/layout/profile-menu-helpers'

describe('profile menu helpers', () => {
  it('builds readable group labels', () => {
    expect(getGroupDisplayName([{ name: '管理员' }, { name: '编辑' }])).toBe('管理员，编辑')
    expect(getGroupDisplayName([{ name: '' }, {}])).toBe(DEFAULT_GROUP_NAME)
    expect(getGroupDisplayName()).toBe(DEFAULT_GROUP_NAME)
  })

  it('falls back to the default nickname', () => {
    expect(getNicknameLabel('Lin')).toBe('Lin')
    expect(getNicknameLabel('')).toBe(DEFAULT_NICKNAME)
    expect(getNicknameLabel()).toBe(DEFAULT_NICKNAME)
  })
})
