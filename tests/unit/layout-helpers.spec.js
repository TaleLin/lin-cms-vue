import { describe, expect, it } from 'vitest'

import {
  findSidebarMatches,
  getAsideStyle,
  getBreadcrumbItems,
  getBreadcrumbTitles,
  getInitialSidebarState,
  getLayoutIconSource,
  getMenuTabs,
  getSidebarWidth,
  getViewportState,
  isImageIcon,
  shouldUseImageIcon,
} from '@/component/layout/layout-helpers'

describe('layout helpers', () => {
  it('detects whether an icon is an image path', () => {
    expect(isImageIcon('/icons/demo.png')).toBe(true)
    expect(isImageIcon('House')).toBe(false)
    expect(isImageIcon(null)).toBe(false)
    expect(getLayoutIconSource('/icons/demo.png')).toBe('/icons/demo.png')
    expect(getLayoutIconSource(null)).toBe('')
    expect(shouldUseImageIcon('/icons/demo.png')).toBe(true)
    expect(shouldUseImageIcon('House')).toBe(false)
  })

  it('finds matching sidebar leaf routes', () => {
    const sidebarList = [
      {
        title: '系统管理',
        children: [
          { title: '用户列表', path: '/admin/user/list' },
          { title: '分组列表', path: '/admin/group/list' },
        ],
      },
    ]

    expect(findSidebarMatches(sidebarList, '用户')).toEqual([
      { key: '/admin/user/list-用户列表', path: '/admin/user/list', title: '用户列表' },
    ])
  })

  it('builds breadcrumb titles and tab menus from stage info', () => {
    const stageInfo = [
      { title: '权限管理', type: 'folder', name: 'admin' },
      {
        title: '分组管理',
        type: 'tab',
        route: '/admin/group',
        children: [
          { inNav: true, icon: 'Collection', title: '分组列表', route: '/admin/group/list' },
          { inNav: false, icon: 'Memo', title: '隐藏页', route: '/hidden' },
        ],
      },
      { title: '分组列表', type: 'view', route: '/admin/group/list' },
    ]

    expect(getBreadcrumbTitles(stageInfo)).toEqual(['权限管理', '分组管理', '分组列表'])
    expect(getBreadcrumbItems(stageInfo)).toEqual([
      { key: 'admin', title: '权限管理' },
      { key: 'admin > /admin/group', title: '分组管理' },
      { key: 'admin > /admin/group > /admin/group/list', title: '分组列表' },
    ])
    expect(getMenuTabs(stageInfo)).toEqual([{ icon: 'Collection', title: '分组列表', path: '/admin/group/list' }])
  })

  it('builds layout state for desktop and phone modes', () => {
    expect(getViewportState(480, 900)).toEqual({
      clientWidth: 480,
      clientHeight: 900,
      isPhone: true,
    })

    expect(getInitialSidebarState(768)).toEqual({
      isCollapse: true,
      shouldShowSearch: false,
    })

    expect(getInitialSidebarState(1024)).toEqual({
      isCollapse: false,
      shouldShowSearch: true,
    })
  })

  it('computes sidebar width and phone aside style', () => {
    expect(
      getAsideStyle({
        isPhone: true,
        isCollapse: false,
        clientHeight: 800,
        expandedWidth: '210px',
      }),
    ).toEqual({
      position: 'absolute',
      height: '800px',
      zIndex: 12,
      transform: 'translateX(-210px)',
    })

    expect(
      getSidebarWidth({
        isPhone: true,
        isCollapse: true,
        expandedWidth: '210px',
        collapsedWidth: '64px',
      }),
    ).toBe('210px')

    expect(
      getSidebarWidth({
        isPhone: false,
        isCollapse: true,
        expandedWidth: '210px',
        collapsedWidth: '64px',
      }),
    ).toBe('64px')
  })
})
