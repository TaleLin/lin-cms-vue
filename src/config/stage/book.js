const bookRouter = {
  route: null,
  name: null,
  title: '图书管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'Reading',
  filePath: 'view/book/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '图书列表',
      type: 'view',
      name: 'BookList',
      route: '/book/list',
      filePath: 'view/book/book-list.vue',
      inNav: true,
      icon: 'Reading',
    },
    {
      title: '添加图书',
      type: 'view',
      name: 'BookCreate',
      route: '/book/add',
      filePath: 'view/book/book.vue',
      inNav: true,
      icon: 'Plus',
    },
  ],
}

export default bookRouter
