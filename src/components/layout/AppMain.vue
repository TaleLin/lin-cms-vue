<template>
  <section class="container">
    <!-- <keep-alive :include="cachePage"> -->
    <div class="wrapper">
      <transition name="fade-transform"
                  mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <!-- </keep-alive> -->
  </section>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'AppMain',
  data() {
    return {
      cachePage: [], // keep-alive生效的组件，
      flag: true,
    }
  },
  methods: {
    ...mapMutations(['SET_START_SCROLL', 'GET_SCROLLY']),
  },
  watch: {
    $route() {
      this.SET_START_SCROLL(false)
    },
  },
}
</script>

<style scoped type="text/scss" lang="scss">
.container {
  position: relative;
  .wrapper {
    width: 100%;
    height: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #ffffff;
    text-align: left;
  }
}
</style>
