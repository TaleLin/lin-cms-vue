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
    const isAllow = isAllowed(binding.value, (store.state.user || {}), store.state.auths)
    const element = el
    if (!isAllow && binding.value) {
      element.style.display = 'none'
    }
  },
})

export default Vue.directive('auth')
