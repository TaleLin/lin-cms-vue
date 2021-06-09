const Config = {
  sidebarLevel: 3, // 侧边栏层级（无限级）限制, 默认为 3 级，可根据需求自行扩充
  openAutoJumpOut: true, // 是否开启无操作跳出
  defaultRoute: '/about', // 默认打开的路由
  websocketEnable: false, // 默认关闭 websocket
  showSidebarSearch: true, // 默认打开侧边栏搜索
  notLoginRoute: ['login'], // 无需登录即可访问的路由 name,
  useFrontEndErrorMsg: false, // 默认采用后端返回异常
  stagnateTime: 60 * 60 * 1000, // 无操作停滞时间，默认1小时
  baseURL: process.env.VUE_APP_BASE_URL, // API接口baseURL，在根目录.env文件查找对应环境变量配置
}

export default Config
