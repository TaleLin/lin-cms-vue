import { beforeEach, describe, expect, it, vi } from 'vitest'

const axiosMocks = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  _delete: vi.fn(),
}))

vi.mock('@/lin/plugin/axios', () => ({
  post: axiosMocks.post,
  get: axiosMocks.get,
  put: axiosMocks.put,
  _delete: axiosMocks._delete,
}))

import * as adminModel from '@/model/admin'

describe('admin model', () => {
  beforeEach(() => {
    axiosMocks.post.mockReset()
    axiosMocks.get.mockReset()
    axiosMocks.put.mockReset()
    axiosMocks._delete.mockReset()
  })

  it('exposes only the canonical admin API methods', () => {
    expect(Object.keys(adminModel).sort()).toEqual([
      'changeUserPassword',
      'createGroup',
      'deleteGroup',
      'deleteUser',
      'dispatchGroupPermissions',
      'getAdminUsers',
      'getAllGroups',
      'getAllPermissions',
      'getGroup',
      'getGroupsWithPermissions',
      'removeGroupPermissions',
      'updateGroup',
      'updateUser',
    ])
  })

  it('maps object-shaped user and group updates to backend payloads', () => {
    adminModel.updateGroup({ id: 3, name: '编辑', info: '内容编辑' })
    expect(axiosMocks.put).toHaveBeenNthCalledWith(1, 'cms/admin/group/3', {
      name: '编辑',
      info: '内容编辑',
    })

    adminModel.updateUser({ id: 5, email: 'editor@example.com', groupIds: [1, 2] })
    expect(axiosMocks.put).toHaveBeenNthCalledWith(2, 'cms/admin/user/5', {
      email: 'editor@example.com',
      group_ids: [1, 2],
    })
  })

  it('maps permission dispatch and password changes with semantic parameter names', () => {
    adminModel.dispatchGroupPermissions({ groupId: 7, permissionIds: [11, 12] })
    expect(axiosMocks.post).toHaveBeenNthCalledWith(1, 'cms/admin/permission/dispatch/batch', {
      group_id: 7,
      permission_ids: [11, 12],
    })

    adminModel.changeUserPassword({ id: 9, newPassword: '123456', confirmPassword: '123456' })
    expect(axiosMocks.put).toHaveBeenNthCalledWith(1, 'cms/admin/user/9/password', {
      new_password: '123456',
      confirm_password: '123456',
    })
  })

  it('reads permission and group resources from their canonical endpoints', () => {
    adminModel.getAllPermissions()
    adminModel.getAllGroups()
    adminModel.getGroup(12)
    adminModel.getGroupsWithPermissions()
    adminModel.getGroupsWithPermissions({ count: 20, page: 3 })

    expect(axiosMocks.get).toHaveBeenNthCalledWith(1, 'cms/admin/permission')
    expect(axiosMocks.get).toHaveBeenNthCalledWith(2, 'cms/admin/group/all')
    expect(axiosMocks.get).toHaveBeenNthCalledWith(3, 'cms/admin/group/12')
    expect(axiosMocks.get).toHaveBeenNthCalledWith(4, 'cms/admin/groups', {
      count: 10,
      page: 0,
    })
    expect(axiosMocks.get).toHaveBeenNthCalledWith(5, 'cms/admin/groups', {
      count: 20,
      page: 3,
    })
  })

  it('uses explicit default paging and optional group filters when loading admin users', () => {
    adminModel.getAdminUsers()
    adminModel.getAdminUsers({ count: 30, page: 2 })
    adminModel.getAdminUsers({ groupId: 4, count: 8, page: 1 })

    expect(axiosMocks.get).toHaveBeenNthCalledWith(1, 'cms/admin/users', {
      count: 10,
      page: 0,
    })
    expect(axiosMocks.get).toHaveBeenNthCalledWith(2, 'cms/admin/users', {
      count: 30,
      page: 2,
    })
    expect(axiosMocks.get).toHaveBeenNthCalledWith(3, 'cms/admin/users', {
      count: 8,
      page: 1,
      group_id: 4,
    })
  })

  it('maps create and delete operations to the backend contract', () => {
    adminModel.createGroup({
      name: '运营组',
      info: '负责活动配置',
      permissionIds: [3, 4],
    })
    adminModel.deleteGroup(6)
    adminModel.deleteUser(15)
    adminModel.removeGroupPermissions({ groupId: 6, permissionIds: [8, 9] })

    expect(axiosMocks.post).toHaveBeenNthCalledWith(1, 'cms/admin/group', {
      name: '运营组',
      info: '负责活动配置',
      permission_ids: [3, 4],
    })
    expect(axiosMocks._delete).toHaveBeenNthCalledWith(1, 'cms/admin/group/6')
    expect(axiosMocks._delete).toHaveBeenNthCalledWith(2, 'cms/admin/user/15')
    expect(axiosMocks.post).toHaveBeenNthCalledWith(2, 'cms/admin/permission/remove', {
      group_id: 6,
      permission_ids: [8, 9],
    })
  })
})
