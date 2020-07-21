<template>
  <div class="container" ref="container">
    <img class="page-404" src="../../assets/image/error-page/404.png" alt="" />
    <img class="page-logo" src="../../assets/image/error-page/logo.png" alt="" />
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  mounted() {
    const headerHeight = 72
    const { clientHeight } = document.body
    this.$refs.container.style.height = `${clientHeight - headerHeight}px`
  },
}
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .page-404 {
    width: 349px;
    height: 190px;
  }
  .page-logo {
    position: absolute;
    right: 40px;
    bottom: 40px;
    width: 60px;
    height: 98px;
  }
}
</style>
