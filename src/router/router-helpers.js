export const ROUTE_META_KEYS = Object.freeze(['title', 'icon', 'permission', 'type', 'blueBaseColor'])

export function createRouteMeta(routeConfig = {}) {
  const meta = {
    title: routeConfig.title,
    icon: routeConfig.icon,
    permission: routeConfig.permission,
    type: routeConfig.type,
    blueBaseColor: typeof routeConfig.blueBaseColor === 'string' ? routeConfig.blueBaseColor : '',
  }

  return Object.fromEntries(ROUTE_META_KEYS.filter(key => meta[key] !== undefined).map(key => [key, meta[key]]))
}

export function assertViewRouteConfig(viewConfig) {
  if (!viewConfig || typeof viewConfig !== 'object') {
    throw new Error('Invalid route config: expected an object')
  }

  const missingFields = ['route', 'name', 'filePath'].filter(field => !viewConfig[field])

  if (missingFields.length > 0) {
    throw new Error(`Invalid route config: missing ${missingFields.join(', ')}`)
  }
}

export function normalizeRouteName(routeName) {
  if (typeof routeName === 'symbol') {
    return routeName.description || ''
  }

  if (routeName == null) {
    return ''
  }

  return String(routeName)
}

export function createPublicRouteNameSet(routeNames = []) {
  if (!Array.isArray(routeNames)) {
    return new Set()
  }

  return new Set(routeNames.map(normalizeRouteName).filter(Boolean))
}

export function requiresLogin(routeName, publicRouteNames) {
  const routeKey = normalizeRouteName(routeName)

  if (!routeKey) {
    return true
  }

  return !publicRouteNames.has(routeKey)
}

export function shouldCheckRoutePermission(route, { publicRouteNames, noPermissionRedirectPath } = {}) {
  if (!route || typeof route !== 'object') {
    return false
  }

  if (!requiresLogin(route.name, publicRouteNames)) {
    return false
  }

  return route.path !== noPermissionRedirectPath
}

export function isRedirectOnlyRoute(route) {
  return Boolean(route?.redirect) && !route?.component
}

export function createRouteGuard({
  publicRouteNames,
  getUserStore,
  hasLoggedInSession,
  hasPermission,
  showNoPermissionMessage,
  scheduleAutoJump,
  noPermissionRedirectPath = '/about',
  loginRedirectPath = '/login',
}) {
  return to => {
    if (isRedirectOnlyRoute(to)) {
      return
    }

    const userStore = getUserStore()

    if (requiresLogin(to.name, publicRouteNames) && !hasLoggedInSession(userStore)) {
      userStore.loginOut()
      return { path: loginRedirectPath }
    }

    const { permissions, user } = userStore
    if (
      shouldCheckRoutePermission(to, {
        publicRouteNames,
        noPermissionRedirectPath,
      }) &&
      !hasPermission(permissions, to.meta, user)
    ) {
      showNoPermissionMessage()
      return { path: noPermissionRedirectPath }
    }

    scheduleAutoJump()
  }
}
