// const Table = () => import('./views/Table')
const TableSample = () => import('./views/TableSample.vue')

const tableRouter = {
  path: '/table',
  component: TableSample,
  meta: {
    title: '表格示例',
    icon: 'iconfont icon-table1',
  },
}

export default tableRouter
