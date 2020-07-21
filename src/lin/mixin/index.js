import Vue from 'vue'
import { mapGetters } from 'vuex'

const globalMixin = {
  // eslint-disable-next-line
  install(Vue) {
    Vue.mixin({
      methods: {
        goBack() {
          /* eslint-disable no-unused-expressions */
          window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        },
        isAllowed(_permission) {
          /* eslint-disable no-restricted-syntax */
          /* eslint-disable guard-for-in */
          const { permissions } = this.user
          for (const mod of permissions) {
            for (const item in mod) {
              for (const a of mod[item]) {
                // console.log(a.permission)
                if (a.permission === _permission) {
                  return true
                }
                // console.log(a.module)
              }
            }
          }
          return false
        },
      },
      filters: {
        // ...filter,
      },
      computed: {
        ...mapGetters(['user']),
      },
    })
  },
}

Vue.use(globalMixin)

export default globalMixin
