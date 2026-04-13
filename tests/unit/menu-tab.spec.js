import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lin/filter', () => ({
  filters: {
    filterTitle: vi.fn(title => `标题:${title}`),
  },
}))

const RouterLinkStub = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'a',
        {
          class: 'router-link-stub',
          'data-to': props.to,
        },
        slots.default?.(),
      )
  },
})

describe('menu-tab', () => {
  it('renders visible tab routes for tab-based stage parents', async () => {
    const MenuTab = (await import('@/component/layout/menu-tab.vue')).default
    const wrapper = mount(MenuTab, {
      props: {
        stageInfo: [
          { title: '权限管理', type: 'folder', name: 'admin' },
          {
            title: '分组管理',
            type: 'tab',
            route: '/admin/group',
            children: [
              { inNav: true, icon: 'Collection', title: '分组列表', route: '/admin/group/list' },
              { inNav: true, icon: '/icons/create.png', title: '新建分组', route: '/admin/group/create' },
              { inNav: false, icon: 'Memo', title: '隐藏页', route: '/hidden' },
            ],
          },
          { title: '分组列表', type: 'view', route: '/admin/group/list' },
        ],
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    const links = wrapper.findAll('.router-link-stub')
    expect(links).toHaveLength(2)
    expect(links.map(link => link.attributes('data-to'))).toEqual(['/admin/group/list', '/admin/group/create'])

    const titles = wrapper.findAll('.title')
    expect(titles.map(title => title.text())).toEqual(['标题:分组列表', '标题:新建分组'])
    expect(wrapper.find('ul.menu-tab').exists()).toBe(true)
    expect(wrapper.findAll('.menu-tab__icon')).toHaveLength(1)
    expect(wrapper.findAll('img.img-icon')).toHaveLength(1)
  })

  it('hides the tab shell when the current stage has no tab parent', async () => {
    const MenuTab = (await import('@/component/layout/menu-tab.vue')).default
    const wrapper = mount(MenuTab, {
      props: {
        stageInfo: [{ title: '控制台', type: 'view', route: '/dashboard' }],
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('.menu-tab').exists()).toBe(false)
    expect(wrapper.findAll('.router-link-stub')).toHaveLength(0)
  })

  it('updates visible tabs when the stage input changes', async () => {
    const MenuTab = (await import('@/component/layout/menu-tab.vue')).default
    const wrapper = mount(MenuTab, {
      props: {
        stageInfo: [{ title: '控制台', type: 'view', route: '/dashboard' }],
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    })

    expect(wrapper.find('.menu-tab').exists()).toBe(false)

    await wrapper.setProps({
      stageInfo: [
        { title: '权限管理', type: 'folder', name: 'admin' },
        {
          title: '分组管理',
          type: 'tab',
          route: '/admin/group',
          children: [{ inNav: true, icon: 'Collection', title: '分组列表', route: '/admin/group/list' }],
        },
        { title: '分组列表', type: 'view', route: '/admin/group/list' },
      ],
    })
    await nextTick()

    expect(wrapper.find('.menu-tab').exists()).toBe(true)
    expect(wrapper.findAll('.router-link-stub')).toHaveLength(1)
  })
})
