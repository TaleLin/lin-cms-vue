<template>
  <div class="app-nav-bar">

    <div class="nav-content">
      <breadcrumb />
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'

export default {
  name: 'NavBar',
  created() {},
  components: {
    Breadcrumb,
  },
}
</script>

<style lang="scss" scoped>
.app-nav-bar {
  width: 100%;
  height: $navbar-height;
  background-color: $header-background;
  display: flex;
  align-items: center;

  .logo.js-min-logo {
    width: 64px;
    font-size: 16px;
    color: #fff;
  }

  .nav-content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: $navbar-padding;

  }
}
</style>
