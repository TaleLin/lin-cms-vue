import { describe, expect, it } from 'vitest'

import {
  createUserInfoDraft,
  createUserDetailDraft,
  createUserUpdatePayload,
  hasGroupSelectionChanged,
  hasUserPasswordInput,
  mapUserRows,
  populateUserInfoDraft,
  populateUserDetailDraft,
  shouldMoveToPreviousPage,
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

  it('tracks whether the password form contains input', () => {
    expect(hasUserPasswordInput({ newPassword: '', confirmPassword: '' })).toBe(false)
    expect(hasUserPasswordInput({ newPassword: '123456', confirmPassword: '' })).toBe(true)
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
