<template>
  <!--el-submenu改名为el-sub-menu-->
  <el-sub-menu v-if="item.children?.length > 0" :index="item.path" popper-append-to-body>
    <template #title>
      <i v-if="!filterIcon(item.icon)" :class="item.icon"></i>
      <img v-else :src="item.icon" class="img-icon" />
      <span>{{ item.title }}</span>
    </template>
    <menu-tree v-for="child in item.children" :key="child.path" :item="child" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path" @click="navigateTo(item.path)">
    <i v-if="!filterIcon(item.icon)" :class="item.icon"></i>
    <img v-else :src="item.icon" class="img-icon" />
    <template #title
      ><span class="title">{{ item.title }}</span></template
    >
  </el-menu-item>
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  methods: {
    navigateTo(path) {
      this.$router.push({ path })
    },
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
  color: $sub-menu-title;
  height: $menu-item-height;
}

.title {
  display: inline-block;
  width: 110px;
  @include no-wrap();
}
</style>
