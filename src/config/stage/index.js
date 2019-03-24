import adminConfig from './admin'
import bookConfig from './book' // 引入图书管理路由文件
import pluginsConfig from './plugins'
import Utils from '@/lin/utils/util'

// eslint-disable-next-line import/no-mutable-exports
let homeRouter = [
  {
    title: '林间有风',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'views/about/About.vue',
    inNav: true,
    icon: 'iconfont icon-iconset0103',
    order: 0,
  },
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'views/log/Log.vue',
    inNav: true,
    icon: 'iconfont icon-rizhiguanli',
    order: 1,
    right: ['查询所有日志'],
  },
  bookConfig,
  adminConfig,
  ...pluginsConfig,
]

// TODO: 插入插件的配置内容
// Object.keys(pluginsConfig).forEach((plugin) => {
//   homeRouter.push(pluginsConfig[plugin])
// })

// 处理顺序
homeRouter = Utils.sortByOrder(homeRouter)

// 使用 Symbol 处理 name 字段, 保证唯一性
const deepReduceName = (target) => {
  if (Array.isArray(target)) {
    target.forEach((item) => {
      if (typeof item !== 'object') {
        return
      }
      deepReduceName(item)
    })
    return
  }
  if (typeof target === 'object') {
    if (typeof target.name !== 'symbol') {
      // eslint-disable-next-line no-param-reassign
      target.name = target.name || Utils.getRandomStr()
      // eslint-disable-next-line no-param-reassign
      target.name = Symbol(target.name)
    }

    if (Array.isArray(target.children)) {
      target.children.forEach((item) => {
        if (typeof item !== 'object') {
          return
        }
        deepReduceName(item)
      })
    }
  }
}

deepReduceName(homeRouter)

export default homeRouter
