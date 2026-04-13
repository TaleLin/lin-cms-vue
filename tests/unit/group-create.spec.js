import { defineComponent, h } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createGroup: vi.fn(),
  getGroupPermissions: vi.fn(),
  messageError: vi.fn(),
  messageSuccess: vi.fn(),
  notifyRequestError: vi.fn(),
  routerPush: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mocks.routerPush,
  }),
}))

vi.mock('element-plus', async () => {
  const actual = await vi.importActual('element-plus')

  return {
    ...actual,
    ElMessage: {
      error: mocks.messageError,
      success: mocks.messageSuccess,
    },
  }
})

vi.mock('@/model/admin', () => ({
  createGroup: mocks.createGroup,
  dispatchGroupPermissions: vi.fn(),
  removeGroupPermissions: vi.fn(),
}))

vi.mock('@/lin/util/request-error', () => ({
  notifyRequestError: mocks.notifyRequestError,
}))

vi.mock('@/view/admin/group/group-permission', async () => {
  const { defineComponent, h } = await vi.importActual('vue')

  return {
    default: defineComponent({
      name: 'GroupPermissions',
      props: {
        selectedIds: {
          type: Array,
          default: () => [],
        },
        title: {
          type: String,
          default: '',
        },
      },
      emits: ['update:selectedIds'],
      setup(props, { expose }) {
        expose({
          getGroupPermissions: mocks.getGroupPermissions,
        })

        return () =>
          h('div', {
            class: 'group-permissions-stub',
            'data-selected-ids': JSON.stringify(props.selectedIds),
            'data-title': props.title,
          })
      },
    }),
  }
})

function createFormStub() {
  const validate = vi.fn().mockResolvedValue(undefined)
  const resetFields = vi.fn()

  const component = defineComponent({
    name: 'ElForm',
    setup(_, { slots, expose }) {
      expose({
        resetFields,
        validate,
      })

      return () => h('form', { class: 'el-form-stub' }, slots.default?.())
    },
  })

  return {
    component,
    resetFields,
    validate,
  }
}

const ElFormItemStub = defineComponent({
  name: 'ElFormItem',
  setup(_, { slots }) {
    return () => h('div', { class: 'el-form-item-stub' }, slots.default?.())
  },
})

const ElInputStub = defineComponent({
  name: 'ElInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('input', {
        class: 'el-input-stub',
        value: props.modelValue,
        onInput: event => {
          emit('update:modelValue', event.target.value)
        },
      })
  },
})

const ElButtonStub = defineComponent({
  name: 'ElButton',
  emits: ['click'],
  setup(_, { emit, slots }) {
    return () =>
      h(
        'button',
        {
          class: 'el-button-stub',
          type: 'button',
          onClick: () => emit('click'),
        },
        slots.default?.(),
      )
  },
})

const ElRowStub = defineComponent({
  name: 'ElRow',
  setup(_, { slots }) {
    return () => h('div', { class: 'el-row-stub' }, slots.default?.())
  },
})

const ElColStub = defineComponent({
  name: 'ElCol',
  setup(_, { slots }) {
    return () => h('div', { class: 'el-col-stub' }, slots.default?.())
  },
})

describe('group-create page', () => {
  beforeEach(() => {
    mocks.createGroup.mockReset()
    mocks.getGroupPermissions.mockReset()
    mocks.messageError.mockReset()
    mocks.messageSuccess.mockReset()
    mocks.notifyRequestError.mockReset()
    mocks.routerPush.mockReset()
  })

  it('keeps template refs wired so submit can validate and reset the permission picker', async () => {
    mocks.createGroup.mockResolvedValue({
      code: 0,
      message: '创建成功',
    })

    const { component: formStub, resetFields, validate } = createFormStub()
    const component = (await import('@/view/admin/group/group-create.vue')).default
    const wrapper = mount(component, {
      global: {
        directives: {
          loading: {},
        },
        stubs: {
          ElButton: ElButtonStub,
          ElCol: ElColStub,
          ElForm: formStub,
          ElFormItem: ElFormItemStub,
          ElInput: ElInputStub,
          ElRow: ElRowStub,
        },
      },
    })

    const inputs = wrapper.findAll('.el-input-stub')
    await inputs[0].setValue('前端组')
    await inputs[1].setValue('负责后台现代化改造')
    await wrapper.findAll('.el-button-stub')[0].trigger('click')
    await flushPromises()

    expect(validate).toHaveBeenCalledTimes(1)
    expect(mocks.createGroup).toHaveBeenCalledWith({
      name: '前端组',
      info: '负责后台现代化改造',
      permissionIds: [],
    })
    expect(mocks.messageSuccess).toHaveBeenCalledWith('创建成功')
    expect(mocks.routerPush).toHaveBeenCalledWith('/admin/group/list')
    expect(resetFields).toHaveBeenCalledTimes(1)
    expect(mocks.getGroupPermissions).toHaveBeenCalledTimes(1)
  })
})
