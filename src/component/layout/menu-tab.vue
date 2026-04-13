<template>
  <ul v-if="hasMenuTabs" class="menu-tab">
    <router-link v-for="tab in menuTabItems" :key="tab.path" :to="tab.path">
      <li class="menu-li">
        <component :is="resolveElementPlusIcon(tab.iconSource)" v-if="!tab.showImageIcon" class="menu-tab__icon" />
        <img v-else :src="tab.iconSource" alt="icon" class="img-icon" />
        <span class="title">{{ tab.displayTitle }}</span>
      </li>
    </router-link>
  </ul>
</template>

<script setup>
import { computed } from 'vue'

import { resolveElementPlusIcon } from '@/component/base/icon/icon-registry'
import { filters } from '@/lin/filter'

import { getLayoutIconSource, getMenuTabs, shouldUseImageIcon } from '@/component/layout/layout-helpers'

const { stageInfo } = defineProps({
  stageInfo: {
    type: Array,
    default: () => [],
  },
})

const menuTabItems = computed(() =>
  getMenuTabs(stageInfo).map(tab => ({
    ...tab,
    displayTitle: filters.filterTitle(tab.title),
    iconSource: getLayoutIconSource(tab.icon),
    showImageIcon: shouldUseImageIcon(tab.icon),
  })),
)
const hasMenuTabs = computed(() => menuTabItems.value.length > 0)
</script>

<style lang="scss" scoped>
.router-link-active {
  background: black;
}

.menu-tab {
  width: 100%;
  height: 38px;
  line-height: 38px;
  background: $reuse-tab-item-background;
  font-size: 14px;
  font-weight: 400;
  color: rgba(140, 152, 174, 1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .router-link-exact-active,
  .router-link-active {
    background: $app-main-background;
    color: $theme;
  }

  .menu-li {
    width: 120px;
    height: 38px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .menu-tab__icon {
      width: 16px;
      height: 16px;
    }

    .img-icon {
      width: 16px;
      height: 16px;
      margin: 0 auto;
    }

    .title {
      margin-left: 5px;
    }
  }
}
</style>
