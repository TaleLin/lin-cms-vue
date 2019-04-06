<template>
  <div class="wrapper">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
</style>
