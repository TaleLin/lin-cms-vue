import appConfig from '@/config/index'
import homeRouter from './home-router'

export function createAppRoutes({
  homeRoutes = homeRouter,
  defaultRoute = appConfig.defaultRoute,
  rootComponent = () => import('@/view/home/home'),
  loginComponent = () => import('@/view/login/login'),
} = {}) {
  return [
    {
      path: '/',
      name: 'Home',
      redirect: defaultRoute,
      component: rootComponent,
      children: [...homeRoutes],
    },
    {
      path: '/login',
      name: 'login',
      component: loginComponent,
    },
    {
      redirect: '/404',
      path: '/:pathMatch(.*)',
    },
  ]
}

const routes = createAppRoutes()

export default routes
