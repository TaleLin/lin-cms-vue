import { defineComponent, h, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const route = reactive({
  name: Symbol('log'),
  path: '/log',
  matched: [{ path: '/' }, { path: '/log' }],
})

const navigate = vi.fn()

const RouterLinkStub = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots, attrs }) {
    return () => h('a', { ...attrs, 'data-to': props.to }, slots.default?.())
  },
})

const storedHistories = ref([])

const stagesByRoute = {
  '/about': {
    name: Symbol('about'),
    route: '/about',
    title: '林间有风',
    icon: '/icons/about.png',
  },
  '/log': {
    name: Symbol('log'),
    route: '/log',
    title: '日志管理',
    icon: 'Memo',
  },
}

const userStore = {
  loggedIn: true,
  permissionStageConfig: [],
  defaultRoute: '/about',
  getStageByName: vi.fn(name => Object.values(stagesByRoute).find(stage => stage.name === name)),
  getStageByRoute: vi.fn(path => stagesByRoute[path]),
}

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core')

  return {
    ...actual,
    onClickOutside: vi.fn(),
    useLocalStorage: vi.fn(() => storedHistories),
  }
})

vi.mock('swiper/vue', () => ({
  Swiper: defineComponent({
    name: 'ReuseTabSwiperStub',
    setup(_, { slots }) {
      return () => h('div', { class: 'swiper-stub' }, slots.default?.())
    },
  }),
  SwiperSlide: defineComponent({
    name: 'ReuseTabSwiperSlideStub',
    setup(_, { slots }) {
      return () => h('div', { class: 'swiper-slide-stub' }, slots.default?.())
    },
  }),
}))

vi.mock('swiper/modules', () => ({
  FreeMode: {},
  Mousewheel: {},
}))

describe('reuse-tab', () => {
  beforeEach(() => {
    navigate.mockReset()
    userStore.getStageByName.mockClear()
    userStore.getStageByRoute.mockClear()
    storedHistories.value = [
      { path: '/about', routePath: '/about' },
      { path: '/log', routePath: '/log' },
    ]
    route.name = Symbol('log')
    route.path = '/log'
    route.matched = [{ path: '/' }, { path: '/log' }]
  })

  it('restores stored histories before syncing the current route on refresh', async () => {
    const ReuseTab = (await import('@/component/layout/reuse-tab.vue')).default
    const wrapper = mount(ReuseTab, {
      props: {
        currentRoute: route,
        navigate,
        getStageByName: userStore.getStageByName,
        getStageByRoute: userStore.getStageByRoute,
        defaultRoute: userStore.defaultRoute,
        loggedIn: userStore.loggedIn,
        permissionStageConfig: userStore.permissionStageConfig,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          ElIcon: true,
        },
      },
    })

    const tabLinks = wrapper.findAll('a.reuse-tab-item')

    expect(tabLinks).toHaveLength(2)
    expect(tabLinks.map(node => node.attributes('data-to'))).toEqual(['/about', '/log'])
    expect(tabLinks[0].classes()).not.toContain('active')
    expect(tabLinks[1].classes()).toContain('active')
    expect(wrapper.emitted('historyCountChange')).toEqual([[2]])
    expect(wrapper.findAll('img.reuse-tab-item__image-icon')).toHaveLength(1)
    expect(storedHistories.value).toEqual([
      { path: '/about', routePath: '/about', stageId: stagesByRoute['/about'].name },
      { path: '/log', routePath: '/log', stageId: stagesByRoute['/log'].name },
    ])
  })

  it('hides the tab shell when only one resolved history remains', async () => {
    storedHistories.value = [{ path: '/log', routePath: '/log' }]

    const ReuseTab = (await import('@/component/layout/reuse-tab.vue')).default
    const wrapper = mount(ReuseTab, {
      props: {
        currentRoute: route,
        navigate,
        getStageByName: userStore.getStageByName,
        getStageByRoute: userStore.getStageByRoute,
        defaultRoute: userStore.defaultRoute,
        loggedIn: userStore.loggedIn,
        permissionStageConfig: userStore.permissionStageConfig,
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
          ElIcon: true,
        },
      },
    })

    expect(wrapper.find('.reuse-tab').exists()).toBe(false)
    expect(wrapper.findAll('a.reuse-tab-item')).toHaveLength(0)
  })
})
