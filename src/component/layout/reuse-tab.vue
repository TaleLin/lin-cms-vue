<template>
  <div v-if="showReuseTabBar" ref="reuseTabRef" class="reuse-tab">
    <Swiper
      :free-mode="true"
      :initial-slide="0"
      :modules="swiperModules"
      :mousewheel="true"
      :prevent-clicks="false"
      :space-between="1"
      class="reuse-tab-wrap"
      direction="horizontal"
      effect="slide"
      slides-per-view="auto"
    >
      <SwiperSlide v-for="(item, index) in resolvedHistories" :key="item.path">
        <RouterLink
          :class="getItemClass(item.path)"
          :to="item.path"
          class="reuse-tab-item"
          @contextmenu.prevent="openContextMenu(index, $event)"
        >
          <component
            :is="resolveElementPlusIcon(getHistoryIconSource(item.stage.icon))"
            v-if="!showHistoryImageIcon(item.stage.icon)"
            class="reuse-tab-item__icon"
          />
          <img v-else :src="getHistoryIconSource(item.stage.icon)" class="reuse-tab-item__image-icon" />
          <span class="reuse-tab-item__title">{{ item.stage.title }}</span>
          <el-icon class="reuse-tab-close" @click.prevent.stop="close(index)">
            <Close />
          </el-icon>
        </RouterLink>
      </SwiperSlide>
    </Swiper>

    <ul v-show="visible" :style="contextMenuStyle" class="contextmenu">
      <li @click="closeAll">关闭所有</li>
      <li @click="closeOthers">关闭其他</li>
      <li v-if="hasLeft" @click="closeLeft">关闭左侧</li>
      <li v-if="hasRight" @click="closeRight">关闭右侧</li>
    </ul>
  </div>
</template>

<script setup>
import { Close } from '@element-plus/icons-vue'
import { computed, useTemplateRef } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Mousewheel } from 'swiper/modules'
import { useLocalStorage } from '@vueuse/core'

import 'swiper/css'

import { resolveElementPlusIcon } from '@/component/base/icon/icon-registry'

import { getLayoutIconSource, shouldUseImageIcon } from '@/component/layout/layout-helpers'
import { getReuseTabItemClass, shouldShowReuseTabBar } from '@/component/layout/reuse-tab-helpers'
import { useReuseTab } from '@/component/layout/use-reuse-tab'

defineOptions({
  name: 'ReuseTabBar',
})

const { currentRoute, navigate, getStageByName, getStageByRoute, defaultRoute, loggedIn, permissionStageConfig } =
  defineProps({
    currentRoute: {
      type: Object,
      required: true,
    },
    navigate: {
      type: Function,
      required: true,
    },
    getStageByName: {
      type: Function,
      required: true,
    },
    getStageByRoute: {
      type: Function,
      required: true,
    },
    defaultRoute: {
      type: String,
      required: true,
    },
    loggedIn: {
      type: Boolean,
      required: true,
    },
    permissionStageConfig: {
      type: Array,
      default: () => [],
    },
  })

const emit = defineEmits(['historyCountChange'])
const reuseTabRef = useTemplateRef('reuseTabRef')
const swiperModules = [FreeMode, Mousewheel]
const storedHistories = useLocalStorage('history', [])

function handleHistoryCountChange(count) {
  emit('historyCountChange', count)
}

const {
  clearTabs,
  close,
  closeAll,
  closeLeft,
  closeOthers,
  closeRight,
  contextMenuStyle,
  hasLeft,
  hasRight,
  openContextMenu,
  resolvedHistories,
  visible,
} = useReuseTab({
  currentRoute,
  navigate,
  getStageByName,
  getStageByRoute,
  defaultRoute: () => defaultRoute,
  loggedIn: () => loggedIn,
  permissionStageConfig: () => permissionStageConfig,
  storedHistories,
  reuseTabRef,
  emitHistoryCountChange: handleHistoryCountChange,
})

const showReuseTabBar = computed(() => shouldShowReuseTabBar(resolvedHistories.value))

function getItemClass(path) {
  return getReuseTabItemClass({
    currentPath: currentRoute.path,
    historyPath: path,
  })
}

function getHistoryIconSource(icon) {
  return getLayoutIconSource(icon)
}

function showHistoryImageIcon(icon) {
  return shouldUseImageIcon(icon)
}

defineExpose({
  clearTabs,
})
</script>

<style lang="scss" scoped>
.swiper-slide {
  width: auto !important;
  min-width: 126px;
  display: flex;
  height: $reuse-tab-height;
  flex-direction: column;
  justify-content: center;
  background-color: $reuse-tab-item-background;
  color: $right-side-font-color;
  margin-right: 1px;
}

.reuse-tab-wrap {
  bottom: 0;
  left: 0;
  user-select: none;
  height: $reuse-tab-height;
  background: $header-background;
  font-size: 14px;
  color: #8c98ae;
  display: flex;
  align-items: center;
  overflow: hidden;

  .reuse-tab-item {
    box-sizing: border-box;
    width: auto;
    height: $reuse-tab-height;
    min-width: 126px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1em;
    margin-right: 1px;
    position: relative;
    white-space: nowrap;

    &__icon {
      color: $theme;
      width: 16px;
      height: 16px;
    }

    &__image-icon {
      width: 16px;
    }

    &__title {
      padding: 0 5px;
    }

    .reuse-tab-close {
      opacity: 0;
      position: absolute;
    }

    &:hover {
      background: $theme;
      border: none;
      color: #fff;

      .reuse-tab-item__icon {
        color: #fff;
      }

      .reuse-tab-close {
        position: absolute;
        display: inline-block;
        width: 14px;
        height: 14px;
        top: 0;
        right: 0;
        opacity: 1;
        border-radius: 0 0 0 14px;
        background: rgba(255, 255, 255, 0.3);
      }
    }
  }

  .active {
    box-sizing: border-box;
    height: 40px;
    color: #fff;
    background: $theme;
    border: none;
    position: relative;

    .reuse-tab-item__icon {
      color: #fff;
    }

    .reuse-tab-close {
      position: absolute;
      display: inline-block;
      width: 14px;
      height: 14px;
      top: 0;
      right: 0;
      opacity: 1;
      border-radius: 0 0 0 14px;
      background: rgba(255, 255, 255, 0.3);
    }
  }

  .reuse-tab-wrap {
    height: 100%;
  }
}

.reuse-tab {
  position: relative;

  .contextmenu {
    margin: 0;
    background: var(--theme-surface-raised);
    border: 1px solid var(--theme-border);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: var(--theme-text-muted);
    box-shadow: var(--theme-panel-shadow);

    li {
      margin: 0;
      padding: 10px 20px;
      cursor: pointer;

      &:hover {
        background: var(--theme-primary-soft);
        color: var(--theme-primary);
      }
    }
  }
}
</style>
