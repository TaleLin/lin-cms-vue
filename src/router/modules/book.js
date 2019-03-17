const bookRouter = {
  route: null,
  name: null,
  title: '图书管理',
  type: 'folder',
  icon: 'iconfont icon-demo',
  filePath: 'views/book/',
  order: null,
  inNav: true,
  auths: {
    role: null,
    right: null,
  },
  children: [
    {
      title: '添加图书',
      type: 'view',
      name: 'bookAdd',
      route: '/book/add',
      filePath: 'views/book/BookAdd.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      auths: {
        role: null,
        right: null,
      },
    },
    {
      title: '图书列表',
      type: 'view',
      name: 'bookList',
      route: '/book/list',
      filePath: 'views/book/BookList.vue',
      inNav: true,
      icon: 'iconfont icon-demo',
      auths: {
        role: null,
        right: null,
      },
    },
  ],
}

export default bookRouter
