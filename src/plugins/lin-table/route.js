const Table = () => import('./views/Table')
const TableRowHid = () => import('./views/TableRowHid.vue')

const tableRouter = {
  path: '/table',
  component: Table,
  meta: {
    title: 'table',
    icon: 'iconfont icon-table1',
  },
  children: [
    {
      path: '/table/row-tip',
      component: TableRowHid,
      meta: {
        title: '单列超出隐藏',
      },
    },
  ],
}

export default tableRouter
