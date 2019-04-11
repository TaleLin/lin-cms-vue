import Config from '@/config'
import store from '@/store'

const plugins = {
  install(Vue) {
    Vue.prototype.$_lin_jump = () => { // eslint-disable-line
      if (!Config.openAutoJumpOut) {
        return
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        store.dispatch('loginOut')
        const { origin } = window.location
        window.location.href = origin
      }, Config.stagnateTime)
    }
  },
}

export default plugins
