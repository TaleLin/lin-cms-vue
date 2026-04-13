import { describe, expect, it } from 'vitest'

import {
  assignGroupDraft,
  buildGroupEditRoute,
  createGroupDraft,
  createPermissionSelectionState,
  getPermissionChanges,
  hasGroupInfoChanged,
  normalizePermissionIds,
  parseGroupId,
  togglePermissionItem,
  togglePermissionModule,
} from '@/view/admin/group/group-helpers'

describe('group helpers', () => {
  it('detects whether group info changed', () => {
    const current = { name: 'admin', info: '管理员' }

    expect(hasGroupInfoChanged(current, { name: 'admin', info: '管理员' })).toBe(false)
    expect(hasGroupInfoChanged(current, { name: 'editor', info: '管理员' })).toBe(true)
  })

  it('creates and applies group drafts predictably', () => {
    const draft = createGroupDraft()
    expect(draft).toEqual({ name: '', info: '' })

    assignGroupDraft(draft, { name: '编辑组', info: '内容审核' })
    expect(draft).toEqual({ name: '编辑组', info: '内容审核' })

    assignGroupDraft(draft, {})
    expect(draft).toEqual({ name: '', info: '' })
  })

  it('builds the edit-page route payload', () => {
    expect(buildGroupEditRoute(12)).toEqual({
      path: '/admin/group/edit',
      query: { id: 12 },
    })
  })

  it('returns permission additions and deletions', () => {
    const result = getPermissionChanges([1, 3, 5], [1, 2, 5])

    expect(result).toEqual({
      addPermissions: [3],
      deletePermissions: [2],
    })
  })

  it('parses group id values strictly', () => {
    expect(parseGroupId(9)).toBe(9)
    expect(parseGroupId('12')).toBe(12)
    expect(parseGroupId(' 18 ')).toBe(18)
    expect(parseGroupId('7abc')).toBeNull()
    expect(parseGroupId('0')).toBeNull()
    expect(parseGroupId(-3)).toBeNull()
    expect(parseGroupId(['4'])).toBeNull()
  })

  it('normalizes permission ids and removes invalid values', () => {
    expect(normalizePermissionIds([1, '2', '2', ' 3 ', 'x', 0, -1, null])).toEqual([1, 2, 3])
    expect(normalizePermissionIds()).toEqual([])
  })

  it('derives module and checkbox selection state from existing permissions', () => {
    const allPermissions = {
      图书: [
        { id: 1, name: '查看图书' },
        { id: 2, name: '删除图书' },
      ],
    }

    expect(createPermissionSelectionState(allPermissions, [{ id: 1, name: '查看图书', module: '图书' }])).toEqual({
      checkedPermissionNames: ['查看图书'],
      halfPermissions: ['图书'],
      permissionModuleIds: [1],
      permissionModuleNames: ['图书'],
    })
  })

  it('ignores invalid permission entries while deriving selection state', () => {
    const allPermissions = {
      图书: [{ id: 1, name: '查看图书' }],
    }

    expect(
      createPermissionSelectionState(allPermissions, [
        { id: 1, name: '查看图书', module: '图书' },
        { id: 1, name: '查看图书', module: '图书' },
        { id: 'x', name: '非法ID', module: '图书' },
        null,
        { id: 2, name: '', module: '图书' },
      ]),
    ).toEqual({
      checkedPermissionNames: ['查看图书'],
      halfPermissions: [],
      permissionModuleIds: [1],
      permissionModuleNames: ['图书'],
    })
  })

  it('toggles module and single permission selections predictably', () => {
    const initialState = {
      checkedPermissionNames: [],
      halfPermissions: [],
      permissionModuleIds: [],
      permissionModuleNames: [],
    }
    const permissions = [
      { id: 1, name: '查看图书' },
      { id: 2, name: '删除图书' },
    ]

    const allChecked = togglePermissionModule(initialState, permissions, '图书', true)
    expect(allChecked.permissionModuleIds).toEqual([1, 2])
    expect(allChecked.permissionModuleNames).toEqual(['图书'])

    const partial = togglePermissionItem(allChecked, permissions[0], permissions, '图书', false)
    expect(partial.permissionModuleIds).toEqual([2])
    expect(partial.permissionModuleNames).toEqual([])
    expect(partial.halfPermissions).toEqual(['图书'])
  })
})
