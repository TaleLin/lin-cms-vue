import { onMounted, ref, toValue } from 'vue'
import { ElMessage } from 'element-plus'

import { getAllPermissions, getGroup } from '@/model/admin'
import { notifyRequestError } from '@/lin/util/request-error'

import {
  createPermissionSelectionState,
  normalizePermissionIds,
  parseGroupId,
  togglePermissionItem,
  togglePermissionModule,
} from './group-helpers'

export function useGroupPermissions(id, { onLoaded, syncSelectedIds, message = ElMessage } = {}) {
  const loading = ref(false)
  const allPermissions = ref({})
  const halfPermissions = ref([])
  const permissionModuleIds = ref([])
  const permissionModuleNames = ref([])
  const checkedPermissionNames = ref([])

  function applyPermissionState(nextState) {
    halfPermissions.value = nextState.halfPermissions
    permissionModuleIds.value = nextState.permissionModuleIds
    permissionModuleNames.value = nextState.permissionModuleNames
    checkedPermissionNames.value = nextState.checkedPermissionNames
  }

  function syncPermissionState() {
    syncSelectedIds?.(normalizePermissionIds(permissionModuleIds.value))
  }

  function hasGroupIdInput(rawGroupId) {
    return rawGroupId !== null && rawGroupId !== undefined && rawGroupId !== ''
  }

  async function getGroupPermissions() {
    loading.value = true

    try {
      const permissions = await getAllPermissions()
      allPermissions.value = permissions

      const rawGroupId = toValue(id)
      const groupId = parseGroupId(rawGroupId)

      if (hasGroupIdInput(rawGroupId) && !groupId) {
        applyPermissionState(createPermissionSelectionState(allPermissions.value))
        syncPermissionState()
        onLoaded?.({
          allPermissions: { ...allPermissions.value },
          selectedIds: permissionModuleIds.value.slice(),
        })
        message.error('分组ID无效，无法加载已有权限')
        return
      }

      const initialState = groupId
        ? createPermissionSelectionState(allPermissions.value, (await getGroup(groupId)).permissions)
        : createPermissionSelectionState(allPermissions.value)

      applyPermissionState(initialState)
      syncPermissionState()
      onLoaded?.({
        allPermissions: { ...allPermissions.value },
        selectedIds: permissionModuleIds.value.slice(),
      })
    } catch (error) {
      notifyRequestError(message, error, toValue(id) ? '获取分组权限失败' : '获取权限列表失败')
    } finally {
      loading.value = false
    }
  }

  function moduleCheck(checked, permissions, moduleName) {
    applyPermissionState(
      togglePermissionModule(
        {
          checkedPermissionNames: checkedPermissionNames.value,
          halfPermissions: halfPermissions.value,
          permissionModuleIds: permissionModuleIds.value,
          permissionModuleNames: permissionModuleNames.value,
        },
        permissions,
        moduleName,
        checked,
      ),
    )

    syncPermissionState()
  }

  function singleCheck(checked, permissionItem, permissions, moduleName) {
    applyPermissionState(
      togglePermissionItem(
        {
          checkedPermissionNames: checkedPermissionNames.value,
          halfPermissions: halfPermissions.value,
          permissionModuleIds: permissionModuleIds.value,
          permissionModuleNames: permissionModuleNames.value,
        },
        permissionItem,
        permissions,
        moduleName,
        checked,
      ),
    )

    syncPermissionState()
  }

  onMounted(() => {
    void getGroupPermissions()
  })

  return {
    allPermissions,
    checkedPermissionNames,
    getGroupPermissions,
    halfPermissions,
    loading,
    moduleCheck,
    permissionModuleIds,
    permissionModuleNames,
    singleCheck,
  }
}
