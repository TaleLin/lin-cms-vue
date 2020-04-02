<template>
  <div class="container" title="全屏/正常">
    <i class="iconfont" :class="isFullscreen ? 'icon-quxiaoquanping' : 'icon-quanping'" @click="handleFullScreen"></i>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  data() {
    return {
      isFullscreen: false,
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    handleFullScreen() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning',
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  cursor: pointer;

  i {
    width: 40px;
    height: 40px;
    font-size: 20px;

    &:before {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
    }
  }
}
</style>
