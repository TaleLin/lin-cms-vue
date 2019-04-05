import { mapGetters } from 'vuex'

export default {
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
      // eslint-disable-next-line
      for (let i = 0; i < sideBarList.length; i++) {
        if (sideBarList[i].path === path) {
          console.log(1)
          this.$store.commit('SET_DEFAULT_ACTIVE_TAB', `${i}`)
        } else if (sideBarList[i].children) {
          // eslint-disable-next-line
          for (let j = 0; j < sideBarList[i].children.length; j++) {
            if (sideBarList[i].children[j].path === path && !sideBarList[i].children[j].children) {
              console.log(2)
              this.$store.commit('SET_DEFAULT_ACTIVE_TAB', `${i}-${j}`)
            } else if (sideBarList[i].children[j].children) {
              for (let k = 0; k < sideBarList[i].children[j].children.length; k++) {
                if (sideBarList[i].children[j].children[k].path === path) {
                  console.log(3)
                  this.$store.commit('SET_DEFAULT_ACTIVE_TAB', `${i}-${j}-${k}`)
                }
              }
            }
          }
        }
      }
    },
  },
}
