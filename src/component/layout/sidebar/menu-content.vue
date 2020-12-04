<template>
  <i v-if="!filterIcon(icon)" :class="icon"></i>
  <img v-else :src="icon" class="img-icon" />
  <span>{{ title }}</span>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    filterIcon(icon) {
      return icon.indexOf('/') !== -1
    },
  },
}
</script>

<style lang="scss" scoped>
.img-icon {
  width: 16px;
  height: 16px;
  margin-right: 10px;
  margin-left: 5px;
  display: inline-block;
  transform: translateY(21px);
}
.iconfont {
  margin-right: 10px;
  margin-left: 5px;
  color: $submenu-title;
  height: $menuItem-height;
}
</style>
