const LinCmsUiRouter = {
  route: null,
  name: null,
  title: 'lin-cms-ui',
  type: 'folder',
  icon: 'iconfont icon-jiemiansheji',
  filePath: 'views/LinCmsUi/',
  order: null,
  inNav: true,
  children: [
    {
      title: 'Button 按钮',
      type: 'view',
      name: 'LinCmsUiButton',
      route: '/lin-cms-ui/button',
      filePath: 'plugins/LinCmsUi/views/Button.vue',
      inNav: true,
      icon: 'iconfont icon-jiemiansheji',
      right: null,
    },
    {
      title: 'Table 表格',
      type: 'view',
      name: 'LinCmsUiTable',
      route: '/lin-cms-ui/table',
      filePath: 'plugins/LinCmsUi/views/Table.vue',
      inNav: true,
      icon: 'iconfont icon-jiemiansheji',
      right: null,
    },
  ],
}

export default LinCmsUiRouter
