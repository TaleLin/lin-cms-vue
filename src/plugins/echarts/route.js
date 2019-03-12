const Echarts = () => import('./views/Bar')

const echartsRouter = {
  path: '/echarts',
  component: Echarts,
  meta: {
    title: '图表',
    icon: 'iconfont icon-schedule2',
  },
}

export default echartsRouter
