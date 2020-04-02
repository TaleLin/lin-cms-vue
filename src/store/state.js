import stageConfig from '@/config/stage' // 引入舞台配置
import AppConfig from '@/config/index' // 引入项目配置

export default {
  logined: false, // 是否登录
  user: {}, // 当前用户
  sideBarLevel: AppConfig.sideBarLevel || 3,
  defaultRoute: AppConfig.defaultRoute || '/about',
  // 推送消息
  readedMessages: [],
  unreadMessages: [],
  permissions: [], // 每个用户的所有权限

  // 舞台配置
  stageConfig,
  // 当前页信息
  currentRoute: {
    config: null,
    treePath: [],
  },
}
