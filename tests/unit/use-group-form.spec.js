import { ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const createGroup = vi.fn()
const dispatchGroupPermissions = vi.fn()
const removeGroupPermissions = vi.fn()
const validateGroupForm = vi.fn()

vi.mock('@/model/admin', () => ({
  createGroup,
  dispatchGroupPermissions,
  removeGroupPermissions,
}))

vi.mock('@/lin/util/request-error', () => ({
  notifyRequestError: vi.fn(),
}))

vi.mock('@/view/admin/group/group-helpers', async () => {
  const actual = await vi.importActual('@/view/admin/group/group-helpers')

  return {
    ...actual,
    createGroupRules: () => ({}),
    validateGroupForm,
  }
})

const { useGroupCreation, useGroupPermissionEditor } = await import('@/view/admin/group/use-group-form')

describe('useGroupCreation', () => {
  beforeEach(() => {
    createGroup.mockReset()
    dispatchGroupPermissions.mockReset()
    removeGroupPermissions.mockReset()
    validateGroupForm.mockReset()
  })

  it('shows an error when validation fails and skips the request', async () => {
    validateGroupForm.mockResolvedValue(false)
    const formRef = ref({ resetFields: vi.fn() })
    const groupPermissionsRef = ref({ getGroupPermissions: vi.fn() })
    const message = { error: vi.fn(), success: vi.fn() }

    const { submitGroupForm } = useGroupCreation({
      formRef,
      groupPermissionsRef,
      message,
      router: { push: vi.fn() },
    })

    await submitGroupForm()

    expect(message.error).toHaveBeenCalledWith('请将信息填写完整')
    expect(createGroup).not.toHaveBeenCalled()
  })

  it('creates a group, resets the form, and navigates back on success', async () => {
    validateGroupForm.mockResolvedValue(true)
    createGroup.mockResolvedValue({ code: 0, message: '创建成功' })
    const formRef = ref({ resetFields: vi.fn() })
    const groupPermissionsRef = ref({ getGroupPermissions: vi.fn() })
    const router = { push: vi.fn() }
    const message = { error: vi.fn(), success: vi.fn() }

    const { groupDraft, selectedPermissionIds, submitGroupForm } = useGroupCreation({
      formRef,
      groupPermissionsRef,
      message,
      router,
    })

    groupDraft.name = '前端组'
    groupDraft.info = '留存典型权限'
    selectedPermissionIds.value = [1, 3]

    await submitGroupForm()

    expect(createGroup).toHaveBeenCalledWith({
      name: '前端组',
      info: '留存典型权限',
      permissionIds: [1, 3],
    })
    expect(message.success).toHaveBeenCalledWith('创建成功')
    expect(router.push).toHaveBeenCalledWith('/admin/group/list')
    expect(formRef.value.resetFields).toHaveBeenCalled()
    expect(groupPermissionsRef.value.getGroupPermissions).toHaveBeenCalled()
    expect(selectedPermissionIds.value).toHaveLength(0)
  })

  it('shows a clear error when create returns a failed response code', async () => {
    validateGroupForm.mockResolvedValue(true)
    createGroup.mockResolvedValue({ code: 10000, message: '创建失败' })
    const message = { error: vi.fn(), success: vi.fn() }

    const { submitGroupForm } = useGroupCreation({
      formRef: ref({ resetFields: vi.fn() }),
      groupPermissionsRef: ref({ getGroupPermissions: vi.fn() }),
      message,
      router: { push: vi.fn() },
    })

    await submitGroupForm()

    expect(message.error).toHaveBeenCalledWith('创建失败')
    expect(message.success).not.toHaveBeenCalled()
  })
})

describe('useGroupPermissionEditor', () => {
  beforeEach(() => {
    dispatchGroupPermissions.mockReset()
    removeGroupPermissions.mockReset()
  })

  it('applies adds and deletes and reports success', async () => {
    dispatchGroupPermissions.mockResolvedValue({ code: 0 })
    removeGroupPermissions.mockResolvedValue({ code: 0 })
    const message = { error: vi.fn(), success: vi.fn(), warning: vi.fn() }
    const notifyError = vi.fn()
    const route = { query: { id: '7' } }
    const router = { go: vi.fn() }

    const { handlePermissionsLoaded, applyPermissionChanges, selectedPermissionIds } = useGroupPermissionEditor({
      route,
      router,
      message,
      notifyError,
    })

    handlePermissionsLoaded({ selectedIds: [1, 2] })
    selectedPermissionIds.value = [2, 3]

    await applyPermissionChanges()

    expect(dispatchGroupPermissions).toHaveBeenCalledWith({ groupId: 7, permissionIds: [3] })
    expect(removeGroupPermissions).toHaveBeenCalledWith({ groupId: 7, permissionIds: [1] })
    expect(message.success).toHaveBeenCalledWith('权限修改成功')
  })

  it('normalizes permission ids before submitting changes', async () => {
    dispatchGroupPermissions.mockResolvedValue({ code: 0 })
    const message = { error: vi.fn(), success: vi.fn(), warning: vi.fn() }

    const { handlePermissionsLoaded, applyPermissionChanges, selectedPermissionIds } = useGroupPermissionEditor({
      route: { query: { id: '7' } },
      router: { go: vi.fn() },
      message,
      notifyError: vi.fn(),
    })

    handlePermissionsLoaded({ selectedIds: [1, '2', '2', 'x'] })
    selectedPermissionIds.value = [1, '2', 3, '3', null]

    await applyPermissionChanges()

    expect(dispatchGroupPermissions).toHaveBeenCalledWith({ groupId: 7, permissionIds: [3] })
  })

  it('blocks submission when group id is invalid', async () => {
    const message = { error: vi.fn(), success: vi.fn(), warning: vi.fn() }

    const { applyPermissionChanges } = useGroupPermissionEditor({
      route: { query: { id: '7abc' } },
      router: { go: vi.fn() },
      message,
      notifyError: vi.fn(),
    })

    await applyPermissionChanges()

    expect(message.error).toHaveBeenCalledWith('分组ID无效，无法更新权限')
    expect(dispatchGroupPermissions).not.toHaveBeenCalled()
    expect(removeGroupPermissions).not.toHaveBeenCalled()
  })

  it('shows warning and skips requests when there are no permission changes', async () => {
    const message = { error: vi.fn(), success: vi.fn(), warning: vi.fn() }

    const { handlePermissionsLoaded, applyPermissionChanges } = useGroupPermissionEditor({
      route: { query: { id: '9' } },
      router: { go: vi.fn() },
      message,
      notifyError: vi.fn(),
    })

    handlePermissionsLoaded({ selectedIds: [1, 2] })
    await applyPermissionChanges()

    expect(message.warning).toHaveBeenCalledWith('未检测到权限变更')
    expect(dispatchGroupPermissions).not.toHaveBeenCalled()
    expect(removeGroupPermissions).not.toHaveBeenCalled()
  })

  it('shows response message when permission update returns a failed code', async () => {
    dispatchGroupPermissions.mockResolvedValue({ code: 10000, message: '新增失败' })
    const message = { error: vi.fn(), success: vi.fn(), warning: vi.fn() }

    const { handlePermissionsLoaded, applyPermissionChanges, selectedPermissionIds } = useGroupPermissionEditor({
      route: { query: { id: '11' } },
      router: { go: vi.fn() },
      message,
      notifyError: vi.fn(),
    })

    handlePermissionsLoaded({ selectedIds: [] })
    selectedPermissionIds.value = [3]
    await applyPermissionChanges()

    expect(message.error).toHaveBeenCalledWith('新增失败')
    expect(message.success).not.toHaveBeenCalled()
    expect(removeGroupPermissions).not.toHaveBeenCalled()
  })

  it('notifies on request failure', async () => {
    dispatchGroupPermissions.mockRejectedValue(new Error('boom'))
    const notifyError = vi.fn()
    const route = { query: { id: '8' } }

    const router = { go: vi.fn() }
    const { handlePermissionsLoaded, applyPermissionChanges, selectedPermissionIds } = useGroupPermissionEditor({
      route,
      router,
      notifyError,
    })

    handlePermissionsLoaded({ selectedIds: [5] })
    selectedPermissionIds.value = [6]
    await applyPermissionChanges()

    expect(notifyError).toHaveBeenCalled()
  })
})
