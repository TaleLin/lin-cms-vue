import adminConfig from './admin'
import bookConfig from './book' // 引入图书管理路由文件
// TODO: 添加对插件配置的处理
import pluginsConfig from '@/plugins/configs.json'

const homeRouter = [
  {
    title: '林间有风',
    type: 'view',
    name: 'about',
    route: '/about',
    filePath: 'views/about/About.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 0,
    auths: {
      role: null,
      right: null,
    },
  }, {
    title: '日志管理',
    type: 'view',
    name: 'log',
    route: '/log',
    filePath: 'views/log/Log.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 1,
    auths: {
      role: null,
      right: ['查询所有日志'],
    },
  },
  bookConfig,
  adminConfig,
]

// 插入插件的配置内容
Object.keys(pluginsConfig).forEach((plugin) => {
  homeRouter.push(pluginsConfig[plugin])
})

// 处理顺序
homeRouter.sort((a, b) => {
  if (typeof a.order === 'number' && typeof b.order === 'number') {
    return (a.order - b.order)
  }
  if (typeof a.order === 'number') {
    return -1
  }
  if (typeof b.order === 'number') {
    return 1
  }
  return 0
})

export default homeRouter
