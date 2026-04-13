export function hasPermission(permissions = [], route = {}, user = {}) {
  if (user?.admin) {
    return true
  }

  if (route.permission) {
    return permissions.some(permission => route.permission.includes(permission))
  }

  return true
}
