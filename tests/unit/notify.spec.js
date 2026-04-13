import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import LinNotify from '@/component/notify/notify.vue'

const ElDropdownStub = defineComponent({
  name: 'ElDropdown',
  props: {
    trigger: {
      type: String,
      default: 'hover',
    },
    placement: {
      type: String,
      default: '',
    },
    hideOnClick: {
      type: Boolean,
      default: true,
    },
  },
  template: `
    <div
      class="dropdown-stub"
      :data-trigger="trigger"
      :data-placement="placement"
      :data-hide-on-click="String(hideOnClick)"
    >
      <slot />
      <slot name="dropdown" />
    </div>
  `,
})

const ElBadgeStub = defineComponent({
  name: 'ElBadge',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      default: 99,
    },
    isDot: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <div
      class="badge-stub"
      :data-value="String(value)"
      :data-hidden="String(hidden)"
      :data-max="String(max)"
      :data-is-dot="String(isDot)"
    >
      <slot />
    </div>
  `,
})

const ElIconStub = defineComponent({
  name: 'ElIcon',
  template: '<span class="icon-stub"><slot /></span>',
})

const ElDropdownMenuStub = defineComponent({
  name: 'ElDropdownMenu',
  template: '<div class="dropdown-menu-stub"><slot /></div>',
})

const ElDropdownItemStub = defineComponent({
  name: 'ElDropdownItem',
  emits: ['click'],
  template: '<div class="dropdown-item-stub" @click="$emit(\'click\')"><slot /></div>',
})

const NotifyIconStub = defineComponent({
  name: 'NotifyIconStub',
  template: '<span class="notify-icon-stub" />',
})

describe('LinNotify', () => {
  it('renders mapped message fields and re-emits notification actions', async () => {
    const wrapper = mount(LinNotify, {
      props: {
        trigger: 'click',
        placement: 'bottom-end',
        hideOnClick: false,
        value: 3,
        hidden: false,
        max: 9,
        isDot: true,
        height: 260,
        icon: NotifyIconStub,
        fieldMap: {
          user: 'operator',
          is_read: 'read',
          content: 'text',
          time: 'createdAt',
        },
        messages: [
          {
            id: 1,
            operator: 'alice',
            read: false,
            text: '创建了一本图书',
            createdAt: '2026-04-11 20:00:00',
          },
        ],
      },
      global: {
        stubs: {
          ElDropdown: ElDropdownStub,
          ElBadge: ElBadgeStub,
          ElIcon: ElIconStub,
          ElDropdownMenu: ElDropdownMenuStub,
          ElDropdownItem: ElDropdownItemStub,
        },
      },
    })

    expect(wrapper.get('.dropdown-stub').attributes('data-trigger')).toBe('click')
    expect(wrapper.get('.dropdown-stub').attributes('data-placement')).toBe('bottom-end')
    expect(wrapper.get('.dropdown-stub').attributes('data-hide-on-click')).toBe('false')
    expect(wrapper.get('.badge-stub').attributes('data-value')).toBe('3')
    expect(wrapper.get('.badge-stub').attributes('data-hidden')).toBe('false')
    expect(wrapper.get('.badge-stub').attributes('data-max')).toBe('9')
    expect(wrapper.get('.badge-stub').attributes('data-is-dot')).toBe('true')
    expect(wrapper.find('.notify-icon-stub').exists()).toBe(true)
    expect(wrapper.text()).toContain('创建了一本图书')
    expect(wrapper.text()).toContain('alice')
    expect(wrapper.text()).toContain('2026-04-11 20:00:00')
    expect(wrapper.find('.notify-message--unread').exists()).toBe(true)

    await wrapper.get('.notify-title__action').trigger('click')
    await wrapper.get('.dropdown-item-stub').trigger('click')
    await wrapper.get('.notify-footer__action').trigger('click')

    expect(wrapper.emitted('readAll')).toEqual([[]])
    expect(wrapper.emitted('readMessage')).toEqual([
      [
        {
          id: 1,
          operator: 'alice',
          read: false,
          text: '创建了一本图书',
          createdAt: '2026-04-11 20:00:00',
        },
        0,
      ],
    ])
    expect(wrapper.emitted('viewAll')).toEqual([[]])
  })

  it('renders empty state and normalizes numeric string heights with the default field contract', () => {
    const wrapper = mount(LinNotify, {
      props: {
        height: '240',
        hidden: true,
        messages: [],
      },
      global: {
        stubs: {
          ElDropdown: ElDropdownStub,
          ElBadge: ElBadgeStub,
          ElIcon: ElIconStub,
          ElDropdownMenu: ElDropdownMenuStub,
          ElDropdownItem: ElDropdownItemStub,
        },
      },
    })

    expect(wrapper.get('.badge-stub').attributes('data-hidden')).toBe('true')
    expect(wrapper.get('.notify-empty').attributes('style')).toContain('min-height: 240px;')
    expect(wrapper.get('.notify-empty').attributes('style')).toContain('max-height: 240px;')
    expect(wrapper.text()).toContain('还没有消息')
    expect(wrapper.findAll('.dropdown-item-stub')).toHaveLength(0)
  })

  it('uses the prop defaults as the single source for empty-state rendering', () => {
    const wrapper = mount(LinNotify, {
      global: {
        stubs: {
          ElDropdown: ElDropdownStub,
          ElBadge: ElBadgeStub,
          ElIcon: ElIconStub,
          ElDropdownMenu: ElDropdownMenuStub,
          ElDropdownItem: ElDropdownItemStub,
        },
      },
    })

    expect(wrapper.get('.notify-empty').attributes('style')).toContain('min-height: 200px;')
    expect(wrapper.get('.notify-empty').attributes('style')).toContain('max-height: 200px;')
    expect(wrapper.text()).toContain('还没有消息')
    expect(wrapper.findAll('.dropdown-item-stub')).toHaveLength(0)
  })

  it('uses default message fields, alternate key fallbacks, and custom slots', () => {
    const wrapper = mount(LinNotify, {
      props: {
        height: '18rem',
        messages: [
          {
            messageId: 'm-1',
            user: 'bob',
            is_read: true,
            content: '第一条消息',
            time: '2026-04-12 10:00:00',
          },
          {
            user: 'carol',
            is_read: false,
            content: '第二条消息',
            time: '2026-04-12 11:00:00',
          },
          {
            user: 'dave',
            is_read: false,
            content: '第三条消息',
          },
        ],
      },
      slots: {
        default: ({ row }) => `自定义: ${row.content}`,
      },
      global: {
        stubs: {
          ElDropdown: ElDropdownStub,
          ElBadge: ElBadgeStub,
          ElIcon: ElIconStub,
          ElDropdownMenu: ElDropdownMenuStub,
          ElDropdownItem: ElDropdownItemStub,
        },
      },
    })

    expect(wrapper.get('.notify-panel').attributes('style')).toContain('min-height: 18rem;')
    expect(wrapper.get('.notify-panel').attributes('style')).toContain('max-height: 18rem;')
    expect(wrapper.text()).toContain('自定义: 第一条消息')
    expect(wrapper.text()).toContain('自定义: 第二条消息')
    expect(wrapper.text()).toContain('自定义: 第三条消息')
    expect(wrapper.find('.notify-message').exists()).toBe(false)
    expect(wrapper.findAll('.dropdown-item-stub')).toHaveLength(3)
  })
})
