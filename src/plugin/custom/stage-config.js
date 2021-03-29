const CustomRouter = {
  route: null,
  name: null,
  title: '自定义组件',
  type: 'folder',
  icon: 'iconfont icon-zidingyi',
  filePath: 'view/custom/',
  order: null,
  inNav: true,
  children: [
    {
      title: 'upload 图像上传',
      type: 'view',
      name: 'ImgsUploadDemo',
      route: '/custom/upload-image',
      filePath: 'plugin/custom/view/upload-image.vue',
      inNav: true,
      icon: 'iconfont icon-upload',
      permission: null,
    },
    {
      title: 'editor 富文本',
      type: 'view',
      name: 'Tinymce',
      route: '/custom/tinymce',
      filePath: 'plugin/custom/view/tinymce.vue',
      inNav: true,
      icon: 'iconfont icon-fuwenbenbianjiqi_gongshi',
      permission: null,
    },
    {
      title: 'multiple 多重输入',
      type: 'view',
      name: 'Multiple',
      route: '/custom/multiple',
      filePath: 'plugin/custom/view/multiple-input.vue',
      inNav: true,
      icon: 'iconfont icon-multiple_inputs',
      permission: null,
    },
  ],
}

export default CustomRouter
