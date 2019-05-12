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
      title: 'Icon 图标',
      type: 'view',
      name: null,
      route: '/lin-cms-ui/icon',
      filePath: 'plugins/LinCmsUi/views/icon/Icon.vue',
      inNav: true,
      icon: 'iconfont icon-jiemiansheji',
      right: null,
    },
    {
      title: 'Table 表格',
      type: 'folder',
      name: null,
      route: '/lin-cms-ui/table',
      filePath: 'plugins/LinCmsUi/views/table/',
      inNav: true,
      icon: 'iconfont icon-jiemiansheji',
      right: null,
      children: [
        {
          title: '基础示例',
          type: 'view',
          name: null,
          route: '/lin-cms-ui/table/base',
          filePath: 'plugins/LinCmsUi/views/table/Table.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
        {
          title: '组合示例',
          type: 'view',
          name: null,
          route: '/lin-cms-ui/table/combo',
          filePath: 'plugins/LinCmsUi/views/table/TableCombo.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
      ],
    },
    {
      title: 'Form 表单 ',
      type: 'folder',
      name: null,
      route: '/lin-cms-ui/form/base',
      filePath: 'plugins/LinCmsUi/views/form/',
      inNav: true,
      icon: 'iconfont icon-jiemiansheji',
      right: null,
      children: [
        {
          title: 'Input',
          type: 'view',
          name: null,
          route: '/lin-cms-ui/form/input',
          filePath: 'plugins/LinCmsUi/views/form/Input.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
        {
          title: 'Radio',
          type: 'view',
          name: null,
          route: '/lin-cms-ui/form/radio',
          filePath: 'plugins/LinCmsUi/views/form/Radio.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
        {
          title: 'Checkbox',
          type: 'view',
          name: null,
          route: '/lin-cms-ui/form/checkbox',
          filePath: 'plugins/LinCmsUi/views/form/Checkbox.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
        {
          title: 'Select',
          type: 'view',
          name: null,
          route: '/lin-cms-ui/form/select',
          filePath: 'plugins/LinCmsUi/views/form/Select.vue',
          inNav: true,
          icon: 'iconfont icon-jiemiansheji',

        },
      ],
    },
  ],
}

export default LinCmsUiRouter
