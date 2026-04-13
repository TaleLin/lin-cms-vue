import adminConfig from './admin'
import bookConfig from './book'
import pluginsConfig from './plugin'
import { createStageConfig } from './stage-helpers'

const baseStages = [
  {
    title: '林间有风',
    type: 'view',
    name: Symbol('about'),
    route: '/about',
    filePath: 'view/about/about.vue',
    inNav: true,
    icon: 'House',
    order: 1,
  },
  {
    title: '日志管理',
    type: 'view',
    name: Symbol('log'),
    route: '/log',
    filePath: 'view/log/log.vue',
    inNav: true,
    icon: 'Memo',
    order: 2,
    permission: ['查询日志', '查询所有日志'],
  },
  {
    title: '个人中心',
    type: 'view',
    name: Symbol('center'),
    route: '/center',
    filePath: 'view/center/center.vue',
    inNav: false,
    icon: 'User',
  },
  {
    title: '404',
    type: 'view',
    name: Symbol('404'),
    route: '/404',
    filePath: 'view/error-page/404.vue',
    inNav: false,
    icon: 'Failed',
  },
  bookConfig,
  adminConfig,
]

const stageConfig = createStageConfig({
  baseStages,
  pluginStages: pluginsConfig,
})

export default stageConfig
