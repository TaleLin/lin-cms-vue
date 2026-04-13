import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useUserCreate } from '@/view/admin/user/use-user-create'

const createHost = options =>
  defineComponent({
    name: 'UseUserCreateHost',
    setup(_, { expose }) {
      const state = useUserCreate(options)
      expose(state)
      return () => null
    },
  })

describe('use-user-create', () => {
  it('loads group options on mount', async () => {
    const adminModel = {
      getAllGroups: vi.fn().mockResolvedValue([
        { id: 1, name: '管理员' },
        { id: 2, name: '编辑组' },
      ]),
    }
    const wrapper = mount(
      createHost({
        adminModel,
        message: {
          error: vi.fn(),
        },
      }),
    )

    await flushPromises()

    expect(adminModel.getAllGroups).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.allGroups).toEqual([
      { id: 1, name: '管理员' },
      { id: 2, name: '编辑组' },
    ])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('surfaces request failures through the shared request-error handler', async () => {
    const error = new Error('network')
    const notifyError = vi.fn()
    const message = {
      error: vi.fn(),
    }
    const wrapper = mount(
      createHost({
        adminModel: {
          getAllGroups: vi.fn().mockRejectedValue(error),
        },
        message,
        notifyError,
      }),
    )

    await flushPromises()

    expect(wrapper.vm.allGroups).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
    expect(notifyError).toHaveBeenCalledWith(message, error, '获取分组列表失败')
  })
})
