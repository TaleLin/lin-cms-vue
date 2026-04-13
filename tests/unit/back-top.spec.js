import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  useEventListener: vi.fn(),
}))

vi.mock('@vueuse/core', () => ({
  useEventListener: mocks.useEventListener,
}))

import BackTop from '@/component/layout/back-top.vue'

describe('back-top', () => {
  beforeEach(() => {
    mocks.useEventListener.mockReset()
  })

  it('registers a scroll listener and reveals the button after scrolling past the threshold', async () => {
    let scrollHandler
    mocks.useEventListener.mockImplementation((_target, _event, handler) => {
      scrollHandler = handler
    })

    const wrapper = mount(BackTop, {
      props: {
        right: 24,
        bottom: 32,
        fontSize: 20,
      },
    })

    expect(mocks.useEventListener).toHaveBeenCalledWith(window, 'scroll', expect.any(Function), {
      capture: true,
    })
    expect(wrapper.find('.back-top').exists()).toBe(false)

    scrollHandler({
      target: {
        scrollTop: 120,
      },
    })
    await wrapper.vm.$nextTick()

    const button = wrapper.get('.back-top')
    expect(button.attributes('style')).toContain('--back-top-right: 24px;')
    expect(button.attributes('style')).toContain('--back-top-bottom: 32px;')
    expect(button.attributes('style')).toContain('--back-top-font-size: 20px;')
  })

  it('animates the tracked scroll target back to the top', async () => {
    let scrollHandler
    mocks.useEventListener.mockImplementation((_target, _event, handler) => {
      scrollHandler = handler
    })

    const rafQueue = []
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      rafQueue.push(callback)
      return rafQueue.length
    })
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    const wrapper = mount(BackTop)
    const scrollTarget = {
      scrollTop: 120,
    }

    scrollHandler({ target: scrollTarget })
    await wrapper.vm.$nextTick()
    await wrapper.get('.back-top__icon').trigger('click')

    const callback = rafQueue.shift()
    callback()

    expect(scrollTarget.scrollTop).toBeLessThan(120)
    expect(requestAnimationFrameSpy).toHaveBeenCalled()
    expect(cancelAnimationFrameSpy).not.toHaveBeenCalled()

    requestAnimationFrameSpy.mockRestore()
    cancelAnimationFrameSpy.mockRestore()
  })

  it('cancels any pending scroll animation when the component unmounts', async () => {
    let scrollHandler
    mocks.useEventListener.mockImplementation((_target, _event, handler) => {
      scrollHandler = handler
    })

    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 42)
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    const wrapper = mount(BackTop)

    scrollHandler({
      target: {
        scrollTop: 150,
      },
    })
    await wrapper.vm.$nextTick()
    await wrapper.get('.back-top__icon').trigger('click')

    expect(requestAnimationFrameSpy).toHaveBeenCalled()

    wrapper.unmount()

    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(42)

    requestAnimationFrameSpy.mockRestore()
    cancelAnimationFrameSpy.mockRestore()
  })

  it('hides the button again when the current scroll position falls below the threshold', async () => {
    let scrollHandler
    mocks.useEventListener.mockImplementation((_target, _event, handler) => {
      scrollHandler = handler
    })

    const wrapper = mount(BackTop)

    scrollHandler({
      target: {
        scrollTop: 150,
      },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.back-top').exists()).toBe(true)

    scrollHandler({
      target: {
        scrollTop: 20,
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.back-top').exists()).toBe(false)
  })
})
