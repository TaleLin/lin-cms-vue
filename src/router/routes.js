import Home from '@/views/home/Home'

import homeRouter from './home-router'
import pluginsRouter from './plugins'

const Login = () => import('@/views/login/Login')
const stageRouters = homeRouter.concat(pluginsRouter)
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/about',
    component: Home,
    children: [
      ...stageRouters,
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
]

export default routes
