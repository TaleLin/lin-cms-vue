<template>
  <div v-if="showBackTop" :style="backTopStyle" class="back-top">
    <Top class="back-top__icon" @click="backTop" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, shallowRef, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { Top } from '@element-plus/icons-vue'

defineOptions({
  name: 'BackTopButton',
})

const { right, bottom, fontSize } = defineProps({
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
})

const scrollTarget = shallowRef(null)
const showBackTop = ref(false)
const animationFrameId = ref(0)
const backTopStyle = computed(() => ({
  '--back-top-right': `${right}px`,
  '--back-top-bottom': `${bottom}px`,
  '--back-top-font-size': `${fontSize}px`,
}))

function handleScroll(event) {
  const target = event.target
  const scrollTop = target?.scrollTop ?? 0
  showBackTop.value = scrollTop > 100
  scrollTarget.value = target ?? null
}

function cancelBackTopAnimation() {
  if (!animationFrameId.value) {
    return
  }

  cancelAnimationFrame(animationFrameId.value)
  animationFrameId.value = 0
}

function backTop() {
  if (!scrollTarget.value) {
    return
  }

  cancelBackTopAnimation()

  const animate = () => {
    const target = scrollTarget.value
    const currentTop = target?.scrollTop ?? 0

    if (currentTop > 0) {
      const scrollSpeed = currentTop + (0 - currentTop) / 6
      target.scrollTop = scrollSpeed
      animationFrameId.value = requestAnimationFrame(animate)
    } else {
      cancelBackTopAnimation()
    }
  }

  animationFrameId.value = requestAnimationFrame(animate)
}

useEventListener(window, 'scroll', handleScroll, {
  capture: true,
})

onBeforeUnmount(() => {
  cancelBackTopAnimation()
})
</script>

<style lang="scss" scoped>
.back-top {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  right: var(--back-top-right);
  bottom: var(--back-top-bottom);
  width: 50px;
  height: 50px;
  border-radius: 4px;
  line-height: 50px;
  z-index: 3;
  color: $theme;
  opacity: 0.7;

  &__icon {
    font-size: var(--back-top-font-size);
    width: 50px;
    height: 50px;
  }

  &:hover {
    opacity: 1;
  }
}
</style>
