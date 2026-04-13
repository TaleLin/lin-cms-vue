import { describe, expect, it, vi } from 'vitest'

import {
  createSidebarList,
  createStageMap,
  filterAuthorizedStages,
  findStageBranch,
  findStageByRoutePath,
  mergeUserSnapshot,
} from '@/store/modules/user-helpers'

describe('user helpers', () => {
  it('builds a stage map and resolves routes from named stages', () => {
    const stages = [
      {
        name: 'admin',
        title: '系统管理',
        children: [
          { name: 'userList', title: '用户列表', route: '/admin/user/list' },
          { name: 'groupList', title: '分组列表', route: '/admin/group/list' },
        ],
      },
    ]

    const stageMap = createStageMap(stages)

    expect(stageMap.userList.title).toBe('用户列表')
    expect(findStageByRoutePath(stageMap, '/admin/group/list')).toEqual({
      name: 'groupList',
      title: '分组列表',
      route: '/admin/group/list',
    })
  })

  it('builds sidebar data from staged routes without mutating route selection rules', () => {
    const stages = [
      {
        name: 'root',
        title: '根目录',
        type: 'folder',
        inNav: true,
        children: [
          {
            name: 'userTab',
            title: '用户管理',
            type: 'tab',
            inNav: true,
            icon: 'User',
            children: [{ route: '/admin/user/list' }],
          },
        ],
      },
    ]

    expect(createSidebarList(stages, 3, () => 'folder-key')).toEqual([
      {
        name: 'root',
        title: '根目录',
        icon: undefined,
        isElementIcon: undefined,
        path: 'folder-key',
        children: [
          {
            name: 'userTab',
            title: '用户管理',
            icon: 'User',
            isElementIcon: undefined,
            path: '/admin/user/list',
          },
        ],
      },
    ])
  })

  it('filters routes by permission without mutating the original stage tree', () => {
    const stages = [
      {
        name: 'admin',
        title: '系统管理',
        auth: 'admin',
        children: [
          { name: 'userList', title: '用户列表', route: '/admin/user/list', auth: 'user:list' },
          { name: 'groupList', title: '分组列表', route: '/admin/group/list', auth: 'group:list' },
        ],
      },
    ]

    const permissionChecker = vi.fn((permissions, route) => {
      return permissions.includes(route.auth)
    })

    const filtered = filterAuthorizedStages(stages, ['admin', 'group:list'], {}, permissionChecker)

    expect(filtered).toEqual([
      {
        name: 'admin',
        title: '系统管理',
        auth: 'admin',
        children: [{ name: 'groupList', title: '分组列表', route: '/admin/group/list', auth: 'group:list' }],
      },
    ])
    expect(stages[0].children).toHaveLength(2)
  })

  it('finds the ancestor branch for a named stage', () => {
    const stages = [
      {
        name: 'admin',
        title: '系统管理',
        children: [
          { name: 'userList', title: '用户列表', route: '/admin/user/list' },
          { name: 'groupList', title: '分组列表', route: '/admin/group/list' },
        ],
      },
    ]

    expect(findStageBranch(stages, 'groupList')).toEqual([stages[0], stages[0].children[1]])
  })

  it('merges persisted user state with the latest payload without mutating either side', () => {
    const currentUser = {
      id: 7,
      nickname: '旧昵称',
      roles: ['reader'],
    }
    const nextUser = {
      nickname: '新昵称',
      permissions: ['book:create'],
    }

    expect(mergeUserSnapshot(currentUser, nextUser)).toEqual({
      id: 7,
      nickname: '新昵称',
      roles: ['reader'],
      permissions: ['book:create'],
    })
    expect(currentUser).toEqual({
      id: 7,
      nickname: '旧昵称',
      roles: ['reader'],
    })
    expect(nextUser).toEqual({
      nickname: '新昵称',
      permissions: ['book:create'],
    })
  })
})
