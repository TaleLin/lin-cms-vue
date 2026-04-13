import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import StickyTop from '@/component/base/sticky-top/sticky-top.vue'

describe('sticky-top', () => {
  it('renders the wrapper shell and preserves slot content', () => {
    const wrapper = mount(StickyTop, {
      slots: {
        default: '<div class="sticky-slot">toolbar</div>',
      },
    })

    expect(wrapper.classes()).toContain('wrapper')
    expect(wrapper.get('.sticky-slot').text()).toBe('toolbar')
  })
})
