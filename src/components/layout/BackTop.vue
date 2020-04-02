<template>
  <div class="backTop" :style="{ right: right + 'px', bottom: bottom + 'px' }" v-if="showBackTop">
    <i class="iconfont icon-xsaaa" :style="{ fontSize: fontSize + 'px' }" @click="backTop"></i>
  </div>
</template>

<script>
export default {
  name: 'BackTop',
  props: {
    right: {
      type: Number,
      default: 50,
    },
    bottom: {
      type: Number,
      default: 50,
    },
    fontSize: {
      type: Number,
      default: 18,
    },
  },
  data() {
    return {
      targetDom: null, // 当前滚动对象
      showBackTop: false, // 是否显示回到顶部标识
      scrollY: 0, // 滚动距离
    }
  },
  mounted() {
    // 监听页面滚动
    window.addEventListener('scroll', this.handleScroll, true)
  },
  methods: {
    handleScroll(e) {
      this.scrollY = e.target.scrollTop
      this.showBackTop = e.target.scrollTop > 100 // 页面滚动距离大于100的时候显示回到top的标识
      this.targetDom = e
    },
    // 滑动到顶部
    backTop() {
      const _this = this
      let timer = requestAnimationFrame(function fn() {
        const currentTop = _this.targetDom.target.scrollTop
        if (currentTop > 0) {
          // 平滑滚动
          const scrollSpeed = currentTop + (0 - currentTop) / 6
          _this.targetDom.target.scrollTop = scrollSpeed
          timer = requestAnimationFrame(fn)
        } else {
          cancelAnimationFrame(timer)
        }
      })
    },
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
}
</script>

<style lang="scss" scoped>
.backTop {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  width: 50px;
  height: 50px;
  border-radius: 4px;
  line-height: 50px;
  z-index: 3;
  color: $theme;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
}
</style>
