<template>
  <div class="wrapper"><slot></slot></div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: sticky;
  top: 0;
  z-index: 9;
  background: #fff;
}
</style>
