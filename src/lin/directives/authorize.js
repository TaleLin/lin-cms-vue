import Vue from 'vue'
import store from '@/store'

function isAllowed(_auth, user, auths) {
  if (user.isSuper) {
    return true
  }
  if (typeof _auth === 'string') {
    return auths.includes(_auth)
  } if (_auth instanceof Array) {
    return _auth.some(auth => auths.indexOf(auth) >= 0)
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
    const isAllow = isAllowed(auth, (store.state.user || {}), store.state.auths)
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
