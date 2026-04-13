import { useUserStore } from '@/store/modules/user'

/**
 * 判断是否允许访问该DOM
 * @param {*} permission 权限
 * @param {*} user 当前用户实例
 * @param {*} permissions 当前管理员所在分组权限集
 */
function isAllowed(permission, user, permissions) {
  if (user.admin) {
    return true
  }

  if (typeof permission === 'string') {
    return permissions.includes(permission)
  }
  if (Array.isArray(permission)) {
    return permission.some(auth => permissions.includes(auth))
  }
  return false
}

function resolvePermissionBinding(bindingValue) {
  if (Object.prototype.toString.call(bindingValue) === '[object Object]') {
    return bindingValue
  }

  return {
    permission: bindingValue,
    type: undefined,
  }
}

function applyDenyState(element, type) {
  if (type) {
    element.disabled = true
    element.style.opacity = 0.4
    element.style.cursor = 'not-allowed'
    return
  }

  element.style.display = 'none'
}

const permissionDirective = {
  beforeMount(el, binding) {
    const { permission, type } = resolvePermissionBinding(binding.value)
    const userStore = useUserStore()

    if (!isAllowed(permission, userStore.user || {}, userStore.permissions) && permission) {
      applyDenyState(el, type)
    }
  },
}

export default permissionDirective
