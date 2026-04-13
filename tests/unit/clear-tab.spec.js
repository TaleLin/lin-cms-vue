import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ClearTab from '@/component/layout/clear-tab.vue'

describe('ClearTab', () => {
  it('emits a clear event instead of broadcasting through a global bus', async () => {
    const wrapper = mount(ClearTab)

    await wrapper.get('.tab').trigger('click')

    expect(wrapper.emitted('clear')).toEqual([[]])
  })
})
