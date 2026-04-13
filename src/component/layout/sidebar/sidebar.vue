<template>
  <div class="app-sidebar">
    <Logo :elMenuCollapse />
    <div class="sidebar-content">
      <Search v-if="showSidebarContent" :navigate="navigate" :sidebar-list="sidebarList" :visible="showSearch" />
      <el-menu
        v-if="showSidebarContent"
        :collapse="elMenuCollapse"
        :default-active="defaultActive"
        active-text-color="var(--theme-sidebar-active-text)"
        background-color="var(--theme-sidebar-bg)"
        class="el-menu-vertical-demo"
        text-color="var(--theme-sidebar-text)"
      >
        <MenuTree v-for="item in sidebarList" :key="item.path" :item="item" :navigate="navigate" />
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import Logo from './logo'
import Search from './search'
import MenuTree from './menu-tree'
import { hasSidebarItems, resolveSidebarMenuCollapse } from './sidebar-helpers'

defineOptions({
  name: 'AppSidebar',
})

const { isPhone, isCollapse, showSearch, sidebarList, activePath, navigate } = defineProps({
  isPhone: {
    type: Boolean,
    default: false,
  },
  isCollapse: {
    type: Boolean,
    default: false,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  sidebarList: {
    type: Array,
    default: () => [],
  },
  activePath: {
    type: String,
    default: '',
  },
  navigate: {
    type: Function,
    required: true,
  },
})

const elMenuCollapse = computed(() =>
  resolveSidebarMenuCollapse({
    isPhone,
    isCollapse,
  }),
)

const showSidebarContent = computed(() => hasSidebarItems(sidebarList))
const defaultActive = computed(() => activePath)
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.app-sidebar {
  background: var(--theme-sidebar-bg);

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.sidebar-content {
  margin-bottom: 50px;
}
</style>
