const categoryRouter = {
  route: null,
  name: null,
  title: '分类管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/category/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '分类列表',
      type: 'view',
      name: 'categoryList',
      route: '/category/list',
      filePath: 'views/category/CategoryList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default categoryRouter
