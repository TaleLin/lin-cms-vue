import { defineComponent, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useGroupList } from '@/view/admin/group/use-group-list'

const createHost = options =>
  defineComponent({
    name: 'UseGroupListHost',
    setup(_, { expose }) {
      const state = useGroupList(options)
      expose(state)
      return () => null
    },
  })

describe('use-group-list', () => {
  it('loads groups on mount, opens edit state, and routes to the permission page', async () => {
    const router = {
      push: vi.fn(),
    }
    const adminModel = {
      deleteGroup: vi.fn(),
      getAllGroups: vi.fn().mockResolvedValue([{ id: 1, name: '管理员', info: '所有权限' }]),
      updateGroup: vi.fn(),
    }
    const Host = createHost({
      adminModel,
      formRef: ref(null),
      message: {
        error: vi.fn(),
        success: vi.fn(),
        warning: vi.fn(),
      },
      messageBox: {
        confirm: vi.fn(),
      },
      router,
    })
    const wrapper = mount(Host)

    await flushPromises()

    expect(adminModel.getAllGroups).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.tableData).toEqual([{ id: 1, name: '管理员', info: '所有权限' }])

    wrapper.vm.handleEdit({ id: 1, name: '管理员', info: '所有权限' })
    expect(wrapper.vm.dialogFormVisible).toBe(true)
    expect(wrapper.vm.group).toEqual({ name: '管理员', info: '所有权限' })

    wrapper.vm.goToGroupEditPage(9)
    expect(router.push).toHaveBeenCalledWith({
      path: '/admin/group/edit',
      query: { id: 9 },
    })
  })

  it('validates and submits group edits only when the content changes', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
    }
    const adminModel = {
      deleteGroup: vi.fn(),
      getAllGroups: vi
        .fn()
        .mockResolvedValueOnce([{ id: 1, name: '管理员', info: '所有权限' }])
        .mockResolvedValueOnce([{ id: 1, name: '编辑组', info: '内容审核' }]),
      updateGroup: vi.fn().mockResolvedValue({
        code: 0,
        message: '更新成功',
      }),
    }
    const Host = createHost({
      adminModel,
      formRef,
      message,
      messageBox: {
        confirm: vi.fn(),
      },
      router: {
        push: vi.fn(),
      },
    })
    const wrapper = mount(Host)

    await flushPromises()

    wrapper.vm.handleEdit({ id: 1, name: '管理员', info: '所有权限' })
    wrapper.vm.group.name = '编辑组'
    wrapper.vm.group.info = '内容审核'

    await expect(wrapper.vm.confirmEdit()).resolves.toBe(true)

    expect(adminModel.updateGroup).toHaveBeenCalledWith({
      id: 1,
      name: '编辑组',
      info: '内容审核',
    })
    expect(adminModel.getAllGroups).toHaveBeenCalledTimes(1)
    expect(message.success).toHaveBeenCalledWith('更新成功')
    expect(wrapper.vm.dialogFormVisible).toBe(false)
    expect(formRef.value.resetFields).toHaveBeenCalledTimes(1)

    wrapper.vm.handleEdit({ id: 2, name: '访客组', info: '只读' })
    await expect(wrapper.vm.confirmEdit()).resolves.toBe(true)
    expect(adminModel.updateGroup).toHaveBeenCalledTimes(1)
  })

  it('blocks invalid edits and surfaces failed update responses', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockRejectedValue(new Error('invalid')),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
    }
    const adminModel = {
      deleteGroup: vi.fn(),
      getAllGroups: vi.fn().mockResolvedValue([]),
      updateGroup: vi
        .fn()
        .mockResolvedValueOnce({ code: 10000, message: '更新失败' })
        .mockRejectedValueOnce(new Error('网络异常')),
    }
    const notifyError = vi.fn()
    const Host = createHost({
      adminModel,
      formRef,
      message,
      messageBox: {
        confirm: vi.fn(),
      },
      notifyError,
      router: {
        push: vi.fn(),
      },
    })
    const wrapper = mount(Host)

    await flushPromises()

    wrapper.vm.handleEdit({ id: 1, name: '管理员', info: '所有权限' })
    await expect(wrapper.vm.confirmEdit()).resolves.toBe(false)
    expect(message.warning).toHaveBeenCalledWith('请将信息填写完整')

    formRef.value.validate.mockResolvedValue(true)
    wrapper.vm.group.info = '更新后'

    await expect(wrapper.vm.confirmEdit()).resolves.toBe(false)
    expect(message.error).toHaveBeenCalledWith('更新失败')

    await expect(wrapper.vm.confirmEdit()).resolves.toBe(false)
    expect(notifyError).toHaveBeenCalledWith(message, expect.any(Error), '更新分组失败')
  })

  it('confirms deletions, reloads on success, and ignores canceled dialogs', async () => {
    const message = {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
    }
    const adminModel = {
      deleteGroup: vi
        .fn()
        .mockResolvedValueOnce({ code: 0, message: '删除成功' })
        .mockResolvedValueOnce({ code: 10000, message: '删除失败' })
        .mockRejectedValueOnce(new Error('网络异常')),
      getAllGroups: vi
        .fn()
        .mockResolvedValueOnce([{ id: 1, name: '管理员', info: '所有权限' }])
        .mockResolvedValueOnce([{ id: 2, name: '编辑组', info: '内容审核' }]),
      updateGroup: vi.fn(),
    }
    const messageBox = {
      confirm: vi
        .fn()
        .mockRejectedValueOnce(new Error('cancel'))
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined),
    }
    const notifyError = vi.fn()
    const Host = createHost({
      adminModel,
      formRef: ref(null),
      message,
      messageBox,
      notifyError,
      router: {
        push: vi.fn(),
      },
    })
    const wrapper = mount(Host)

    await flushPromises()

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(false)
    expect(adminModel.deleteGroup).not.toHaveBeenCalled()

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(true)
    expect(adminModel.deleteGroup).toHaveBeenCalledWith(1)
    expect(adminModel.getAllGroups).toHaveBeenCalledTimes(2)
    expect(message.success).toHaveBeenCalledWith('删除成功')

    await expect(wrapper.vm.handleDelete(2)).resolves.toBe(false)
    expect(message.error).toHaveBeenCalledWith('删除失败')

    await expect(wrapper.vm.handleDelete(3)).resolves.toBe(false)
    expect(notifyError).toHaveBeenCalledWith(message, expect.any(Error), '删除分组失败')
  })
})
