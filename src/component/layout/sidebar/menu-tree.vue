<template>
  <el-submenu
    v-if="item.children && item.children.length > 0"
    class="sub-menu-content"
    :index="item.path"
    popper-class="abc"
  >
    <template #title>
      <menu-content :icon="item.icon" :title="item.title" />
    </template>
    <menu-tree v-for="child in item.children" :key="child.path" :item="child" />
  </el-submenu>

  <el-menu-item v-else class="sub-menu-content" :index="item.path" @click="navigateTo(item.path)">
    <menu-content :icon="item.icon" :title="item.title" />
  </el-menu-item>
</template>

<script>
import MenuContent from './menu-content'

export default {
  name: 'MenuTree',
  components: { MenuContent },
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
  },
}
</script>

<style lang="scss" scoped>
.sub-menu-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
