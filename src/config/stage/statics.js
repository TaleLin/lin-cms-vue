const staticsRouter = {
  route: null,
  name: null,
  title: 'C端数据',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/statics/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '订单列表',
      type: 'view',
      name: 'orderList',
      route: '/statics/order/list',
      filePath: 'views/statics/OrderList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: 'C端用户列表',
      type: 'view',
      name: 'thirdUserList',
      route: '/statics/third_user/list',
      filePath: 'views/statics/ThirdUserList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default staticsRouter
