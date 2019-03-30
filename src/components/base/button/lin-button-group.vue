<template>
  <div class="l-button-group">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'LinButtonGroup',
  mounted() {
    for (const node of this.$el.children) {
      const name = node.nodeName.toLowerCase()
      if (name !== 'button') {
        console.warn(
          `l-button-group 的子元素应该全是 l-button，但是你写的是 ${name}`

        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./button.scss";

.l-button-group {
  display: inline-flex;
  vertical-align: middle;

  >.l-button--primary,
  .l-button--success,
  .l-button--danger,
  .l-button--info {
    border-radius: 0;
    border-right: 1px solid white;
    border-left: 1px solid white;

    &:not(:first-child) {
      margin-left: -1px;
    }
    
    &:first-child {
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
      border-left: none;
    }
    
    &:last-child {
      border-top-right-radius: $border-radius;
      border-bottom-right-radius: $border-radius;
      border-right: none;
    }

    &:hover:not(:first-child):not(:last-child) {
      position: relative;
      z-index: 1;
      border-right: 1px solid white;
      border-left: 1px solid white;
    }

    &:hover:first-child {
      position: relative;
      z-index: 1;
      border-right: 1px solid white;
    }

    &:hover:last-child {
      position: relative;
      z-index: 1;
      border-left: 1px solid white;
    }
  }
}
</style>
