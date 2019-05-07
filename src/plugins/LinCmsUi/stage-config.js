const LinCmsUiRouter = {
  route: null,
  name: null,
  title: 'UI',
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
      filePath: 'plugins/LinCmsUi/views/button/Button.vue',
      inNav: true,
      icon: 'iconfont icon-jiemiansheji',
      right: null,
    },
    {
      title: 'Table 表格',
      type: 'folder',
      name: null,
      route: '/lin-cms-ui/table/base',
      filePath: 'plugins/LinCmsUi/views/table/',
      inNav: true,
      icon: 'iconfont icon-jiemiansheji',
      right: null,
      children: [
        {
          title: '基础示例',
          type: 'view',
          name: 'LinCmsUiButtonbase',
          route: '/lin-cms-ui/table/base',
          filePath: 'plugins/LinCmsUi/views/table/Table.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
        {
          title: '组合示例',
          type: 'view',
          name: 'LinCmsUiButtonCombo',
          route: '/lin-cms-ui/table/combo',
          filePath: 'plugins/LinCmsUi/views/table/TableCombo.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
      ],
    },
  ],
}

export default LinCmsUiRouter
