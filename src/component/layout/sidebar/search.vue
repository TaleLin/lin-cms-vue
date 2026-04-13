<template>
  <div v-if="showSidebarSearch" class="search-wrap">
    <div v-if="!showSearchList" class="search-display" @click="openSearch">
      <el-icon><Search /></el-icon>
    </div>
    <el-select
      v-if="showSearchList"
      ref="searchInput"
      v-model="sidebar"
      :filter-method="search"
      class="search"
      clearable
      filterable
      placeholder="请输入关键字"
      @change="handleChange"
    >
      <el-option v-for="item in groups" :key="item.key" :label="item.title" :value="item.path" />
    </el-select>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'

import Config from '@/config/index'

import { useSidebarSearch } from './use-sidebar-search'

defineOptions({
  name: 'SidebarSearch',
})

const { visible, sidebarList, navigate } = defineProps({
  visible: {
    type: Boolean,
    default: true,
  },
  sidebarList: {
    type: Array,
    default: () => [],
  },
  navigate: {
    type: Function,
    required: true,
  },
})

const { groups, handleChange, openSearch, search, searchInput, showSearchList, showSidebarSearch, sidebar } =
  useSidebarSearch({
    configEnabled: Config.showSidebarSearch,
    visible: () => visible,
    sidebarList: () => sidebarList,
    navigate,
  })
</script>

<style lang="scss" scoped>
.search-wrap {
  margin-top: 15px;
}

.search-display {
  position: relative;
  width: 80%;
  margin: 0 auto;
  height: 36px;
  border-bottom: 1px rgba(185, 190, 195) solid;
  cursor: pointer;

  .el-icon {
    position: absolute;
    left: 1px;
    top: 10px;
    color: rgba(185, 190, 195);
  }
}

.search {
  width: 80%;
}
</style>
