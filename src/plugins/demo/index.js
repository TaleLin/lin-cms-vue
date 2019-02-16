const Poem = () => import('./views/Poem')

const poetryRouter = {
  path: '/poems',
  component: Poem,
  meta: {
    title: '唐诗宋词',
    // menuTab: true,
    icon: 'iconfont icon-demo',
  },
}

export default poetryRouter
