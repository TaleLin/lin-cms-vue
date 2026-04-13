import { describe, expect, it } from 'vitest'

import {
  getSidebarSearchGroups,
  hasSidebarItems,
  resolveSidebarMenuCollapse,
  shouldShowSidebarSearch,
} from '@/component/layout/sidebar/sidebar-helpers'

describe('sidebar helpers', () => {
  it('keeps sidebar expanded on phone and follows collapse state on desktop', () => {
    expect(
      resolveSidebarMenuCollapse({
        isPhone: true,
        isCollapse: true,
      }),
    ).toBe(false)

    expect(
      resolveSidebarMenuCollapse({
        isPhone: false,
        isCollapse: true,
      }),
    ).toBe(true)
  })

  it('derives sidebar search groups from the sidebar list', () => {
    const sidebarList = [
      {
        title: '系统管理',
        children: [
          { title: '用户列表', path: '/admin/user/list' },
          { title: '分组列表', path: '/admin/group/list' },
        ],
      },
    ]

    expect(getSidebarSearchGroups(sidebarList, '用户')).toEqual([
      { key: '/admin/user/list-用户列表', path: '/admin/user/list', title: '用户列表' },
    ])
  })

  it('only shows sidebar search when the sidebar actually has menu items', () => {
    expect(hasSidebarItems([])).toBe(false)
    expect(hasSidebarItems([{ path: '/about', title: '关于' }])).toBe(true)

    expect(
      shouldShowSidebarSearch({
        configEnabled: true,
        visible: true,
        sidebarList: [],
      }),
    ).toBe(false)

    expect(
      shouldShowSidebarSearch({
        configEnabled: true,
        visible: true,
        sidebarList: [{ path: '/about', title: '关于' }],
      }),
    ).toBe(true)
  })
})
