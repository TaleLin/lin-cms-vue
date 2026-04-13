import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useLogMock = vi.fn()
const useUserStoreMock = vi.fn(() => ({
  user: {},
  permissions: [],
}))

vi.mock('@/view/log/use-log', () => ({
  useLog: useLogMock,
}))

vi.mock('@/store/modules/user', () => ({
  useUserStore: useUserStoreMock,
}))

vi.mock('@/lin/filter', () => ({
  filters: {
    dateTimeFormatter: vi.fn(() => '2026-04-13 12:00:00'),
  },
}))

const createStub = name =>
  defineComponent({
    name,
    setup(_, { slots, attrs }) {
      return () => h('div', { class: `${name}-stub`, ...attrs }, slots.default?.())
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
  setup(props, { slots }) {
    return () => h('div', { class: 'el-input-stub', 'data-model-value': props.modelValue }, slots.suffix?.())
  },
})

const ElDropdownStub = createStub('ElDropdown')
const ElDropdownMenuStub = createStub('ElDropdownMenu')
const ElDropdownItemStub = defineComponent({
  name: 'ElDropdownItem',
  props: {
    command: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    return () =>
      h('div', { class: 'el-dropdown-item-stub', 'data-command': props.command.join(',') }, slots.default?.())
  },
})

const ElDatePickerStub = createStub('ElDatePicker')
const ElButtonStub = createStub('ElButton')
const ElDividerStub = createStub('ElDivider')
const ElIconStub = createStub('ElIcon')
const StickyTopStub = createStub('StickyTop')

describe('LogView', () => {
  beforeEach(() => {
    useLogMock.mockReset().mockReturnValue({
      backInit: vi.fn(),
      count: 1,
      clearKeywordSearch: vi.fn(),
      datePickerDefaultTime: [],
      datePickerShortcuts: [],
      finished: false,
      handleCommand: vi.fn(),
      keyword: '',
      loading: false,
      logs: [{ id: 1, message: '日志内容', username: 'alice', time: '2026-04-13T12:00:00Z' }],
      more: false,
      nextPage: vi.fn(),
      searchKeywordInput: '',
      searchUser: '',
      selectedDateRange: [],
      submitKeywordSearch: vi.fn(),
      totalCount: 1,
      users: { items: ['alice'] },
    })
  })

  it('renders the filter toolbar with the shared list-page header style and no missing-state warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    try {
      const LogView = (await import('@/view/log/log.vue')).default
      const wrapper = mount(LogView, {
        global: {
          directives: {
            permission: () => {},
          },
          stubs: {
            StickyTop: StickyTopStub,
            ElInput: ElInputStub,
            ElDropdown: ElDropdownStub,
            ElDropdownMenu: ElDropdownMenuStub,
            ElDropdownItem: ElDropdownItemStub,
            ElDatePicker: ElDatePickerStub,
            ElButton: ElButtonStub,
            ElDivider: ElDividerStub,
            ElIcon: ElIconStub,
            Search: true,
            ArrowDown: true,
            UserFilled: true,
          },
        },
      })

      expect(wrapper.find('.header-left .title').text()).toBe('日志信息')
      expect(wrapper.find('.filter-toolbar').exists()).toBe(true)
      expect(wrapper.find('.header-left .subtitle').exists()).toBe(false)
      expect(wrapper.find('.filter-label').exists()).toBe(false)
      expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Property "count"'))
    } finally {
      warn.mockRestore()
    }
  })
})
