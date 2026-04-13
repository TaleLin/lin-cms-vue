import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

const componentStub = defineComponent({
  name: 'RouteComponentStub',
  setup() {
    return () => h('div', { class: 'route-component-stub' }, 'route content')
  },
})

const RouterViewStub = defineComponent({
  name: 'RouterView',
  setup(_, { slots }) {
    return () =>
      slots.default?.({
        Component: componentStub,
      })
  },
})

const TransitionStub = defineComponent({
  name: 'Transition',
  props: {
    name: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: '',
    },
    appear: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'transition-stub',
          'data-name': props.name,
          'data-mode': props.mode,
          'data-appear': String(props.appear),
        },
        slots.default?.(),
      )
  },
})

describe('AppMain', () => {
  it('renders router content through the named page transition contract with an explicit route key', async () => {
    const AppMain = (await import('@/component/layout/app-main.vue')).default
    const wrapper = mount(AppMain, {
      props: {
        routeKey: '/log',
      },
      global: {
        stubs: {
          RouterView: RouterViewStub,
          Transition: TransitionStub,
        },
      },
    })

    expect(wrapper.get('transition-stub').attributes('name')).toBe('fade-transform')
    expect(wrapper.get('transition-stub').attributes('mode')).toBe('out-in')
    expect(wrapper.get('transition-stub').attributes('appear')).toBe('true')
    expect(wrapper.find('.route-component-stub').exists()).toBe(true)
  })
})
