import { onMounted, reactive, ref, toValue } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { createRequiredRule, validateElementForm } from '@/lin/util/form'
import { deleteGroup, getAllGroups, updateGroup } from '@/model/admin'
import { notifyRequestError } from '@/lin/util/request-error'
import { isSuccessfulResponse } from '@/lin/util/response'

import { assignGroupDraft, buildGroupEditRoute, createGroupDraft, hasGroupInfoChanged } from './group-helpers'

const defaultAdminModel = {
  deleteGroup,
  getAllGroups,
  updateGroup,
}

function assertRouter(router) {
  if (!router || typeof router.push !== 'function') {
    throw new Error('Invalid router: expected an object with push()')
  }
}

function assertTemplateRef(templateRef, fieldName) {
  if (!templateRef || typeof templateRef !== 'object' || !('value' in templateRef)) {
    throw new Error(`Invalid ${fieldName}: expected a template ref`)
  }
}

export function useGroupTable({
  adminModel = defaultAdminModel,
  message = ElMessage,
  messageBox = ElMessageBox,
  notifyError = notifyRequestError,
} = {}) {
  const loading = ref(false)
  const tableData = ref([])

  async function fetchGroups() {
    try {
      loading.value = true
      tableData.value = await adminModel.getAllGroups()
    } catch (error) {
      notifyError(message, error, '获取分组列表失败')
    } finally {
      loading.value = false
    }
  }

  async function handleDelete(targetGroupId) {
    try {
      await messageBox.confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return false
    }

    loading.value = true

    try {
      const res = await adminModel.deleteGroup(targetGroupId)

      if (isSuccessfulResponse(res)) {
        await fetchGroups()
        message.success(res.message)
        return true
      }

      message.error(res.message)
      return false
    } catch (error) {
      notifyError(message, error, '删除分组失败')
      return false
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    void fetchGroups()
  })

  return {
    fetchGroups,
    handleDelete,
    loading,
    tableData,
  }
}

export function useGroupEdit({
  formRef,
  router,
  adminModel = defaultAdminModel,
  message = ElMessage,
  notifyError = notifyRequestError,
} = {}) {
  assertTemplateRef(formRef, 'formRef')
  assertRouter(router)
  const dialogFormVisible = ref(false)
  const groupId = ref(0)
  const group = reactive(createGroupDraft())
  const cachedGroup = ref(createGroupDraft())
  const rules = {
    info: [],
    name: [createRequiredRule('分组名称不能为空', { trigger: ['blur', 'change'] })],
  }

  function handleEdit(row) {
    groupId.value = row.id
    assignGroupDraft(group, row)
    cachedGroup.value = { ...group }
    dialogFormVisible.value = true
  }

  function resetForm() {
    toValue(formRef)?.resetFields?.()
  }

  function closeDialog() {
    dialogFormVisible.value = false
    resetForm()
  }

  async function confirmEdit() {
    const valid = await validateElementForm(toValue(formRef))

    if (!valid) {
      message.warning('请将信息填写完整')
      return false
    }

    if (hasGroupInfoChanged(group, cachedGroup.value)) {
      try {
        const res = await adminModel.updateGroup({
          id: groupId.value,
          name: group.name,
          info: group.info,
        })

        if (isSuccessfulResponse(res)) {
          message.success(res.message)
        } else {
          message.error(res.message)
          return false
        }
      } catch (error) {
        notifyError(message, error, '更新分组失败')
        return false
      }
    }

    closeDialog()
    return true
  }

  function handleClose(done) {
    closeDialog()
    done?.()
  }

  function rowDoubleClick(row) {
    handleEdit(row)
  }

  function goToGroupEditPage(nextGroupId) {
    router.push(buildGroupEditRoute(nextGroupId))
  }

  return {
    confirmEdit,
    dialogFormVisible,
    goToGroupEditPage,
    group,
    groupId,
    handleClose,
    handleEdit,
    resetForm,
    rowDoubleClick,
    rules,
  }
}

export function useGroupList(options) {
  const tableState = useGroupTable(options)
  const editState = useGroupEdit(options)

  return {
    ...tableState,
    ...editState,
  }
}
