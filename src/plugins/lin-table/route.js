const Table = () => import('./views/Table')
const TableSample = () => import('./views/TableSample.vue')
const InlineEditTable = () => import('./views/InlineEditTable.vue')

const tableRouter = {
  path: '/table',
  component: Table,
  meta: {
    title: '列表示例',
    icon: 'iconfont icon-table1',
  },
  children: [
    {
      path: '/table/movie',
      component: TableSample,
      meta: {
        title: '列表示例',
        icon: 'iconfont icon-table1',
      },
    },
    {
      path: '/table/inline-edit-table',
      component: InlineEditTable,
      meta: {
        title: '行内编辑',
        icon: 'iconfont icon-table1',
      },
    },
  ],
}

export default tableRouter
