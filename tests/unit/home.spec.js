import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const route = reactive({
  name: 'dashboard',
  path: '/dashboard',
  fullPath: '/dashboard',
})
const router = {
  push: vi.fn(),
}

const windowWidth = ref(1024)
const windowHeight = ref(900)
const clearTabs = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => router,
}))

vi.mock('@vueuse/core', () => ({
  useWindowSize: () => ({
    width: windowWidth,
    height: windowHeight,
  }),
}))

const mockUserStore = {
  user: {},
  loggedIn: true,
  permissions: [],
  sidebarList: [
    { path: '/about', title: '关于' },
    { path: '/log', title: '日志' },
  ],
  defaultRoute: '/about',
  unreadMessageCount: 0,
  unreadMessages: [],
  alreadyReadMessages: [],
  getStageByName: vi.fn(),
  getStageByRoute: vi.fn(),
  getStageInfo: vi.fn(name => (name === 'dashboard' ? [{ title: '控制台', route: '/dashboard' }] : [])),
  permissionStageConfig: [],
}

vi.mock('@/store/modules/user', () => ({
  useUserStore: () => mockUserStore,
}))

const ElContainerStub = defineComponent({
  name: 'ElContainer',
  setup(_, { slots }) {
    return () => h('div', { class: 'el-container-stub' }, slots.default?.())
  },
})

const ElAsideStub = defineComponent({
  name: 'ElAside',
  props: {
    width: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    return () => h('aside', { class: 'el-aside-stub', 'data-width': props.width }, slots.default?.())
  },
})

const ElHeaderStub = defineComponent({
  name: 'ElHeader',
  setup(_, { slots }) {
    return () => h('header', { class: 'el-header-stub' }, slots.default?.())
  },
})

const ElMainStub = defineComponent({
  name: 'ElMain',
  setup(_, { slots }) {
    return () => h('main', { class: 'el-main-stub' }, slots.default?.())
  },
})

const ElCollapseTransitionStub = defineComponent({
  name: 'ElCollapseTransition',
  setup(_, { slots }) {
    return () => h('div', { class: 'collapse-transition-stub' }, slots.default?.())
  },
})

const SidebarStub = defineComponent({
  name: 'HomeSidebarStub',
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
    isPhone: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    activePath: {
      type: String,
      default: '',
    },
    navigate: {
      type: Function,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'sidebar-stub',
          'data-collapse': String(props.isCollapse),
          'data-active-path': props.activePath,
          'data-has-navigate': String(Boolean(props.navigate)),
          'data-phone': String(props.isPhone),
          'data-show-search': String(props.showSearch),
        },
        slots.default?.(),
      )
  },
})

const AppMainStub = defineComponent({
  name: 'AppMain',
  props: {
    routeKey: {
      type: String,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return () =>
      h('div', {
        class: ['app-main-stub', attrs.class],
        'data-route-key': props.routeKey,
      })
  },
})

const MenuTabStub = defineComponent({
  name: 'MenuTab',
  props: {
    stageInfo: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'menu-tab-stub',
        'data-stage-size': String(props.stageInfo.length),
      })
  },
})

const BackTopStub = defineComponent({
  name: 'BackTop',
  props: {
    right: {
      type: Number,
      default: 0,
    },
    bottom: {
      type: Number,
      default: 0,
    },
    fontSize: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'back-top-stub',
        'data-right': String(props.right),
        'data-bottom': String(props.bottom),
        'data-font-size': String(props.fontSize),
      })
  },
})

const NavBarStub = defineComponent({
  name: 'NavBar',
  props: {
    stageInfo: {
      type: Array,
      default: () => [],
    },
    notifyEvents: {
      type: Object,
      default: () => ({}),
    },
    navigateToCenter: {
      type: Function,
      required: true,
    },
    logout: {
      type: Function,
      required: true,
    },
    userStore: {
      type: Object,
      required: true,
    },
  },
  emits: ['clearReuseTab'],
  setup(props, { emit }) {
    return () =>
      h('button', {
        class: 'nav-bar-stub',
        'data-has-logout': String(Boolean(props.logout)),
        'data-has-navigate-to-center': String(Boolean(props.navigateToCenter)),
        'data-has-user-store': String(Boolean(props.userStore)),
        'data-stage-size': String(props.stageInfo.length),
        onClick: () => emit('clearReuseTab'),
      })
  },
})

const ReuseTabStub = defineComponent({
  name: 'ReuseTab',
  props: {
    currentRoute: {
      type: Object,
      required: true,
    },
    navigate: {
      type: Function,
      required: true,
    },
  },
  emits: ['historyCountChange'],
  setup(props, { emit, expose }) {
    expose({
      clearTabs,
    })

    return () =>
      h('button', {
        class: 'reuse-tab-stub',
        'data-has-current-route': String(Boolean(props.currentRoute)),
        'data-has-navigate': String(Boolean(props.navigate)),
        onClick: () => emit('historyCountChange', 2),
      })
  },
})

vi.mock('@/component/layout', () => ({
  NavBar: NavBarStub,
  Sidebar: SidebarStub,
  AppMain: AppMainStub,
  ReuseTab: ReuseTabStub,
  MenuTab: MenuTabStub,
  BackTop: BackTopStub,
}))

describe('Home', () => {
  beforeEach(() => {
    route.name = 'dashboard'
    route.path = '/dashboard'
    route.fullPath = '/dashboard'
    windowWidth.value = 1024
    windowHeight.value = 900
    clearTabs.mockReset()
  })

  it('applies layout css vars and compacts the header when reuse tabs are shown', async () => {
    const Home = (await import('@/view/home/home.vue')).default
    const wrapper = mount(Home, {
      global: {
        stubs: {
          ElContainer: ElContainerStub,
          ElAside: ElAsideStub,
          ElHeader: ElHeaderStub,
          ElMain: ElMainStub,
          ElCollapseTransition: ElCollapseTransitionStub,
        },
      },
    })

    expect(wrapper.get('.home-shell').attributes('style')).toContain('--home-app-main-min-height: 764px;')
    expect(wrapper.get('.el-aside-stub').attributes('data-width')).toBe('210px')
    expect(wrapper.get('.sidebar-stub').attributes('data-show-search')).toBe('true')
    expect(wrapper.get('.sidebar-stub').attributes('data-has-navigate')).toBe('true')
    expect(wrapper.get('.sidebar-stub').attributes('data-active-path')).toBe('/dashboard')
    expect(wrapper.get('.back-top-stub').attributes('data-right')).toBe('50')
    expect(wrapper.get('.back-top-stub').attributes('data-bottom')).toBe('50')
    expect(wrapper.get('.back-top-stub').attributes('data-font-size')).toBe('34')
    expect(wrapper.get('.nav-bar-stub').attributes('data-stage-size')).toBe('1')
    expect(wrapper.get('.nav-bar-stub').attributes('data-has-logout')).toBe('true')
    expect(wrapper.get('.nav-bar-stub').attributes('data-has-navigate-to-center')).toBe('true')
    expect(wrapper.get('.nav-bar-stub').attributes('data-has-user-store')).toBe('true')
    expect(wrapper.get('.menu-tab-stub').attributes('data-stage-size')).toBe('1')
    expect(wrapper.get('.app-main-stub').attributes('data-route-key')).toBe('/dashboard')
    expect(wrapper.get('.reuse-tab-stub').attributes('data-has-current-route')).toBe('true')
    expect(wrapper.get('.reuse-tab-stub').attributes('data-has-navigate')).toBe('true')
    expect(wrapper.get('.home-shell__header-actions').classes()).not.toContain('home-shell__header-actions--compact')
    expect(wrapper.getComponent(NavBarStub).props('notifyEvents')).toEqual(
      expect.objectContaining({
        onmessage: expect.any(Function),
        onerror: expect.any(Function),
      }),
    )

    await wrapper.get('.reuse-tab-stub').trigger('click')

    expect(wrapper.get('.home-shell__header-actions').classes()).toContain('home-shell__header-actions--compact')
  })

  it('clears reuse tabs through the exposed child api and closes the phone sidebar on navigation', async () => {
    windowWidth.value = 480

    const Home = (await import('@/view/home/home.vue')).default
    const wrapper = mount(Home, {
      global: {
        stubs: {
          ElContainer: ElContainerStub,
          ElAside: ElAsideStub,
          ElHeader: ElHeaderStub,
          ElMain: ElMainStub,
          ElCollapseTransition: ElCollapseTransitionStub,
        },
      },
    })

    await wrapper.get('.nav-bar-stub').trigger('click')
    expect(clearTabs).toHaveBeenCalledTimes(1)
    expect(wrapper.get('.sidebar-stub').attributes('data-phone')).toBe('true')
    expect(wrapper.get('.sidebar-stub').attributes('data-show-search')).toBe('false')

    await wrapper.get('.home-shell__toggle-icon').trigger('click')
    expect(wrapper.get('.home-shell').classes()).toContain('home-shell--sidebar-open')
    expect(wrapper.get('.home-shell__sidenav-mask').classes()).toContain('home-shell__sidenav-mask--visible')
    expect(wrapper.get('.home-shell__toggle-icon').classes()).not.toContain('home-shell__toggle-icon--collapsed')

    route.path = '/dashboard/next'
    route.fullPath = '/dashboard/next'
    await nextTick()

    expect(wrapper.get('.app-main-stub').attributes('data-route-key')).toBe('/dashboard/next')
    expect(wrapper.get('.home-shell').classes()).not.toContain('home-shell--sidebar-open')
  })
})
