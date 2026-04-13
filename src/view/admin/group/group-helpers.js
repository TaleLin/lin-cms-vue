function parsePositiveInteger(value) {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : null
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  if (!/^\d+$/.test(normalized)) {
    return null
  }

  const parsed = Number.parseInt(normalized, 10)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null
}

export function createGroupDraft() {
  return {
    name: '',
    info: '',
  }
}

export function assignGroupDraft(target, source = {}) {
  target.name = source.name || ''
  target.info = source.info || ''
}

export function createGroupRules() {
  const checkName = (_, value, callback) => {
    if (!value) {
      callback(new Error('分组名称不能为空'))
      return
    }

    callback()
  }

  return {
    info: [],
    name: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
  }
}

export function buildGroupEditRoute(groupId) {
  return {
    path: '/admin/group/edit',
    query: { id: groupId },
  }
}

export function parseGroupId(rawGroupId) {
  return parsePositiveInteger(rawGroupId)
}

export function normalizePermissionIds(permissionIds = []) {
  if (!Array.isArray(permissionIds)) {
    return []
  }

  const normalizedIds = new Set()

  permissionIds.forEach(permissionId => {
    const parsedPermissionId = parsePositiveInteger(permissionId)

    if (parsedPermissionId) {
      normalizedIds.add(parsedPermissionId)
    }
  })

  return [...normalizedIds]
}

export async function validateGroupForm(form) {
  if (!form) {
    return false
  }

  try {
    await form.validate()
    return true
  } catch {
    return false
  }
}

export function hasGroupInfoChanged(group, cacheGroup) {
  return cacheGroup.name !== group.name || cacheGroup.info !== group.info
}

export function getPermissionChanges(currentPermissions = [], cachedPermissions = []) {
  const selected = new Set(currentPermissions)
  const cached = new Set(cachedPermissions)

  return {
    addPermissions: [...selected].filter(id => !cached.has(id)),
    deletePermissions: [...cached].filter(id => !selected.has(id)),
  }
}

export function createPermissionSelectionState(allPermissions = {}, selectedPermissions = []) {
  const permissionSource = allPermissions && typeof allPermissions === 'object' ? allPermissions : {}
  const permissionList = Array.isArray(selectedPermissions) ? selectedPermissions : []
  const moduleCounter = {}
  const moduleNames = new Set()
  const visitedPermissionIds = new Set()
  const permissionModuleIds = []
  const checkedPermissionNames = []

  permissionList.forEach(item => {
    const permissionId = parsePositiveInteger(item?.id)
    const permissionName = typeof item?.name === 'string' ? item.name : ''
    const moduleName = typeof item?.module === 'string' ? item.module : ''

    if (!permissionId || !permissionName || !moduleName) {
      return
    }

    if (visitedPermissionIds.has(permissionId)) {
      return
    }
    visitedPermissionIds.add(permissionId)

    permissionModuleIds.push(permissionId)
    checkedPermissionNames.push(permissionName)
    moduleNames.add(moduleName)
    moduleCounter[moduleName] = (moduleCounter[moduleName] || 0) + 1
  })

  const permissionModuleNames = [...moduleNames]
  const halfPermissions = permissionModuleNames.filter(moduleName => {
    const total = permissionSource[moduleName]?.length || 0
    return total !== 0 && total !== moduleCounter[moduleName]
  })

  return {
    checkedPermissionNames,
    halfPermissions,
    permissionModuleIds,
    permissionModuleNames,
  }
}

export function togglePermissionModule(state, permissions = [], moduleName, checked) {
  const currentIds = permissions.map(item => item.id)
  const currentNames = permissions.map(item => item.name)
  const permissionModuleIds = new Set(state.permissionModuleIds)
  const checkedPermissionNames = new Set(state.checkedPermissionNames)
  const permissionModuleNames = new Set(state.permissionModuleNames)
  const halfPermissions = new Set(state.halfPermissions)

  if (checked) {
    currentIds.forEach(id => permissionModuleIds.add(id))
    currentNames.forEach(name => checkedPermissionNames.add(name))
    permissionModuleNames.add(moduleName)
  } else {
    currentIds.forEach(id => permissionModuleIds.delete(id))
    currentNames.forEach(name => checkedPermissionNames.delete(name))
    permissionModuleNames.delete(moduleName)
  }

  halfPermissions.delete(moduleName)

  return {
    checkedPermissionNames: [...checkedPermissionNames],
    halfPermissions: [...halfPermissions],
    permissionModuleIds: [...permissionModuleIds],
    permissionModuleNames: [...permissionModuleNames],
  }
}

export function togglePermissionItem(state, permissionItem, permissions = [], moduleName, checked) {
  const permissionModuleIds = new Set(state.permissionModuleIds)
  const checkedPermissionNames = new Set(state.checkedPermissionNames)
  const permissionModuleNames = new Set(state.permissionModuleNames)
  const halfPermissions = new Set(state.halfPermissions)
  const currentIds = permissions.map(item => item.id)

  if (checked) {
    permissionModuleIds.add(permissionItem.id)
    checkedPermissionNames.add(permissionItem.name)
  } else {
    permissionModuleIds.delete(permissionItem.id)
    checkedPermissionNames.delete(permissionItem.name)
  }

  const count = currentIds.filter(id => permissionModuleIds.has(id)).length

  if (count === currentIds.length) {
    permissionModuleNames.add(moduleName)
    halfPermissions.delete(moduleName)
  } else if (count === 0) {
    permissionModuleNames.delete(moduleName)
    halfPermissions.delete(moduleName)
  } else {
    permissionModuleNames.delete(moduleName)
    halfPermissions.add(moduleName)
  }

  return {
    checkedPermissionNames: [...checkedPermissionNames],
    halfPermissions: [...halfPermissions],
    permissionModuleIds: [...permissionModuleIds],
    permissionModuleNames: [...permissionModuleNames],
  }
}
