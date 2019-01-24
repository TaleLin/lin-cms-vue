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

export default {
  name: 'AppMain',
  data() {
    return {
      cachePage: [], // keep-alive生效的组件，
      flag: true,
    }
  },
}
</script>

<style scoped type="text/scss" lang="scss">
.container {
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
