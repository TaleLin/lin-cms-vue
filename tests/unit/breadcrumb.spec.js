import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('breadcrumb', () => {
  it('renders breadcrumb items from the current stage info', async () => {
    const Breadcrumb = (await import('@/component/layout/breadcrumb.vue')).default
    const wrapper = mount(Breadcrumb, {
      props: {
        stageInfo: [
          { title: '权限管理', name: 'admin' },
          { title: '分组管理', route: '/admin/group' },
          { title: '分组列表', route: '/admin/group/list' },
        ],
      },
    })

    const items = wrapper.findAll('.item')
    expect(items).toHaveLength(3)
    expect(items.map(item => item.text())).toEqual(['权限管理', '分组管理', '分组列表'])
  })

  it('updates breadcrumb items when the route changes', async () => {
    const Breadcrumb = (await import('@/component/layout/breadcrumb.vue')).default
    const wrapper = mount(Breadcrumb, {
      props: {
        stageInfo: [
          { title: '权限管理', name: 'admin' },
          { title: '分组管理', route: '/admin/group' },
          { title: '分组列表', route: '/admin/group/list' },
        ],
      },
    })

    await wrapper.setProps({
      stageInfo: [{ title: '控制台', route: '/dashboard' }],
    })
    await nextTick()

    const items = wrapper.findAll('.item')
    expect(items).toHaveLength(1)
    expect(items[0].text()).toBe('控制台')
  })

  it('hides the breadcrumb container when the current stage has no breadcrumb items', async () => {
    const Breadcrumb = (await import('@/component/layout/breadcrumb.vue')).default
    const wrapper = mount(Breadcrumb, {
      props: {
        stageInfo: [],
      },
    })

    expect(wrapper.find('.nav-title').exists()).toBe(false)
    expect(wrapper.findAll('.item')).toHaveLength(0)
  })
})
