<template>
  <div class="container" title="全屏/正常">
    <component :is="iconComponent" class="screen-full__icon" @click="handleFullScreen" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { FullScreen, ScaleToOriginal } from '@element-plus/icons-vue'
import screenfull from 'screenfull'

const isFullscreen = ref(false)
const iconComponent = computed(() => (isFullscreen.value ? ScaleToOriginal : FullScreen))

function syncFullscreenState() {
  isFullscreen.value = screenfull.isFullscreen
}

function registerScreenfullListener() {
  if (!screenfull.isEnabled) {
    return
  }

  syncFullscreenState()
  screenfull.on('change', syncFullscreenState)
}

function unregisterScreenfullListener() {
  if (!screenfull.isEnabled) {
    return
  }

  screenfull.off('change', syncFullscreenState)
}

function handleFullScreen() {
  if (!screenfull.isEnabled) {
    ElMessage({
      message: 'you browser can not work',
      type: 'warning',
    })
    return
  }

  screenfull.toggle()
}

onMounted(() => {
  registerScreenfullListener()
})

onBeforeUnmount(() => {
  unregisterScreenfullListener()
})
</script>

<style lang="scss" scoped>
.container {
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .screen-full__icon {
    width: 18px;
    height: 18px;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
