const Table = () => import('./views/Table')
const TableRowHid = () => import('./views/TableRowHid.vue')
const InlineEditTable = () => import('./views/InlineEditTable.vue')
const CustomRowTable = () => import('./views/CustomRowTable.vue')

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
    {
      path: '/table/inline-edit-table',
      component: InlineEditTable,
      meta: {
        title: '行内编辑',
      },
    },
    {
      path: '/table/custom-row-table',
      component: CustomRowTable,
      meta: {
        title: '定制列',
      },
    },
  ],
}

export default tableRouter
