import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Logo from '@/component/layout/sidebar/logo.vue'

describe('logo', () => {
  it('renders the full sidebar logo through the explicit display contract when the menu is expanded', () => {
    const wrapper = mount(Logo, {
      props: {
        elMenuCollapse: false,
      },
    })

    expect(wrapper.classes()).toContain('logo')
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toContain('logo')
  })

  it('renders the compact mobile logo through the explicit display contract when the menu is collapsed', () => {
    const wrapper = mount(Logo, {
      props: {
        elMenuCollapse: true,
      },
    })

    expect(wrapper.classes()).toContain('mobile-logo')
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toContain('mobile-logo')
  })
})
