<template>
  <nav v-if="hasBreadcrumbItems" class="nav-title" aria-label="breadcrumb">
    <span v-for="item in breadcrumbItems" :key="item.key" class="item">
      <p>{{ item.title }}</p>
    </span>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

import { getBreadcrumbItems } from '@/component/layout/layout-helpers'

defineOptions({
  name: 'AppBreadcrumb',
})

const { stageInfo } = defineProps({
  stageInfo: {
    type: Array,
    default: () => [],
  },
})

const breadcrumbItems = computed(() => getBreadcrumbItems(stageInfo))
const hasBreadcrumbItems = computed(() => breadcrumbItems.value.length > 0)
</script>

<style lang="scss">
.nav-title {
  display: flex;
  align-items: center;
  font-size: 14px;

  .item {
    display: flex;
    align-items: center;
    padding-right: 18px;
    position: relative;
    color: $right-side-font-color;
    cursor: default;

    i {
      margin-right: 4px;
    }

    &:after {
      content: '/';
      position: absolute;
      top: 0;
      right: 6px;
    }
  }

  .item:last-child {
    color: $theme;
    padding-right: 0;

    &:after {
      content: '';
    }
  }
}
</style>
