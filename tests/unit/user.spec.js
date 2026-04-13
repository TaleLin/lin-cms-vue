import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  logoutAction: vi.fn(),
  navigateToCenter: vi.fn(),
  userMenu: null,
  useUserMenu: vi.fn(),
  userStore: null,
}))

vi.mock('@/component/layout/use-user-menu', () => ({
  useUserMenu: mocks.useUserMenu,
}))

const AvatarStub = defineComponent({
  name: 'UserAvatarStub',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    originalImage: {
      type: String,
      default: '',
    },
    userStore: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    return () =>
      h('div', {
        class: 'avatar-stub',
        'data-visible': String(props.visible),
        'data-image': props.originalImage,
        'data-has-user-store': String(Boolean(props.userStore)),
      })
  },
})

const ElDropdownStub = defineComponent({
  name: 'ElDropdown',
  setup(_, { slots }) {
    return () => h('div', { class: 'el-dropdown-stub' }, [slots.default?.(), slots.dropdown?.()])
  },
})

const ElDropdownMenuStub = defineComponent({
  name: 'ElDropdownMenu',
  setup(_, { slots }) {
    return () => h('div', { class: 'el-dropdown-menu-stub' }, slots.default?.())
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'blur'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        class: 'el-input-stub',
        value: props.modelValue,
        onInput: event => emit('update:modelValue', event.target.value),
        onBlur: () => emit('blur'),
      })
  },
})

describe('user', () => {
  beforeEach(() => {
    mocks.logoutAction.mockReset()
    mocks.navigateToCenter.mockReset()
    mocks.userStore = { id: 7 }
    mocks.userMenu = {
      avatarSrc: ref('/avatar.png'),
      displayNickname: ref('林间'),
      editingNickname: ref('林间'),
      isEditingNickname: ref(false),
      groupName: ref('测试组'),
      cropImg: ref(''),
      cropVisible: ref(false),
      handleAvatarFileChange: vi.fn(),
      startNicknameEdit: vi.fn(),
      submitNicknameEdit: vi.fn(),
      goToCenter: vi.fn(),
      logout: vi.fn(),
    }

    mocks.userMenu.avatarSrc.value = '/avatar.png'
    mocks.userMenu.displayNickname.value = '林间'
    mocks.userMenu.editingNickname.value = '林间'
    mocks.userMenu.isEditingNickname.value = false
    mocks.userMenu.groupName.value = '测试组'
    mocks.userMenu.cropImg.value = ''
    mocks.userMenu.cropVisible.value = false
    mocks.userMenu.startNicknameEdit.mockReset()
    mocks.userMenu.submitNicknameEdit.mockReset()
    mocks.useUserMenu.mockReset()
    mocks.useUserMenu.mockReturnValue(mocks.userMenu)
  })

  it('shows nickname summary content when editing is disabled', async () => {
    const UserMenu = (await import('@/component/layout/user.vue')).default
    const wrapper = mount(UserMenu, {
      props: {
        logoutAction: mocks.logoutAction,
        navigateToCenter: mocks.navigateToCenter,
        userStore: mocks.userStore,
      },
      global: {
        stubs: {
          Avatar: AvatarStub,
          ElDropdown: ElDropdownStub,
          ElDropdownMenu: ElDropdownMenuStub,
          ElInput: ElInputStub,
        },
      },
    })

    expect(wrapper.find('.username').text()).toBe('林间')
    expect(wrapper.find('.desc').text()).toBe('测试组')
    expect(wrapper.find('.el-input-stub').exists()).toBe(false)
    expect(wrapper.get('.avatar-stub').attributes('data-has-user-store')).toBe('true')
  })

  it('shows the nickname input and hides summary text while editing', async () => {
    mocks.userMenu.isEditingNickname.value = true

    const UserMenu = (await import('@/component/layout/user.vue')).default
    const wrapper = mount(UserMenu, {
      props: {
        logoutAction: mocks.logoutAction,
        navigateToCenter: mocks.navigateToCenter,
        userStore: mocks.userStore,
      },
      global: {
        stubs: {
          Avatar: AvatarStub,
          ElDropdown: ElDropdownStub,
          ElDropdownMenu: ElDropdownMenuStub,
          ElInput: ElInputStub,
        },
      },
    })

    expect(wrapper.find('.username').exists()).toBe(false)
    expect(wrapper.find('.desc').exists()).toBe(false)
    expect(wrapper.find('.el-input-stub').exists()).toBe(true)
  })

  it('passes explicit actions and user store from the assembly layer into the user-menu composable', async () => {
    const UserMenu = (await import('@/component/layout/user.vue')).default
    mount(UserMenu, {
      props: {
        logoutAction: mocks.logoutAction,
        navigateToCenter: mocks.navigateToCenter,
        userStore: mocks.userStore,
      },
      global: {
        stubs: {
          Avatar: AvatarStub,
          ElDropdown: ElDropdownStub,
          ElDropdownMenu: ElDropdownMenuStub,
          ElInput: ElInputStub,
        },
      },
    })

    expect(mocks.useUserMenu).toHaveBeenCalledWith(
      expect.objectContaining({
        logoutAction: mocks.logoutAction,
        navigateToCenterAction: mocks.navigateToCenter,
        userStore: mocks.userStore,
      }),
    )
  })
})
