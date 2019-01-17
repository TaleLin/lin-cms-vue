import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      // 0-0
      parentIndex: -1,
      childrenIndex: -1,
    }
  },
  watch: {
    $route() {
      this.setMenuDefaultActive()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setMenuDefaultActive()
    })
  },
  computed: {
    ...mapGetters(['sideBarList']),
  },
  methods: {
    setMenuDefaultActive() {
      const { path } = this.$route
      const { sideBarList } = this
      let defaultActive
      // eslint-disable-next-line
      for (let i = 0; i < sideBarList.length; i++) {
        if (sideBarList[i].path === path) {
          this.parentIndex = i
          if (!sideBarList[i].meta.menuTab) {
            defaultActive = this.parentIndex
            this.$store.commit('SET_DEFAULT_ACTIVE_TAB', defaultActive.toString())
            this.$store.commit('ADD_TAB', {
              path: this.$route.path,
              title: this.$route.meta.title,
            })
          }
        } else if (sideBarList[i].children) {
          // eslint-disable-next-line
          for (let j = 0; j < sideBarList[i].children.length; j++) {
            if (sideBarList[i].children[j].path === path) {
              this.parentIndex = i
              // 判断是否设置tab为true
              if (sideBarList[i].meta.menuTab) {
                this.childrenIndex = j
                defaultActive = this.parentIndex
                this.$store.commit('SET_DEFAULT_ACTIVE_TAB', defaultActive.toString())
                return
              }
              this.childrenIndex = j
              // eslint-disable-next-line
              defaultActive = `${this.parentIndex}` + '-' + `${this.childrenIndex}`
              this.$store.commit('SET_DEFAULT_ACTIVE_TAB', defaultActive)
            } else if (sideBarList[i].children[j].children) {
              // eslint-disable-next-line
              for (let k = 0; k < sideBarList[i].children[j].children.length; k++) {
                if (sideBarList[i].children[j].children[k].path === path) {
                  this.parentIndex = i
                  this.childrenIndex = j
                  // eslint-disable-next-line
                  defaultActive = `${this.parentIndex}` + '-' + `${this.childrenIndex}`
                  this.$store.commit('SET_DEFAULT_ACTIVE_TAB', defaultActive)
                  this.$store.commit('ADD_TAB', {
                    path: this.$route.path,
                    title: this.$route.meta.title,
                  })
                  return
                }
              }
            }
          }
        }
      }
    },
  },
}
