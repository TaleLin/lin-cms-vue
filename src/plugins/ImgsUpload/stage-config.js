const ImgsUploadRouter = {
  route: null,
  name: null,
  title: '图像上传',
  type: 'folder',
  icon: 'iconfont icon-demo',
  filePath: 'views/ImgsUpload/',
  order: null,
  inNav: true,
  children: [
    {
      title: '图像上传展示',
      type: 'view',
      name: 'ImgsUploadDemo',
      route: '/imgs-upload/stage1',
      filePath: 'plugins/ImgsUpload/views/Demo.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      right: null,
    },
  ],
}

export default ImgsUploadRouter
