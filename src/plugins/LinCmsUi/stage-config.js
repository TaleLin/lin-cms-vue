const LinCmsUiRouter = {
  route: null,
  name: null,
  title: 'UI',
  type: 'folder',
  icon: 'iconfont icon-demo',
  filePath: 'views/LinCmsUi/',
  order: null,
  inNav: true,
  children: [
    {
      title: 'Button 按钮',
      type: 'view',
      name: 'LinCmsUiStage1',
      route: '/lin-cms-ui/button',
      filePath: 'plugins/LinCmsUi/views/Button.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      right: null,
    },
  ],
}

export default LinCmsUiRouter
