const bannerRouter = {
  route: null,
  name: null,
  title: 'Banner管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/banner/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: 'Banner列表',
      type: 'view',
      name: 'bannerList',
      route: '/banner/add',
      filePath: 'views/banner/BannerList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
    {
      title: 'Banner详情',
      type: 'view',
      name: 'bannerWithItems',
      route: '/banner/:id',
      filePath: 'views/banner/BannerWithItems.vue',
      // inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default bannerRouter
