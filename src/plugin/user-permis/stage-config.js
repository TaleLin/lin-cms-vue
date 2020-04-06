const userPermisRouter = {
  route: null,
  name: null,
  title: '插件标题',
  type: 'folder',
  icon: 'iconfont icon-demo',
  filePath: 'views/user-permis/',
  order: null,
  inNav: true,
  children: [
    {
      title: '舞台页面',
      type: 'view',
      name: 'user-permisStage1',
      route: '/user-permis/stage1',
      filePath: 'plugin/user-permis/view/stage1.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      right: null,
    },
    {
      title: '舞台页面',
      type: 'view',
      name: 'user-permisStage2',
      route: '/user-permis/stage2',
      filePath: 'plugin/user-permis/view/stage2.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      right: null,
    },
  ],
}

export default userPermisRouter
