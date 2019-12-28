// 定时自动登出功能, 启用后一段时间无用户操作, 则自动登出. 需在项目 config 中配置
import Vue from 'vue'
import Config from '@/config'
import store from '@/store'

const Plugin = {
  install(vue) {
    // eslint-disable-next-line
    vue.prototype.$_lin_jump = () => {
      // eslint-disable-line
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

Vue.use(Plugin)

export default Plugin
