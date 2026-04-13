import { createRouter, createWebHashHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

import appConfig from '@/config/index'
import { scheduleAutoJump } from '@/lin/util/auto-jump'
import { hasPermission } from '@/lin/util/permission'
import { useUserStore } from '@/store/modules/user'
import { hasLoggedInSession } from '@/lin/util/session'
import routes from './route'
import { createPublicRouteNameSet, createRouteGuard } from './router-helpers'

const publicRouteNames = createPublicRouteNameSet(appConfig.notLoginRoute)
const defaultScrollBehavior = () => ({ top: 0 })

export function createAppRouter({
  createRouterFn = createRouter,
  createHistoryFn = createWebHashHistory,
  baseUrl = import.meta.env.BASE_URL,
  appRoutes = routes,
  scrollBehavior = defaultScrollBehavior,
} = {}) {
  return createRouterFn({
    scrollBehavior,
    history: createHistoryFn(baseUrl),
    routes: appRoutes,
  })
}

export function registerAppRouteGuard(
  routerInstance,
  {
    createGuard = createRouteGuard,
    routeNames = publicRouteNames,
    getUserStore = () => useUserStore(),
    hasLoggedInSessionFn = hasLoggedInSession,
    hasPermissionFn = hasPermission,
    showNoPermissionMessage = () => ElMessage.error('您无此页面的权限哟'),
    scheduleAutoJumpFn = scheduleAutoJump,
    noPermissionRedirectPath = appConfig.defaultRoute,
  } = {},
) {
  const guard = createGuard({
    publicRouteNames: routeNames,
    getUserStore,
    hasLoggedInSession: hasLoggedInSessionFn,
    hasPermission: hasPermissionFn,
    showNoPermissionMessage,
    scheduleAutoJump: () => scheduleAutoJumpFn(routerInstance),
    noPermissionRedirectPath,
  })

  routerInstance.beforeEach(guard)
  return guard
}

const router = createAppRouter()

registerAppRouteGuard(router)

export default router
