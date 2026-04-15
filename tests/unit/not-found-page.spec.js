import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@vueuse/core', () => ({
  useWindowSize: () => ({
    height: ref(900),
  }),
}))

describe('not-found page', () => {
  it('renders the 404 shell with computed container height', async () => {
    const NotFoundPage = (await import('@/view/error-page/404.vue')).default
    const wrapper = mount(NotFoundPage)

    expect(wrapper.findAll('img')).toHaveLength(2)
    expect(wrapper.get('.container').attributes('style')).toContain('height: 828px;')
    expect(wrapper.get('.page-404').attributes('alt')).toBe('')
  })
})
