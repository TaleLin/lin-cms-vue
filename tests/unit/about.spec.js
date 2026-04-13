import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const windowWidth = ref(1400)
const openExternalLink = vi.fn()

vi.mock('@vueuse/core', () => ({
  useWindowSize: () => ({
    width: windowWidth,
  }),
}))

vi.mock('@/lin/util/browser', () => ({
  openExternalLink,
}))

const ElTabsStub = defineComponent({
  name: 'ElTabs',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  setup(_, { slots }) {
    return () => h('div', { class: 'el-tabs-stub' }, slots.default?.())
  },
})

const ElTabPaneStub = defineComponent({
  name: 'ElTabPane',
  props: {
    label: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'section',
        {
          class: 'el-tab-pane-stub',
          'data-label': props.label,
          'data-name': props.name,
        },
        slots.default?.(),
      )
  },
})

const ElDividerStub = defineComponent({
  name: 'ElDivider',
  setup() {
    return () => h('span', { class: 'el-divider-stub' })
  },
})

describe('AboutView', () => {
  beforeEach(() => {
    windowWidth.value = 1400
    openExternalLink.mockReset()
  })

  it('renders centralized about data and opens article links', async () => {
    const AboutView = (await import('@/view/about/about.vue')).default
    const wrapper = mount(AboutView, {
      global: {
        stubs: {
          ElTabs: ElTabsStub,
          ElTabPane: ElTabPaneStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    expect(wrapper.findAll('.quantity-item')).toHaveLength(4)
    expect(wrapper.findAll('.article-item')).toHaveLength(2)
    expect(wrapper.findAll('.team-ul > li')[1].text()).toContain('Pedro')
    expect(wrapper.get('a[href="https://www.talelin.com"]').attributes('rel')).toContain('noopener')

    await wrapper.findAll('.article-item')[0].trigger('click')

    expect(openExternalLink).toHaveBeenCalledTimes(1)
    expect(openExternalLink.mock.calls[0][0]).toBe('https://opensource.guide/how-to-contribute/')
  })

  it('condenses the development team list within the narrow desktop range', async () => {
    windowWidth.value = 1250

    const AboutView = (await import('@/view/about/about.vue')).default
    const wrapper = mount(AboutView, {
      global: {
        stubs: {
          ElTabs: ElTabsStub,
          ElTabPane: ElTabPaneStub,
          ElDivider: ElDividerStub,
        },
      },
    })

    expect(wrapper.findAll('.team-ul > li')[1].text()).toContain('林间有风 CMS 组')
    expect(wrapper.findAll('.team-ul > li')[1].text()).not.toContain('Pedro')
  })
})
