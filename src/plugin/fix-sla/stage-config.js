const fixSlaRouter = {
  route: null,
  name: null,
  title: '插件标题',
  type: 'folder',
  icon: 'iconfont icon-demo',
  filePath: 'views/fix-sla/',
  order: null,
  inNav: true,
  children: [
    {
      title: '舞台页面',
      type: 'view',
      name: 'fix-slaStage1',
      route: '/fix-sla/stage1',
      filePath: 'plugin/fix-sla/view/stage1.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      right: null,
    },
    {
      title: '舞台页面',
      type: 'view',
      name: 'fix-slaStage2',
      route: '/fix-sla/stage2',
      filePath: 'plugin/fix-sla/view/stage2.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      right: null,
    },
  ],
}

export default fixSlaRouter
