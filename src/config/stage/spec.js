const specRouter = {
  route: null,
  name: null,
  title: '规格管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/spec/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '添加规格键',
      type: 'view',
      name: 'specKeyAdd',
      route: '/spec/key/add',
      filePath: 'views/spec/SpecKeyAdd.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    // {
    //   title: '添加规格值',
    //   type: 'view',
    //   name: 'specValueAdd',
    //   route: '/spec/value/add',
    //   filePath: 'views/spec/SpecValueAdd.vue',
    //   // inNav: true,
    //   icon: 'iconfont icon-tushuguanli',
    // },
    {
      title: '规格键列表',
      type: 'view',
      name: 'specKeyList',
      route: '/spec/key/list',
      filePath: 'views/spec/SpecKeyList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: '规格值详情',
      type: 'view',
      name: 'SpecKeyValue',
      route: '/spec/key/value/:id',
      filePath: 'views/spec/SpecKeyValue.vue',
      // inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default specRouter
