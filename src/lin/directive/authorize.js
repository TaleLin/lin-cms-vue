import store from '@/store'

/**
 * 判断是否允许访问该DOM
 * @param {*} permission 权限
 * @param {*} user 当前用户实例
 * @param {*} permissions 当前管理员所在分组权限集
 */
function isAllowed(permission, user, permissions) {
  if (user.admin) return true

  if (typeof permission === 'string') {
    return permissions.includes(permission)
  }
  if (permission instanceof Array) {
    return permission.some(auth => permissions.indexOf(auth) >= 0)
  }
  return false
}

export default {
  beforeMount(el, binding) {
    let type
    let permission
    const element = el

    if (Object.prototype.toString.call(binding.value) === '[object Object]') {
      ;({ permission } = binding.value);
      ({ type } = binding.value)
    } else {
      permission = binding.value
    }
    const isAllow = isAllowed(permission, store.state.user || {}, store.state.permissions)
    if (!isAllow && permission) {
      if (type) {
        element.disabled = true
        element.style.opacity = 0.4
        element.style.cursor = 'not-allowed'
      } else {
        element.style.display = 'none'
      }
    }
  },
}
