const Course = () => import('./views/Course')

const imoocRouter = {
  path: '/course',
  name: 'course',
  component: Course,
  meta: {
    title: '慕课课程',
    icon: 'iconfont icon-kecheng',
    blueBaseColor: true,
  },
}

export default imoocRouter
