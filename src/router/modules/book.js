const Book = () => import('@/views/book/Book')
const BookAdd = () => import('@/views/book/BookAdd')
const BookList = () => import('@/views/book/BookList')

const bookRouter = {
  path: '/book',
  component: Book,
  meta: {
    title: '图书管理',
    // menuTab: true,
    icon: 'iconfont icon-demo',
  },
  children: [
    {
      path: '/book/add',
      component: BookAdd,
      meta: {
        title: '添加图书',
        icon: 'iconfont icon-demo',
      },
    },
    {
      path: '/book/list',
      component: BookList,
      meta: {
        title: '图书列表',
        icon: 'iconfont icon-demo',
      },
    },
  ],
}

export default bookRouter
