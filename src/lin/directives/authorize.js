import Vue from 'vue'
import store from '@/store'

function isAllowed(permission, user, permissions) {
  if (user.isSuper) {
    return true
  }
  if (typeof permission === 'string') {
    return permissions.includes(permission)
  }
  if (permission instanceof Array) {
    return permission.some(auth => permissions.indexOf(auth) >= 0)
  }
  return false
}

Vue.directive('auth', {
  bind(el, binding) {
    let auth
    let type
    if (Object.prototype.toString.call(binding.value) === '[object Object]') {
      // eslint-disable-next-line prefer-destructuring
      auth = binding.value.auth
      // eslint-disable-next-line prefer-destructuring
      type = binding.value.type
    } else {
      auth = binding.value
    }
    const isAllow = isAllowed(auth, store.state.user || {}, store.state.permissions)
    const element = el
    if (!isAllow && auth) {
      if (type) {
        element.disabled = true
        element.style.opacity = 0.4
        element.style.cursor = 'not-allowed'
      } else {
        element.style.display = 'none'
      }
    }
  },
})

export default Vue.directive('auth')
