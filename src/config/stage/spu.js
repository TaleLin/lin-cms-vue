const spuRouter = {
  route: null,
  name: null,
  title: 'SPU管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/spu/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: 'SPU列表',
      type: 'view',
      name: 'spuList',
      route: '/spu/list',
      filePath: 'views/spu/SpuList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default spuRouter
