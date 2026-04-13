import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockThemeStore = reactive({
  themes: [],
  activeTheme: {
    id: 'lin-classic',
    name: '海月靛青',
    description: '默认主题',
    swatches: ['#355C85', '#F3EEE6', '#1F3550'],
  },
  isDark: false,
  setTheme: vi.fn(),
  toggleDark: vi.fn(),
})

vi.mock('@/store/modules/theme', () => ({
  useThemeStore: () => mockThemeStore,
}))

const ElPopoverStub = defineComponent({
  name: 'ElPopover',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'el-popover-stub',
          'data-visible': String(props.visible),
        },
        [
          h('div', { class: 'el-popover-reference' }, slots.reference?.()),
          props.visible ? h('div', { class: 'el-popover-content' }, slots.default?.()) : null,
        ],
      )
  },
})

const ElDividerStub = defineComponent({
  name: 'ElDivider',
  setup() {
    return () => h('div', { class: 'el-divider-stub' })
  },
})

describe('theme-switcher', () => {
  beforeEach(() => {
    mockThemeStore.themes = [
      {
        id: 'lin-classic',
        name: '海月靛青',
        description: '默认主题',
        swatches: ['#355C85', '#F3EEE6', '#1F3550'],
      },
      {
        id: 'book-ink',
        name: '茶烟栗褐',
        description: '内容主题',
        swatches: ['#7A5230', '#F4EDE4', '#4B3122'],
      },
    ]
    mockThemeStore.activeTheme = mockThemeStore.themes[0]
    mockThemeStore.isDark = false
    mockThemeStore.setTheme.mockReset()
    mockThemeStore.toggleDark.mockReset()
    delete document.documentElement.dataset.chinaTheme
  })

  it('opens the popover and previews hovered themes on the document element', async () => {
    const ThemeSwitcher = (await import('@/component/layout/theme-switcher.vue')).default
    const wrapper = mount(ThemeSwitcher, {
      global: {
        stubs: {
          ElPopover: ElPopoverStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    await wrapper.get('.theme-switcher-trigger-wrap').trigger('mouseenter')
    expect(wrapper.get('.el-popover-stub').attributes('data-visible')).toBe('true')
    expect(wrapper.findAll('.theme-card')).toHaveLength(2)
    expect(wrapper.findAll('.theme-card--active')).toHaveLength(1)

    await wrapper.findAll('.theme-card')[1].trigger('mouseenter')
    expect(document.documentElement.dataset.chinaTheme).toBe('book-ink')
  })

  it('restores the active theme when the preview panel closes', async () => {
    vi.useFakeTimers()

    const ThemeSwitcher = (await import('@/component/layout/theme-switcher.vue')).default
    const wrapper = mount(ThemeSwitcher, {
      global: {
        stubs: {
          ElPopover: ElPopoverStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    await wrapper.get('.theme-switcher-trigger-wrap').trigger('mouseenter')
    await wrapper.findAll('.theme-card')[1].trigger('mouseenter')
    expect(document.documentElement.dataset.chinaTheme).toBe('book-ink')

    await wrapper.get('.theme-switcher-panel').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(120)
    await nextTick()

    expect(wrapper.get('.el-popover-stub').attributes('data-visible')).toBe('false')
    expect(document.documentElement.dataset.chinaTheme).toBe('lin-classic')

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('commits the selected theme and toggles dark mode through the store', async () => {
    const ThemeSwitcher = (await import('@/component/layout/theme-switcher.vue')).default
    const wrapper = mount(ThemeSwitcher, {
      global: {
        stubs: {
          ElPopover: ElPopoverStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    await wrapper.get('.theme-switcher-trigger-wrap').trigger('mouseenter')
    await wrapper.get('.theme-dark-toggle').trigger('click')
    expect(mockThemeStore.toggleDark).toHaveBeenCalledTimes(1)

    await wrapper.findAll('.theme-card')[1].trigger('click')
    expect(mockThemeStore.setTheme).toHaveBeenCalledTimes(1)
    expect(mockThemeStore.setTheme).toHaveBeenCalledWith('book-ink')
    expect(wrapper.get('.el-popover-stub').attributes('data-visible')).toBe('false')
  })

  it('hides theme cards when dark mode is active', async () => {
    mockThemeStore.isDark = true

    const ThemeSwitcher = (await import('@/component/layout/theme-switcher.vue')).default
    const wrapper = mount(ThemeSwitcher, {
      global: {
        stubs: {
          ElPopover: ElPopoverStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    await wrapper.get('.theme-switcher-trigger-wrap').trigger('mouseenter')

    expect(wrapper.get('.el-popover-stub').attributes('data-visible')).toBe('true')
    expect(wrapper.find('.el-divider-stub').exists()).toBe(false)
    expect(wrapper.findAll('.theme-card')).toHaveLength(0)
  })

  it('restores preview state safely when there is no active theme', async () => {
    vi.useFakeTimers()
    mockThemeStore.activeTheme = null

    const ThemeSwitcher = (await import('@/component/layout/theme-switcher.vue')).default
    const wrapper = mount(ThemeSwitcher, {
      global: {
        stubs: {
          ElPopover: ElPopoverStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    await wrapper.get('.theme-switcher-trigger-wrap').trigger('mouseenter')
    await wrapper.findAll('.theme-card')[1].trigger('mouseenter')
    expect(document.documentElement.dataset.chinaTheme).toBe('book-ink')

    await wrapper.get('.theme-switcher-panel').trigger('mouseleave')
    await vi.advanceTimersByTimeAsync(120)
    await nextTick()

    expect(wrapper.get('.el-popover-stub').attributes('data-visible')).toBe('false')
    expect(document.documentElement.dataset.chinaTheme).toBeUndefined()

    wrapper.unmount()
    vi.useRealTimers()
  })

  it('commits a theme safely when there is no active theme', async () => {
    mockThemeStore.activeTheme = null

    const ThemeSwitcher = (await import('@/component/layout/theme-switcher.vue')).default
    const wrapper = mount(ThemeSwitcher, {
      global: {
        stubs: {
          ElPopover: ElPopoverStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    await wrapper.get('.theme-switcher-trigger-wrap').trigger('mouseenter')
    await wrapper.findAll('.theme-card')[1].trigger('click')

    expect(mockThemeStore.setTheme).toHaveBeenCalledWith('book-ink')
    expect(wrapper.get('.el-popover-stub').attributes('data-visible')).toBe('false')
  })
})
