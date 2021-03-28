<template>
  <div class="app-sidebar">
    <logo :elMenuCollapse="elMenuCollapse" />
    <div style="margin-bottom:50px">
      <search></search>
      <el-menu
        ref="meun"
        class="el-menu-vertical-demo"
        :default-active="defaultActive"
        :collapse="elMenuCollapse"
        background-color="#192A5E"
        text-color="rgba(196,201,210,1)"
        active-text-color="#1890ff"
      >
        <menu-tree v-for="item in sidebarList" :key="item.path" :item="item"></menu-tree>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Logo from './logo'
import Search from './search'
import MenuTree from './menu-tree'

export default {
  components: { MenuTree, Logo, Search },
  props: {
    isPhone: {
      type: Boolean,
      default: false,
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    elMenuCollapse() {
      if (this.isPhone) {
        return false
      }
      return this.isCollapse
    },
    /**
     * 根据当前路由设置激活侧边栏
     */
    defaultActive() {
      const route = this.$route
      return route.path
    },
    ...mapGetters(['sidebarList']),
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.app-sidebar {
  background: #192a5e;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }
}
</style>
