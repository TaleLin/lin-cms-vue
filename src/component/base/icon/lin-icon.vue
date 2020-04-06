<template>
  <svg class="l-icon" :style="{ width, height }" @click="$emit('click', $event)">
    <use :xlink:href="`#icon-${name}`" :fill="color"></use>
  </svg>
</template>
<script>
export default {
  name: 'LIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '1.2em',
    },
    height: {
      type: String,
      default: '1.2em',
    },
  },
}
</script>
<style lang="scss" scoped>
.l-icon {
  &:hover,
  &:focus {
    color: #fff;
  }
}
</style>
