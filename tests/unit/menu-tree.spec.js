import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

const routerPush = vi.fn()
const navigate = routerPush

const ElSubMenuStub = defineComponent({
  name: 'ElSubMenu',
  props: {
    index: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'el-sub-menu-stub',
          'data-index': props.index,
        },
        [h('div', { class: 'el-sub-menu-title' }, slots.title?.()), slots.default?.()],
      )
  },
})

const ElMenuItemStub = defineComponent({
  name: 'ElMenuItem',
  props: {
    index: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          class: 'el-menu-item-stub',
          'data-index': props.index,
          onClick: () => emit('click'),
        },
        slots.default?.(),
      )
  },
})

describe('menu tree', () => {
  it('renders sub-menus for nodes with children', async () => {
    const MenuTree = (await import('@/component/layout/sidebar/menu-tree.vue')).default
    const wrapper = mount(MenuTree, {
      props: {
        item: {
          path: '/admin',
          title: '系统管理',
          icon: 'User',
          children: [
            {
              path: '/admin/user/list',
              title: '用户列表',
              icon: 'User',
            },
          ],
        },
        navigate,
      },
      global: {
        stubs: {
          ElSubMenu: ElSubMenuStub,
          ElMenuItem: ElMenuItemStub,
        },
      },
    })

    expect(wrapper.find('.el-sub-menu-stub').exists()).toBe(true)
    expect(wrapper.find('.el-sub-menu-stub').attributes('data-index')).toBe('/admin')
  })

  it('navigates with a path target when clicking a leaf node', async () => {
    const MenuTree = (await import('@/component/layout/sidebar/menu-tree.vue')).default
    const wrapper = mount(MenuTree, {
      props: {
        item: {
          path: '/about',
          title: '关于',
          icon: 'House',
        },
        navigate,
      },
      global: {
        stubs: {
          ElSubMenu: ElSubMenuStub,
          ElMenuItem: ElMenuItemStub,
        },
      },
    })

    await wrapper.get('.el-menu-item-stub').trigger('click')

    expect(routerPush).toHaveBeenCalledWith({ path: '/about' })
  })

  it('renders image icons through the explicit icon display contract', async () => {
    const MenuTree = (await import('@/component/layout/sidebar/menu-tree.vue')).default
    const wrapper = mount(MenuTree, {
      props: {
        item: {
          path: '/about',
          title: '关于',
          icon: '/icons/about.png',
        },
        navigate,
      },
      global: {
        stubs: {
          ElSubMenu: ElSubMenuStub,
          ElMenuItem: ElMenuItemStub,
        },
      },
    })

    expect(wrapper.find('img.img-icon').attributes('src')).toBe('/icons/about.png')
    expect(wrapper.find('.menu-tree__icon').exists()).toBe(false)
  })
})
