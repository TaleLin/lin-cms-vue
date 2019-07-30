const skuRouter = {
  route: null,
  name: null,
  title: 'SKU管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-tushuguanli',
  filePath: 'views/sku/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: 'SKU列表',
      type: 'view',
      name: 'spuList',
      route: '/sku/list',
      filePath: 'views/sku/SkuList.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    },
  ],
}

export default skuRouter
