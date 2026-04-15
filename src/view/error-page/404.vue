<template>
  <div class="container" :style="containerStyle">
    <img class="page-404" src="../../assets/image/error-page/404.png" alt="" />
    <img class="page-logo" src="../../assets/image/error-page/logo.png" alt="" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'

defineOptions({
  name: 'NotFound',
})

const NOT_FOUND_HEADER_HEIGHT = 72
const { height } = useWindowSize()
const containerStyle = computed(() => ({
  height: `${height.value - NOT_FOUND_HEADER_HEIGHT}px`,
}))
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
