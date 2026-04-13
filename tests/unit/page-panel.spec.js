import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PagePanel from '@/component/base/page-panel.vue'

describe('page-panel', () => {
  it('renders the title prop and body slot with default spacing vars', () => {
    const wrapper = mount(PagePanel, {
      props: {
        title: '用户列表',
      },
      slots: {
        default: '<div class="panel-content">内容</div>',
      },
    })

    expect(wrapper.get('.page-panel__title').text()).toBe('用户列表')
    expect(wrapper.get('.page-panel__body').text()).toContain('内容')
    expect(wrapper.get('.page-panel__header').attributes('style')).toContain('--page-panel-header-padding: 0 40px;')
    expect(wrapper.get('.page-panel__body').attributes('style')).toContain('--page-panel-body-padding: 20px;')
  })

  it('renders title and actions slots when provided', () => {
    const wrapper = mount(PagePanel, {
      props: {
        headerPadding: '0 24px',
        bodyPadding: '16px 24px',
      },
      slots: {
        title: '<div class="custom-title">自定义标题</div>',
        actions: '<button class="custom-action">操作</button>',
      },
    })

    expect(wrapper.get('.custom-title').text()).toBe('自定义标题')
    expect(wrapper.get('.custom-action').text()).toBe('操作')
    expect(wrapper.get('.page-panel__header').classes()).toContain('page-panel__header--with-actions')
    expect(wrapper.get('.page-panel__body').attributes('style')).toContain('--page-panel-body-padding: 16px 24px;')
  })
})
