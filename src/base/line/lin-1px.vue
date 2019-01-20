<template>
  <div class="lin-line"
       :style="{ height: height + 'px',
       width: 'calc(100% + ' + addWidth + 'px'+ ')',
       marginLeft: - addWidth / 2 + 'px', color: color }">
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 1,
    },
    addWidth: {
      type: [String, Number],
      default: '0',
    },
    color: {
      type: String,
      default: '#c4c0d2',
    },
  },
}
</script>


<style scoped lang="scss">
.lin-line {
  height: 1px;
  width: 100%;
  background: #dae1ed;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px #d4d4d4;
}
</style>
