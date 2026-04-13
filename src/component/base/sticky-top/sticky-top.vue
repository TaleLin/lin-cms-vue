<template>
  <div class="wrapper"><slot></slot></div>
</template>

<script setup>
defineOptions({
  name: 'StickyTop',
})
</script>

<style lang="scss" scoped>
.wrapper {
  position: sticky;
  top: 0;
  z-index: 9;
  background: var(--theme-surface-raised);
}
</style>
