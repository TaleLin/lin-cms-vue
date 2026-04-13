import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { MAX_SUCCESS_CODE } from '@/config/global'
import { deleteUser, getAdminUsers, getAllGroups } from '@/model/admin'
import { notifyRequestError } from '@/lin/util/request-error'

import { createUserDetailDraft, mapUserRows, populateUserDetailDraft, shouldMoveToPreviousPage } from './user-helpers'

const defaultAdminModel = {
  deleteUser,
  getAdminUsers,
  getAllGroups,
}

export function useUserTable({
  adminModel = defaultAdminModel,
  message = ElMessage,
  messageBox = ElMessageBox,
  notifyError = notifyRequestError,
} = {}) {
  const pageSize = ref(10)
  const userRows = ref([])
  const selectedGroupId = ref(null)
  const loading = ref(false)
  const total = ref(0)
  const currentPage = ref(1)

  async function fetchUsers() {
    try {
      loading.value = true
      const response = await adminModel.getAdminUsers({
        groupId: selectedGroupId.value,
        count: pageSize.value,
        page: currentPage.value - 1,
      })
      userRows.value = mapUserRows(response.items)
      total.value = response.total
    } catch (error) {
      notifyError(message, error, '获取用户列表失败')
    } finally {
      loading.value = false
    }
  }

  async function fetchGroups() {
    try {
      loading.value = true
      const allGroups = await adminModel.getAllGroups()
      return allGroups
    } catch (error) {
      notifyError(message, error, '获取分组列表失败')
      return []
    } finally {
      loading.value = false
    }
  }

  async function handleGroupChange() {
    currentPage.value = 1
    await fetchUsers()
  }

  async function handlePageChange(page) {
    currentPage.value = page
    await fetchUsers()
  }

  async function handleDelete(targetUserId) {
    try {
      await messageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return false
    }

    loading.value = true

    try {
      const response = await adminModel.deleteUser(targetUserId)

      if (response.code < MAX_SUCCESS_CODE) {
        if (shouldMoveToPreviousPage(total.value, pageSize.value, currentPage.value)) {
          currentPage.value -= 1
        }

        await fetchUsers()
        message.success(response.message)
        return true
      }

      message.error(response.message)
      return false
    } catch (error) {
      notifyError(message, error, '删除用户失败')
      return false
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void fetchUsers()
  })

  return {
    currentPage,
    fetchGroups,
    fetchUsers,
    handleDelete,
    handleGroupChange,
    handlePageChange,
    loading,
    pageSize,
    selectedGroupId,
    total,
    userRows,
  }
}

export function useUserEdit({ userInfoFormRef, userPasswordFormRef } = {}) {
  const isDialogVisible = ref(false)
  const selectedUserId = ref(null)
  const activeTabName = ref('修改信息')
  const selectedUser = reactive(createUserDetailDraft())

  function openEditDialog(row) {
    selectedUserId.value = row.id
    populateUserDetailDraft(selectedUser, row)
    isDialogVisible.value = true
  }

  async function confirmEdit() {
    if (activeTabName.value === '修改信息') {
      await userInfoFormRef?.value?.submitForm?.()
      return
    }

    await userPasswordFormRef?.value?.submitForm?.()
  }

  function handleClose(done) {
    isDialogVisible.value = false
    userPasswordFormRef?.value?.resetForm?.()
    activeTabName.value = '修改信息'
    done?.()
  }

  function handleTabChange(tab) {
    activeTabName.value = tab?.props?.name ?? tab ?? '修改信息'
  }

  function resetForm() {
    if (activeTabName.value === '修改信息') {
      userInfoFormRef?.value?.resetForm?.()
      return
    }

    userPasswordFormRef?.value?.resetForm?.()
  }

  function handleInfoSubmitted(submitted) {
    isDialogVisible.value = false
    return submitted
  }

  function handlePasswordSubmitted(submitted) {
    if (submitted === true) {
      isDialogVisible.value = false
    }
  }

  return {
    activeTabName,
    confirmEdit,
    handleClose,
    handleInfoSubmitted,
    handlePasswordSubmitted,
    handleTabChange,
    isDialogVisible,
    openEditDialog,
    resetForm,
    selectedUser,
    selectedUserId,
  }
}

export function useUserList(options) {
  const tableState = useUserTable(options)
  const editState = useUserEdit(options)

  return {
    ...tableState,
    ...editState,
  }
}
