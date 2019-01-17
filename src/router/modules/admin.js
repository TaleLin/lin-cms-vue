const User = () => import('@/views/admin/user/User')
const UserList = () => import('@/views/admin/user/UserList/')
const UserAdd = () => import('@/views/admin/user/UserAdd')

const Group = () => import('@/views/admin/group/Group')
const GroupList = () => import('@/views/admin/group/GroupList')
const GroupAdd = () => import('@/views/admin/group/GroupAdd')

const Admin = () => import('@/views/admin/Admin')

const adminRouter = {
  path: '/admin',
  name: 'admin',
  component: Admin,
  meta: {
    title: '权限管理',
    icon: 'iconfont icon-huiyuanguanli',
  },
  children: [
    {
      path: '/admin/user',
      name: 'user',
      component: User,
      meta: {
        title: '用户管理',
      },
      children: [
        {
          path: '/admin/user/list',
          component: UserList,
          meta: {
            title: '用户列表',
            icon: 'iconfont icon-huiyuanguanli',
            auths: ['超级管理员独有权限'],
          },
        },
        {
          path: '/admin/user/add',
          component: UserAdd,
          meta: {
            title: '添加用户',
            icon: 'iconfont icon-add',
            auths: ['超级管理员独有权限'],
          },
        },
      ],
    },
    {
      path: '/admin/group',
      name: 'group',
      component: Group,
      meta: {
        title: '分组管理',
      },
      children: [
        {
          path: '/admin/group/list',
          component: GroupList,
          meta: {
            title: '分组列表',
            icon: 'iconfont icon-huiyuanguanli',
            auths: ['超级管理员独有权限'],
          },
        },
        {
          path: '/admin/group/add',
          component: GroupAdd,
          meta: {
            title: '添加分组',
            icon: 'iconfont icon-add',
            auths: ['超级管理员独有权限'],
          },
        },
      ],
    },
  ],
}

export default adminRouter
