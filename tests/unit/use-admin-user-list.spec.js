import { defineComponent, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useUserList } from '@/view/admin/user/use-user-list'

const createHost = options =>
  defineComponent({
    name: 'UseAdminUserListHost',
    setup(_, { expose }) {
      const state = useUserList(options)
      expose(state)
      return () => null
    },
  })

function createMessage() {
  return {
    error: vi.fn(),
    success: vi.fn(),
  }
}

describe('use-user-list', () => {
  it('loads users on mount, supports filtering, and opens the edit dialog', async () => {
    const adminModel = {
      deleteUser: vi.fn(),
      getAdminUsers: vi
        .fn()
        .mockResolvedValueOnce({
          items: [
            {
              id: 1,
              username: 'alice',
              email: 'alice@example.com',
              groups: [{ id: 2, name: '编辑组' }],
            },
          ],
          total: 1,
        })
        .mockResolvedValueOnce({
          items: [
            {
              id: 2,
              username: 'bob',
              email: 'bob@example.com',
              groups: [{ id: 3, name: '访客组' }],
            },
          ],
          total: 1,
        }),
      getAllGroups: vi.fn().mockResolvedValue([{ id: 2, name: '编辑组' }]),
    }
    const wrapper = mount(
      createHost({
        adminModel,
        message: createMessage(),
        messageBox: {
          confirm: vi.fn(),
        },
        userInfoFormRef: ref(null),
        userPasswordFormRef: ref(null),
      }),
    )

    await flushPromises()

    expect(adminModel.getAdminUsers).toHaveBeenNthCalledWith(1, {
      groupId: null,
      count: 10,
      page: 0,
    })
    expect(wrapper.vm.userRows).toEqual([
      {
        id: 1,
        username: 'alice',
        email: 'alice@example.com',
        groups: [{ id: 2, name: '编辑组' }],
        groupNames: '编辑组',
      },
    ])

    wrapper.vm.selectedGroupId = 2
    await wrapper.vm.handleGroupChange()

    expect(adminModel.getAdminUsers).toHaveBeenNthCalledWith(2, {
      groupId: 2,
      count: 10,
      page: 0,
    })
    expect(wrapper.vm.userRows[0].username).toBe('bob')

    wrapper.vm.openEditDialog({
      id: 9,
      username: 'carol',
      email: 'carol@example.com',
      groups: [{ id: 5, name: '运营组' }],
    })

    expect(wrapper.vm.selectedUserId).toBe(9)
    expect(wrapper.vm.isDialogVisible).toBe(true)
    expect(wrapper.vm.selectedUser).toEqual({
      username: 'carol',
      email: 'carol@example.com',
      groups: [{ id: 5, name: '运营组' }],
    })
  })

  it('delegates dialog actions to the active form and resets the dialog state on close', async () => {
    const userInfoFormRef = ref({
      resetForm: vi.fn(),
      submitForm: vi.fn().mockResolvedValue(undefined),
    })
    const userPasswordFormRef = ref({
      resetForm: vi.fn(),
      submitForm: vi.fn().mockResolvedValue(undefined),
    })
    const wrapper = mount(
      createHost({
        adminModel: {
          deleteUser: vi.fn(),
          getAdminUsers: vi.fn().mockResolvedValue({ items: [], total: 0 }),
          getAllGroups: vi.fn().mockResolvedValue([]),
        },
        message: createMessage(),
        messageBox: {
          confirm: vi.fn(),
        },
        userInfoFormRef,
        userPasswordFormRef,
      }),
    )

    await flushPromises()

    await wrapper.vm.confirmEdit()
    expect(userInfoFormRef.value.submitForm).toHaveBeenCalledTimes(1)

    wrapper.vm.handleTabChange({ props: { name: '修改密码' } })
    await wrapper.vm.confirmEdit()
    expect(userPasswordFormRef.value.submitForm).toHaveBeenCalledTimes(1)

    wrapper.vm.resetForm()
    expect(userPasswordFormRef.value.resetForm).toHaveBeenCalledTimes(1)

    const done = vi.fn()
    wrapper.vm.handleClose(done)

    expect(wrapper.vm.isDialogVisible).toBe(false)
    expect(wrapper.vm.activeTabName).toBe('修改信息')
    expect(userPasswordFormRef.value.resetForm).toHaveBeenCalledTimes(2)
    expect(done).toHaveBeenCalledTimes(1)
  })

  it('closes dialog on info submit and deletes while moving back a page when needed', async () => {
    const message = createMessage()
    const adminModel = {
      deleteUser: vi.fn().mockResolvedValue({
        code: 0,
        message: '删除成功',
      }),
      getAdminUsers: vi
        .fn()
        .mockResolvedValueOnce({
          items: [{ id: 1, username: 'alice', email: 'alice@example.com', groups: [] }],
          total: 11,
        })
        .mockResolvedValueOnce({
          items: [{ id: 2, username: 'bob', email: 'bob@example.com', groups: [] }],
          total: 11,
        })
        .mockResolvedValueOnce({
          items: [{ id: 3, username: 'carol', email: 'carol@example.com', groups: [] }],
          total: 10,
        }),
      getAllGroups: vi.fn().mockResolvedValue([]),
    }
    const wrapper = mount(
      createHost({
        adminModel,
        message,
        messageBox: {
          confirm: vi.fn().mockResolvedValue(undefined),
        },
        userInfoFormRef: ref(null),
        userPasswordFormRef: ref(null),
      }),
    )

    await flushPromises()

    wrapper.vm.isDialogVisible = true
    const submitted = wrapper.vm.handleInfoSubmitted(true)

    expect(wrapper.vm.isDialogVisible).toBe(false)
    expect(submitted).toBe(true)

    wrapper.vm.isDialogVisible = true
    wrapper.vm.handlePasswordSubmitted(true)
    expect(wrapper.vm.isDialogVisible).toBe(false)

    wrapper.vm.currentPage = 2
    wrapper.vm.total = 11
    await expect(wrapper.vm.handleDelete(8)).resolves.toBe(true)

    expect(adminModel.deleteUser).toHaveBeenCalledWith(8)
    expect(wrapper.vm.currentPage).toBe(1)
    expect(adminModel.getAdminUsers).toHaveBeenCalledTimes(2)
    expect(adminModel.getAdminUsers).toHaveBeenLastCalledWith({
      groupId: null,
      count: 10,
      page: 0,
    })
    expect(message.success).toHaveBeenCalledWith('删除成功')
  })

  it('ignores canceled deletions and surfaces failed delete requests', async () => {
    const message = createMessage()
    const notifyError = vi.fn()
    const adminModel = {
      deleteUser: vi
        .fn()
        .mockResolvedValueOnce({ code: 10000, message: '删除失败' })
        .mockRejectedValueOnce(new Error('network')),
      getAdminUsers: vi.fn().mockResolvedValue({ items: [], total: 0 }),
      getAllGroups: vi.fn().mockResolvedValue([]),
    }
    const messageBox = {
      confirm: vi
        .fn()
        .mockRejectedValueOnce(new Error('cancel'))
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined),
    }
    const wrapper = mount(
      createHost({
        adminModel,
        message,
        messageBox,
        notifyError,
        userInfoFormRef: ref(null),
        userPasswordFormRef: ref(null),
      }),
    )

    await flushPromises()

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(false)
    expect(adminModel.deleteUser).not.toHaveBeenCalled()

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(false)
    expect(message.error).toHaveBeenCalledWith('删除失败')

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(false)
    expect(notifyError).toHaveBeenCalledWith(message, expect.any(Error), '删除用户失败')
  })
})
