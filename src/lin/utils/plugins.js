import Config from '@/config'
import store from '@/store'

const plugins = {
  install(Vue, options) {
    Vue.prototype.$_jump = () => {
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
