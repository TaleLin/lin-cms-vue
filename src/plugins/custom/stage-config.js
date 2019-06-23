const CustomRouter = {
  route: null,
  name: null,
  title: '自定义组件',
  type: 'folder',
  icon: 'iconfont icon-zidingyi',
  filePath: 'views/custom/',
  order: null,
  inNav: true,
  children: [
    {
      title: '图像上传展示',
      type: 'view',
      name: 'ImgsUploadDemo',
      route: '/imgs-upload/stage1',
      filePath: 'plugins/custom/views/Demo.vue',
      inNav: true,
      icon: 'iconfont icon-zidingyi',
      right: null,
    },
    {
      title: 'gallery 画廊',
      type: 'view',
      name: 'GalleryDemo',
      route: '/custom/gallery',
      filePath: 'plugins/custom/views/Gallery.vue',
      inNav: true,
      icon: 'iconfont icon-zidingyi',
      right: null,
    },
  ],
}

export default CustomRouter
