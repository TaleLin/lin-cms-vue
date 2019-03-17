import Home from '@/views/home/Home'

import homeRouter from './home-router'
// import pluginsRouter from './plugins'

const Login = () => import('@/views/login/Login')

// function deepAddViewRoute(obj, fuc) {
//   if (obj.children) {
//     obj.children.forEach((item) => {
//       deepAddViewRoute(item, fuc)
//     })
//   } else {
//     fuc(obj)
//   }
// }

// const homeRouter = []
// deepAddViewRoute(homeRouterConfig, (item) => {
//   const itemConfig = {
//     ...item,
//     component: () => import(`@/${item.component}`),
//   }
//   // console.log(item)
//   homeRouter.push(itemConfig)
// })

// const stageRouters = homeRouter.concat(pluginsRouter)
const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/about',
    component: Home,
    children: [
      ...homeRouter,
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
]

export default routes
