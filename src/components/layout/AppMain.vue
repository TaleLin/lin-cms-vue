<template>
  <section class="container">
    <div class="wrapper" id="wrapper">
      <transition name="fade-transform"
                  mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data() {
    return {
      cachePage: [], // keep-alive生效的组件，
      flag: true,
    }
  },
  watch: {
    $route(to) {
      if (to.meta.blueBaseColor) {
        console.log('blueBaseColor')
        document.getElementById('wrapper').style.background = '#273B6F'
      } else {
        document.getElementById('wrapper').style.background = '#FFF'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  .wrapper {
    width: 100%;
    height: 100%;
    text-align: left;
  }
}
</style>
