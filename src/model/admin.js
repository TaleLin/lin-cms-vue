import { post, get, put, _delete } from '@/lin/plugin/axios'

export function getAllPermissions() {
  return get('cms/admin/permission')
}

export function getAdminUsers({ groupId, count = 10, page = 0 } = {}) {
  const params = { count, page }

  if (groupId) {
    params.group_id = groupId
  }

  return get('cms/admin/users', params)
}

export function getGroupsWithPermissions({ count = 10, page = 0 } = {}) {
  return get('cms/admin/groups', {
    count,
    page,
  })
}

export function getAllGroups() {
  return get('cms/admin/group/all')
}

export function getGroup(id) {
  return get(`cms/admin/group/${id}`)
}

export function createGroup({ name, info, permissionIds }) {
  return post('cms/admin/group', {
    name,
    info,
    permission_ids: permissionIds,
  })
}

export function updateGroup({ id, name, info }) {
  return put(`cms/admin/group/${id}`, {
    name,
    info,
  })
}

export function deleteGroup(id) {
  return _delete(`cms/admin/group/${id}`)
}

export function deleteUser(id) {
  return _delete(`cms/admin/user/${id}`)
}

export function updateUser({ id, email, groupIds }) {
  return put(`cms/admin/user/${id}`, {
    email,
    group_ids: groupIds,
  })
}

export function dispatchGroupPermissions({ groupId, permissionIds }) {
  return post('cms/admin/permission/dispatch/batch', {
    group_id: groupId,
    permission_ids: permissionIds,
  })
}

export function changeUserPassword({ id, newPassword, confirmPassword }) {
  return put(`cms/admin/user/${id}/password`, {
    new_password: newPassword,
    confirm_password: confirmPassword,
  })
}

export function removeGroupPermissions({ groupId, permissionIds }) {
  return post('cms/admin/permission/remove', {
    group_id: groupId,
    permission_ids: permissionIds,
  })
}
