const Poetry = () => import('./views/Poetry')

const poetryRouter = {
  path: '/poetry',
  component: Poetry,
  meta: {
    title: '优雅唐诗',
    // menuTab: true,
    icon: 'iconfont icon-demo',
  },
}

export default poetryRouter
