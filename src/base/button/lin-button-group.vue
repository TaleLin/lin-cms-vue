<template>
  <div class="l-button-group">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "LinuttonGroup",
  mounted() {
    for (let node of this.$el.children) {
      let name = node.nodeName.toLowerCase();
      if (name !== "button") {
        console.warn(
          `g-button-group 的子元素应该全是 g-button，但是你写的是 ${name}`
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./button.scss";
.l-button-group {
  display: inline-flex;
  vertical-align: middle;
  > .l-button {
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
    &:hover {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
