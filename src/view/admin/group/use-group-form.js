import { computed, reactive, ref, toValue, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'

import { createRequiredRule, validateElementForm } from '@/lin/util/form'
import { createGroup, dispatchGroupPermissions, removeGroupPermissions } from '@/model/admin'
import { notifyRequestError } from '@/lin/util/request-error'
import { isFailedResponse, isSuccessfulResponse } from '@/lin/util/response'

import { getPermissionChanges, normalizePermissionIds, parseGroupId } from './group-helpers'

function assertRouter(router) {
  if (!router || typeof router.push !== 'function') {
    throw new Error('Invalid router: expected an object with push()')
  }
}

function assertRoute(route) {
  if (!route || typeof route !== 'object') {
    throw new Error('Invalid route: expected a route object')
  }
}

export function useGroupCreation({
  formRef,
  groupPermissionsRef,
  message = ElMessage,
  notifyError = notifyRequestError,
  router,
} = {}) {
  assertRouter(router)
  const formReference = formRef ?? useTemplateRef('form')
  const permissionPickerRef = groupPermissionsRef ?? useTemplateRef('groupPermissions')
  const loading = ref(false)
  const selectedPermissionIds = ref([])
  const groupDraft = reactive({
    name: '',
    info: '',
  })
  const rules = {
    info: [],
    name: [createRequiredRule('分组名称不能为空', { trigger: ['blur', 'change'] })],
  }

  function resetGroupForm() {
    toValue(formReference)?.resetFields?.()
    selectedPermissionIds.value = []
    toValue(permissionPickerRef)?.getGroupPermissions?.()
  }

  async function submitGroupForm() {
    const isValid = await validateElementForm(toValue(formReference))

    if (!isValid) {
      message.error('请将信息填写完整')
      return
    }

    loading.value = true

    try {
      const response = await createGroup({
        name: groupDraft.name,
        info: groupDraft.info,
        permissionIds: selectedPermissionIds.value,
      })

      if (isSuccessfulResponse(response)) {
        message.success(response.message)
        await router.push('/admin/group/list')
        resetGroupForm()
        return
      }

      message.error(response?.message || '创建分组失败')
    } catch (error) {
      notifyError(message, error, '创建分组失败')
    } finally {
      loading.value = false
    }
  }

  return {
    formRef: formReference,
    groupDraft,
    groupPermissionsRef: permissionPickerRef,
    loading,
    resetGroupForm,
    rules,
    selectedPermissionIds,
    submitGroupForm,
  }
}

export function useGroupPermissionEditor({
  route,
  router,
  message = ElMessage,
  notifyError = notifyRequestError,
} = {}) {
  assertRoute(route)
  if (!router || typeof router.go !== 'function') {
    throw new Error('Invalid router: expected an object with go()')
  }
  const selectedPermissionIds = ref([])
  const cachedPermissionIds = ref([])

  const groupId = computed(() => parseGroupId(toValue(route).query?.id))

  function handlePermissionsLoaded(payload = {}) {
    const { selectedIds = [] } = payload
    const normalizedIds = normalizePermissionIds(selectedIds)
    selectedPermissionIds.value = normalizedIds
    cachedPermissionIds.value = normalizedIds.slice()
  }

  async function applyPermissionChanges() {
    if (!groupId.value) {
      message.error('分组ID无效，无法更新权限')
      return
    }

    selectedPermissionIds.value = normalizePermissionIds(selectedPermissionIds.value)
    cachedPermissionIds.value = normalizePermissionIds(cachedPermissionIds.value)

    const { addPermissions, deletePermissions } = getPermissionChanges(
      selectedPermissionIds.value,
      cachedPermissionIds.value,
    )

    if (!addPermissions.length && !deletePermissions.length) {
      message.warning?.('未检测到权限变更')
      return
    }

    try {
      const operationResults = []

      if (addPermissions.length) {
        operationResults.push({
          fallbackMessage: '新增权限失败',
          result: await dispatchGroupPermissions({
            groupId: groupId.value,
            permissionIds: addPermissions,
          }),
        })
      }

      if (deletePermissions.length) {
        operationResults.push({
          fallbackMessage: '移除权限失败',
          result: await removeGroupPermissions({
            groupId: groupId.value,
            permissionIds: deletePermissions,
          }),
        })
      }

      const firstFailure = operationResults.find(({ result }) => isFailedResponse(result))

      if (firstFailure) {
        message.error(firstFailure.result?.message || firstFailure.fallbackMessage)
        return
      }

      message.success('权限修改成功')
      cachedPermissionIds.value = selectedPermissionIds.value.slice()
    } catch (error) {
      notifyError(message, error, '更新分组权限失败')
    }
  }

  function goBack() {
    router.go(-1)
  }

  return {
    applyPermissionChanges,
    goBack,
    groupId,
    handlePermissionsLoaded,
    selectedPermissionIds,
  }
}
