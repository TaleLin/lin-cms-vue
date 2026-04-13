import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getAllPermissions, getGroup, notifyRequestError } = vi.hoisted(() => ({
  getAllPermissions: vi.fn(),
  getGroup: vi.fn(),
  notifyRequestError: vi.fn(),
}))

vi.mock('@/model/admin', () => ({
  getAllPermissions,
  getGroup,
}))

vi.mock('@/lin/util/request-error', () => ({
  notifyRequestError,
}))

const { useGroupPermissions } = await import('@/view/admin/group/use-group-permissions')

const createHost = options =>
  defineComponent({
    name: 'UseGroupPermissionsHost',
    setup(_, { expose }) {
      const state = useGroupPermissions(options.id, options.config)
      expose(state)
      return () => null
    },
  })

describe('use-group-permissions', () => {
  beforeEach(() => {
    getAllPermissions.mockReset()
    getGroup.mockReset()
    notifyRequestError.mockReset()
  })

  it('blocks invalid group id and keeps selection state empty', async () => {
    const allPermissions = {
      图书: [{ id: 1, name: '查看图书' }],
    }
    const message = {
      error: vi.fn(),
    }
    const onLoaded = vi.fn()
    const syncSelectedIds = vi.fn()
    getAllPermissions.mockResolvedValue(allPermissions)

    const Host = createHost({
      id: () => '7abc',
      config: {
        message,
        onLoaded,
        syncSelectedIds,
      },
    })
    const wrapper = mount(Host)
    await flushPromises()

    expect(getAllPermissions).toHaveBeenCalledTimes(1)
    expect(getGroup).not.toHaveBeenCalled()
    expect(message.error).toHaveBeenCalledWith('分组ID无效，无法加载已有权限')
    expect(syncSelectedIds).toHaveBeenCalledWith([])
    expect(onLoaded).toHaveBeenCalledWith({
      allPermissions,
      selectedIds: [],
    })
    expect(wrapper.vm.permissionModuleIds).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('loads current group permissions and normalizes duplicate ids', async () => {
    getAllPermissions.mockResolvedValue({
      图书: [
        { id: 1, name: '查看图书' },
        { id: 2, name: '删除图书' },
      ],
    })
    getGroup.mockResolvedValue({
      permissions: [
        { id: 1, name: '查看图书', module: '图书' },
        { id: '1', name: '查看图书', module: '图书' },
        { id: '2', name: '删除图书', module: '图书' },
      ],
    })
    const syncSelectedIds = vi.fn()

    const Host = createHost({
      id: () => '9',
      config: {
        message: {
          error: vi.fn(),
        },
        syncSelectedIds,
      },
    })
    const wrapper = mount(Host)
    await flushPromises()

    expect(getGroup).toHaveBeenCalledWith(9)
    expect(wrapper.vm.permissionModuleIds).toEqual([1, 2])
    expect(syncSelectedIds).toHaveBeenLastCalledWith([1, 2])
  })

  it('forwards request failures to unified error notifier', async () => {
    const message = {
      error: vi.fn(),
    }
    getAllPermissions.mockRejectedValue(new Error('boom'))

    const Host = createHost({
      id: () => undefined,
      config: { message },
    })
    mount(Host)
    await flushPromises()

    expect(notifyRequestError).toHaveBeenCalledWith(message, expect.any(Error), '获取权限列表失败')
  })
})
