<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Config from '@/config'

export default {
  data() {
    return {
      timer: null,
    }
  },
  computed: {
    ...mapGetters(['stopTime']),
  },
  watch: {
    stopTime() {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.loginOut()
        // this.$router.push('/login')
        const { origin } = window.location
        window.location.href = origin
      }, Config.stagnateTime)
    },
  },
  methods: {
    ...mapActions(['loginOut']),
  },
}
</script>


<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  #nav {
    padding: 30px;
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-transition-delay: 99999s;
    -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
  }
}
</style>
