import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const navigate = vi.fn()

const LogoStub = defineComponent({
  name: 'SidebarLogo',
  props: {
    elMenuCollapse: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'logo-stub',
        'data-collapse': String(props.elMenuCollapse),
      })
  },
})

const SearchStub = defineComponent({
  name: 'SidebarSearch',
  props: {
    sidebarList: {
      type: Array,
      default: () => [],
    },
    navigate: {
      type: Function,
      required: true,
    },
    visible: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'search-stub',
        'data-sidebar-size': String(props.sidebarList.length),
        'data-has-navigate': String(Boolean(props.navigate)),
        'data-visible': String(props.visible),
      })
  },
})

const MenuTreeStub = defineComponent({
  name: 'MenuTree',
  props: {
    item: {
      type: Object,
      required: true,
    },
    navigate: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'menu-tree-stub',
        'data-has-navigate': String(Boolean(props.navigate)),
        'data-path': props.item.path,
      })
  },
})

const ElMenuStub = defineComponent({
  name: 'ElMenu',
  props: {
    collapse: {
      type: Boolean,
      default: false,
    },
    defaultActive: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'el-menu-stub',
          'data-collapse': String(props.collapse),
          'data-default-active': props.defaultActive,
        },
        slots.default?.(),
      )
  },
})

describe('sidebar', () => {
  it('passes collapse, active route and menu items to the sidebar shell', async () => {
    const Sidebar = (await import('@/component/layout/sidebar/sidebar.vue')).default
    const wrapper = mount(Sidebar, {
      props: {
        activePath: '/about',
        isPhone: false,
        isCollapse: true,
        navigate,
        showSearch: true,
        sidebarList: [
          { path: '/about', title: '关于' },
          { path: '/log', title: '日志' },
        ],
      },
      global: {
        stubs: {
          SidebarLogo: LogoStub,
          SidebarSearch: SearchStub,
          MenuTree: MenuTreeStub,
          ElMenu: ElMenuStub,
        },
      },
    })

    expect(wrapper.get('.logo-stub').attributes('data-collapse')).toBe('true')
    expect(wrapper.get('.search-stub').attributes('data-visible')).toBe('true')
    expect(wrapper.get('.search-stub').attributes('data-sidebar-size')).toBe('2')
    expect(wrapper.get('.search-stub').attributes('data-has-navigate')).toBe('true')
    expect(wrapper.get('.el-menu-stub').attributes('data-collapse')).toBe('true')
    expect(wrapper.get('.el-menu-stub').attributes('data-default-active')).toBe('/about')
    expect(wrapper.findAll('.menu-tree-stub')).toHaveLength(2)
    expect(wrapper.findAll('.menu-tree-stub').every(node => node.attributes('data-has-navigate') === 'true')).toBe(true)
  })

  it('does not render search or menu shell when there are no sidebar items', async () => {
    const Sidebar = (await import('@/component/layout/sidebar/sidebar.vue')).default
    const wrapper = mount(Sidebar, {
      props: {
        activePath: '/about',
        isPhone: false,
        isCollapse: false,
        navigate,
        showSearch: true,
        sidebarList: [],
      },
      global: {
        stubs: {
          SidebarLogo: LogoStub,
          SidebarSearch: SearchStub,
          MenuTree: MenuTreeStub,
          ElMenu: ElMenuStub,
        },
      },
    })

    expect(wrapper.find('.search-stub').exists()).toBe(false)
    expect(wrapper.find('.el-menu-stub').exists()).toBe(false)
  })
})
