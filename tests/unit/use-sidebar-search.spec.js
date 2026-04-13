import { computed, nextTick, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')

  return {
    ...actual,
    useTemplateRef: vi.fn(() =>
      ref({
        focus: vi.fn(),
      }),
    ),
  }
})

import { useSidebarSearch } from '@/component/layout/sidebar/use-sidebar-search'

describe('use-sidebar-search', () => {
  it('shows the search panel, focuses the input and computes keyword matches', async () => {
    const navigate = vi.fn()
    const visible = ref(true)
    const sidebarList = computed(() => [
      {
        title: '系统管理',
        children: [{ title: '用户列表', path: '/admin/user/list' }],
      },
    ])

    const sidebarSearch = useSidebarSearch({
      configEnabled: true,
      visible,
      sidebarList,
      navigate,
    })

    await sidebarSearch.openSearch()
    sidebarSearch.search('用户')

    expect(sidebarSearch.showSidebarSearch.value).toBe(true)
    expect(sidebarSearch.showSearchList.value).toBe(true)
    expect(sidebarSearch.groups.value).toEqual([
      { key: '/admin/user/list-用户列表', path: '/admin/user/list', title: '用户列表' },
    ])
  })

  it('resets state when hidden and navigates on selection', async () => {
    const navigate = vi.fn()
    const visible = ref(true)
    const sidebarList = computed(() => [
      {
        title: '系统管理',
        children: [{ title: '用户列表', path: '/admin/user/list' }],
      },
    ])

    const sidebarSearch = useSidebarSearch({
      configEnabled: true,
      visible,
      sidebarList,
      navigate,
    })

    sidebarSearch.sidebar.value = '/about'
    sidebarSearch.groups.value = [{ path: '/about', title: '关于' }]
    sidebarSearch.showSearchList.value = true

    sidebarSearch.handleChange('/about')
    expect(navigate).toHaveBeenCalledWith('/about')
    expect(sidebarSearch.sidebar.value).toBe('')
    expect(sidebarSearch.groups.value).toEqual([])
    expect(sidebarSearch.showSearchList.value).toBe(false)

    sidebarSearch.showSearchList.value = true
    visible.value = false
    await nextTick()

    expect(sidebarSearch.showSidebarSearch.value).toBe(false)
    expect(sidebarSearch.showSearchList.value).toBe(false)
  })

  it('hides the search contract when there are no sidebar items', () => {
    const sidebarSearch = useSidebarSearch({
      configEnabled: true,
      visible: () => true,
      sidebarList: () => [],
      navigate: vi.fn(),
    })

    expect(sidebarSearch.showSidebarSearch.value).toBe(false)
  })

  it('always searches against the latest sidebar source', () => {
    const navigate = vi.fn()
    const currentSidebarList = ref([
      {
        title: '系统管理',
        children: [{ title: '用户列表', path: '/admin/user/list' }],
      },
    ])

    const sidebarSearch = useSidebarSearch({
      configEnabled: true,
      visible: () => true,
      sidebarList: () => currentSidebarList.value,
      navigate,
    })

    sidebarSearch.search('用户')
    expect(sidebarSearch.groups.value).toEqual([
      { key: '/admin/user/list-用户列表', path: '/admin/user/list', title: '用户列表' },
    ])

    currentSidebarList.value = [
      {
        title: '内容管理',
        children: [{ title: '图书列表', path: '/book/list' }],
      },
    ]

    sidebarSearch.search('图书')
    expect(sidebarSearch.groups.value).toEqual([{ key: '/book/list-图书列表', path: '/book/list', title: '图书列表' }])
  })
})
