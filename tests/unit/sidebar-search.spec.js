import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const routerPush = vi.fn()
const navigate = routerPush

import SidebarSearch from '@/component/layout/sidebar/search.vue'

describe('sidebar search', () => {
  it('hides the search shell when there are no sidebar items', () => {
    const wrapper = mount(SidebarSearch, {
      props: {
        navigate,
        visible: true,
        sidebarList: [],
      },
      global: {
        stubs: {
          ElIcon: true,
          ElSelect: true,
          ElOption: true,
        },
      },
    })

    expect(wrapper.find('.search-wrap').exists()).toBe(false)
  })

  it('derives visibility from an explicit prop and resets open state when hidden', async () => {
    const wrapper = mount(SidebarSearch, {
      props: {
        navigate,
        visible: true,
        sidebarList: [
          {
            title: '系统管理',
            children: [{ title: '用户列表', path: '/admin/user/list' }],
          },
        ],
      },
      global: {
        stubs: {
          ElIcon: true,
          ElSelect: true,
          ElOption: true,
        },
      },
    })

    expect(wrapper.find('.search-wrap').exists()).toBe(true)
    expect(wrapper.find('.search-display').exists()).toBe(true)

    await wrapper.get('.search-display').trigger('click')
    expect(wrapper.find('el-select-stub').exists()).toBe(true)

    await wrapper.setProps({
      visible: false,
    })

    expect(wrapper.find('.search-wrap').exists()).toBe(false)
  })

  it('navigates to the selected sidebar path and resets the visible search input', async () => {
    const wrapper = mount(SidebarSearch, {
      props: {
        navigate,
        visible: true,
        sidebarList: [
          {
            title: '系统管理',
            children: [{ title: '用户列表', path: '/admin/user/list' }],
          },
        ],
      },
      global: {
        stubs: {
          ElIcon: true,
          ElOption: true,
          ElSelect: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    await wrapper.get('.search-display').trigger('click')
    await wrapper.vm.search('用户')
    expect(wrapper.vm.groups).toEqual([
      { key: '/admin/user/list-用户列表', path: '/admin/user/list', title: '用户列表' },
    ])

    await wrapper.vm.handleChange('/about')

    expect(routerPush).toHaveBeenCalledWith('/about')
    expect(wrapper.vm.showSearchList).toBe(false)
    expect(wrapper.vm.sidebar).toBe('')
    expect(wrapper.vm.groups).toEqual([])
  })
})
