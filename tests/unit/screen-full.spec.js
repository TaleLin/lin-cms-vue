import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  ElMessage: vi.fn(),
  FullScreen: {
    name: 'FullScreen',
    template: '<span class="full-screen-icon-stub" />',
  },
  ScaleToOriginal: {
    name: 'ScaleToOriginal',
    template: '<span class="scale-to-original-icon-stub" />',
  },
  screenfull: {
    isEnabled: true,
    isFullscreen: false,
    on: vi.fn(),
    off: vi.fn(),
    toggle: vi.fn(),
  },
}))

vi.mock('element-plus', () => ({
  ElMessage: mocks.ElMessage,
}))

vi.mock('@element-plus/icons-vue', () => ({
  FullScreen: mocks.FullScreen,
  ScaleToOriginal: mocks.ScaleToOriginal,
}))

vi.mock('screenfull', () => ({
  default: mocks.screenfull,
}))

import ScreenFull from '@/component/layout/screen-full.vue'

describe('screen-full', () => {
  beforeEach(() => {
    mocks.ElMessage.mockReset()
    mocks.screenfull.isEnabled = true
    mocks.screenfull.isFullscreen = false
    mocks.screenfull.on.mockReset()
    mocks.screenfull.off.mockReset()
    mocks.screenfull.toggle.mockReset()
  })

  it('registers change listeners, toggles fullscreen, and updates the rendered icon', async () => {
    let changeHandler
    mocks.screenfull.on.mockImplementation((_event, handler) => {
      changeHandler = handler
    })

    const wrapper = mount(ScreenFull)

    expect(mocks.screenfull.on).toHaveBeenCalledWith('change', expect.any(Function))
    expect(wrapper.find('.screen-full__icon').exists()).toBe(true)

    await wrapper.find('.screen-full__icon').trigger('click')
    expect(mocks.screenfull.toggle).toHaveBeenCalledTimes(1)

    mocks.screenfull.isFullscreen = true
    changeHandler()
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.screen-full__icon').exists()).toBe(true)

    wrapper.unmount()
    expect(mocks.screenfull.off).toHaveBeenCalledWith('change', changeHandler)
  })

  it('syncs the initial icon state before waiting for fullscreen change events', async () => {
    mocks.screenfull.isFullscreen = true

    const wrapper = mount(ScreenFull)
    await nextTick()

    expect(mocks.screenfull.on).toHaveBeenCalledWith('change', expect.any(Function))
    expect(wrapper.find('.scale-to-original-icon-stub').exists()).toBe(true)
    expect(wrapper.find('.full-screen-icon-stub').exists()).toBe(false)
  })

  it('shows a warning instead of toggling when fullscreen is unavailable', async () => {
    mocks.screenfull.isEnabled = false

    const wrapper = mount(ScreenFull)
    await wrapper.find('.screen-full__icon').trigger('click')

    expect(mocks.ElMessage).toHaveBeenCalledWith({
      message: 'you browser can not work',
      type: 'warning',
    })
    expect(mocks.screenfull.toggle).not.toHaveBeenCalled()
    expect(mocks.screenfull.on).not.toHaveBeenCalled()

    wrapper.unmount()
    expect(mocks.screenfull.off).not.toHaveBeenCalled()
  })
})
