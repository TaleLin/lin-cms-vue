// import plugins from '@/plugins/configs.json'
// import poemsRouter from '@/plugins/poem/router.js'

import adminRouter from './modules/admin'
import bookRouter from './modules/book' // 引入图书管理路由文件
import pluginViewConfig from '../plugins/configs.json'

const About = () => import('@/views/about/About')
const Log = () => import('@/views/log/Log')

const homeRouter = [
  {
    path: '/about',
    name: 'about',
    component: About,
    meta: {
      title: '林间有风',
      icon: 'iconfont icon-iconset0103',
    },
  },
  {
    path: '/log',
    name: 'log',
    component: Log,
    meta: {
      title: '日志管理',
      icon: 'iconfont icon-rizhiguanli',
      auths: ['查询所有日志'],
    },
  },
  bookRouter, // 插入路由树
  adminRouter,
  // poemsRouter,
]

function foramtViewConfig(view) {
  return {
    path: view.path,
    name: view.name,
    component: () => import(`@/${view.filePath}`),
    meta: {
      title: view.title,
      icon: view.icon,
    },
  }
}

function deepAddViewRoute(obj) {
  if (obj.type === 'directory') {
    obj.children.forEach((item) => {
      deepAddViewRoute(item)
    })
  } else if (obj.type === 'view') {
    // console.log(obj.name)
    homeRouter.push(foramtViewConfig(obj))
  }
}
Object.keys(pluginViewConfig || {}).forEach((plugin) => {
  deepAddViewRoute(pluginViewConfig[plugin])
})
// console.log(homeRouter)

// addPlugins()
export default homeRouter
// @/plugins/poem/router.js
// @/plugins/poem/router.js
