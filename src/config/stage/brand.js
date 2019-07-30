const brandRouter = {
  route: null,
  name: null,
  title: '品牌管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/brand/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '品牌列表',
      type: 'view',
      name: 'bannerList',
      route: '/brand/list',
      filePath: 'views/brand/BrandList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default brandRouter
