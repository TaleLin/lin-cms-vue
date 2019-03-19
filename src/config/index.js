const Config = {
  baseUrl: 'http://cms.lin.7yue.pro/',
  stagnateTime: 1 * 60 * 60 * 1000, // 无操作停滞时间  默认1小时
  openAutoJumpOut: false, // 是否开启无操作跳出
  notLoginRoute: ['login'], // 无需登录即可访问的路由 name
}

export default Config
