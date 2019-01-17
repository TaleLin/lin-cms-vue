<template>
  <div
    class="scroll-container"
    ref="scrollContainer"
    @wheel.prevent="handleScroll"
  >
    <div class="scroll-wrapper" ref="scrollWrapper" :style="classObject">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-mixed-operators */

const delta = 15

export default {
  name: 'ScrollBar',
  props: {
    direction: {
      type: String,
      default: 'top', // top, left, right
    },
  },
  data() {
    return {
      top: 0,
    }
  },
  computed: {
    classObject() {
      return {
        [this.direction]: `${this.top}px`,
      }
    },
  },
  methods: {
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3
      const $container = this.$refs.scrollContainer
      const $containerHeight = $container.offsetHeight
      const $wrapper = this.$refs.scrollWrapper
      const $wrapperHeight = $wrapper.offsetHeight
      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta)
      } else if ($containerHeight - delta < $wrapperHeight) {
        if (this.top < -($wrapperHeight - $containerHeight + delta)) {
          this.top = this.top
        } else {
          this.top = Math.max(
            this.top + eventDelta,
            $containerHeight - $wrapperHeight - delta,
          )
        }
      } else {
        this.top = 0
      }
    },
  },
}
</script>

<style lang="scss" type="text/scss" scoped>
.scroll-container {
  height: 100%;
  .scroll-wrapper {
    position: absolute;
    width: 100%;
  }
}
</style>
