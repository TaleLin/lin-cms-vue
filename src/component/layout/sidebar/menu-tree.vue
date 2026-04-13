<template>
  <el-sub-menu v-if="menuHasChildren" :index="item.path" popper-append-to-body>
    <template #title>
      <component :is="resolveElementPlusIcon(iconSource)" v-if="!showImageIcon" class="menu-tree__icon" />
      <img v-else :src="iconSource" alt="icon" class="img-icon" />
      <span>{{ item.title }}</span>
    </template>
    <MenuTree v-for="child in item.children" :key="child.path" :item="child" :navigate="navigate" />
  </el-sub-menu>

  <el-menu-item v-else :index="item.path" @click="navigateTo">
    <component :is="resolveElementPlusIcon(iconSource)" v-if="!showImageIcon" class="menu-tree__icon" />
    <img v-else :src="iconSource" alt="icon" class="img-icon" />
    <template #title>
      <span class="title">{{ item.title }}</span>
    </template>
  </el-menu-item>
</template>

<script setup>
import { computed } from 'vue'

import { resolveElementPlusIcon } from '@/component/base/icon/icon-registry'
import {
  createMenuNavigationTarget,
  getMenuTreeIconSource,
  hasMenuChildren,
  isMenuTreeImageIcon,
} from './menu-tree-helpers'

defineOptions({
  name: 'MenuTree',
})

const { item, navigate } = defineProps({
  item: {
    type: Object,
    required: true,
  },
  navigate: {
    type: Function,
    required: true,
  },
})

const menuHasChildren = computed(() => hasMenuChildren(item))
const iconSource = computed(() => getMenuTreeIconSource(item.icon))
const showImageIcon = computed(() => isMenuTreeImageIcon(iconSource.value))
const navigationTarget = computed(() => createMenuNavigationTarget(item.path))

function navigateTo() {
  navigate(navigationTarget.value)
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

.menu-tree__icon {
  margin-right: 10px;
  margin-left: 5px;
  color: $sub-menu-title;
  width: 16px;
  height: 16px;
}

.title {
  display: inline-block;
  width: 110px;

  @include no-wrap;
}
</style>
