import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  closeCropper: vi.fn(),
  handleCrop: vi.fn(),
  updateProfile: vi.fn(),
  useAvatarCrop: vi.fn(),
}))

vi.mock('@/component/layout/use-avatar-crop', () => ({
  useAvatarCrop: mocks.useAvatarCrop,
}))

vi.mock('@/component/layout/use-current-user-profile', () => ({
  useCurrentUserProfile: () => ({
    updateProfile: mocks.updateProfile,
  }),
}))

vi.mock('vue-picture-cropper', () => ({
  default: defineComponent({
    name: 'VuePictureCropper',
    props: {
      img: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      return () =>
        h('div', {
          class: 'picture-cropper-stub',
          'data-img': props.img,
        })
    },
  }),
}))

const ElDialogStub = defineComponent({
  name: 'ElDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'el-dialog-stub',
          'data-visible': String(props.modelValue),
        },
        [slots.default?.(), slots.footer?.()],
      )
  },
})

const ElButtonStub = defineComponent({
  name: 'ElButton',
  setup(_props, { attrs, slots }) {
    return () =>
      h(
        'button',
        {
          class: 'el-button-stub',
          onClick: attrs.onClick,
        },
        slots.default?.(),
      )
  },
})

describe('avatar', () => {
  beforeEach(() => {
    mocks.closeCropper.mockReset()
    mocks.handleCrop.mockReset()
    mocks.updateProfile.mockReset()
    mocks.useAvatarCrop.mockReset()
    mocks.useAvatarCrop.mockReturnValue({
      closeCropper: mocks.closeCropper,
      handleCrop: mocks.handleCrop,
    })
  })

  it('passes the original image into the cropper and reflects the visible model', async () => {
    const Avatar = (await import('@/component/layout/avatar.vue')).default
    const wrapper = mount(Avatar, {
      props: {
        visible: true,
        originalImage: '/assets/avatar.jpg',
        userStore: { id: 7 },
      },
      global: {
        stubs: {
          ElDialog: ElDialogStub,
          ElButton: ElButtonStub,
        },
      },
    })

    expect(wrapper.get('.el-dialog-stub').attributes('data-visible')).toBe('true')
    expect(wrapper.get('.picture-cropper-stub').attributes('data-img')).toBe('/assets/avatar.jpg')
    expect(mocks.useAvatarCrop).toHaveBeenCalledTimes(1)
    expect(mocks.useAvatarCrop).toHaveBeenCalledWith(
      expect.objectContaining({
        pictureCropper: expect.any(Object),
        updateProfile: mocks.updateProfile,
      }),
    )
  })

  it('wires dialog actions to the avatar crop composable handlers', async () => {
    const Avatar = (await import('@/component/layout/avatar.vue')).default
    const wrapper = mount(Avatar, {
      props: {
        visible: true,
        userStore: { id: 7 },
      },
      global: {
        stubs: {
          ElDialog: ElDialogStub,
          ElButton: ElButtonStub,
        },
      },
    })

    const buttons = wrapper.findAll('.el-button-stub')
    await buttons[0].trigger('click')
    await buttons[1].trigger('click')

    expect(mocks.closeCropper).toHaveBeenCalledTimes(1)
    expect(mocks.handleCrop).toHaveBeenCalledTimes(1)
  })
})
