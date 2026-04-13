<template>
  <div class="home-shell" :class="homeShellClasses" :style="homeStyleVars">
    <el-container>
      <el-aside :width="sidebarWidth" class="home-shell__aside">
        <Sidebar
          :is-collapse="isDesktopSidebarCollapsed"
          :is-phone="isPhone"
          :active-path="route.path"
          :navigate="navigate"
          :show-search="showSidebarSearch"
          :sidebar-list="userStore.sidebarList"
        />
      </el-aside>
      <el-container>
        <el-header class="home-shell__header">
          <div class="home-shell__header-left">
            <div class="home-shell__header-actions" :class="headerActionsClasses">
              <el-icon class="home-shell__toggle-icon" :class="toggleIconClasses" @click="toggleSidebar">
                <Fold />
              </el-icon>
              <NavBar
                :stage-info="currentStageInfo"
                :messages="messages"
                :unread-count="unreadCount"
                :hidden="hidden"
                :logout="logout"
                :navigate-to-center="navigateToCenter"
                :notify-events="notifyEvents"
                :user-store="userStore"
                @clearReuseTab="clearReuseTab"
                @readAll="readAll"
                @readMessage="readMessage"
              />
            </div>
            <el-collapse-transition>
              <ReuseTab
                ref="reuseTab"
                :get-stage-by-name="userStore.getStageByName"
                :get-stage-by-route="userStore.getStageByRoute"
                :default-route="userStore.defaultRoute"
                :logged-in="userStore.loggedIn"
                :current-route="route"
                :navigate="navigate"
                :permission-stage-config="userStore.permissionStageConfig"
                @historyCountChange="handleHistoryCountChange"
              />
            </el-collapse-transition>
          </div>
        </el-header>
        <el-main class="home-shell__main">
          <MenuTab :stage-info="currentStageInfo" />
          <AppMain :route-key="route.fullPath" class="home-shell__app-main" />
        </el-main>
        <BackTop :right="backTopProps.right" :bottom="backTopProps.bottom" :font-size="backTopProps.fontSize" />
      </el-container>
      <div class="home-shell__sidenav-mask" :class="sidenavMaskClasses" @click="closePhoneSidebar"></div>
    </el-container>
  </div>
</template>

<script setup>
import { Fold } from '@element-plus/icons-vue'
import { useWindowSize } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Config from '@/config'
import { logoutAndRedirectToLogin } from '@/lin/util/session'
import { useUserStore } from '@/store/modules/user'
import { NavBar, Sidebar, AppMain, ReuseTab, MenuTab, BackTop } from '@/component/layout'
import { useNotifyProvider } from '@/component/layout/use-notify-provider'
import { useLayoutNotify } from '@/component/layout/use-layout-notify'
import { useHomeLayout } from './use-home-layout'

defineOptions({
  name: 'HomeLayout',
})

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const windowSize = useWindowSize()
const reuseTab = useTemplateRef('reuseTab')
const currentStageInfo = computed(() => userStore.getStageInfo(route.name) || [])

function navigate(path) {
  router.push(path)
}

function navigateToCenter() {
  navigate('/center')
}

function logout() {
  void logoutAndRedirectToLogin(userStore, router)
}

const {
  isDesktopSidebarCollapsed,
  isPhone,
  showSidebarSearch,
  homeShellClasses,
  headerActionsClasses,
  toggleIconClasses,
  sidenavMaskClasses,
  homeStyleVars,
  backTopProps,
  sidebarWidth,
  toggleSidebar,
  closePhoneSidebar,
  clearReuseTab,
  handleHistoryCountChange,
} = useHomeLayout({
  reuseTabRef: reuseTab,
  route,
  windowSize,
})

const { messages, unreadCount, hidden, readAll, readMessage, createLayoutNotifyEvents } = useLayoutNotify({ userStore })
const notifyEvents = createLayoutNotifyEvents()

// 局部注册通知连接能力，替代原来的全局 LinNotify 插件
useNotifyProvider(Config.wsBaseUrl, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
})
</script>

<style lang="scss" scoped>
.home-shell {
  height: 100%;

  --home-app-main-min-height: 0px;
  --home-expanded-sidebar-width: 210px;
  --home-viewport-height: 100vh;
  --home-header-actions-height: 86px;
  --home-header-actions-compact-height: 45px;

  &--phone {
    .home-shell__aside {
      position: absolute;
      height: var(--home-viewport-height);
      z-index: 12;
      transform: translateX(calc(-1 * var(--home-expanded-sidebar-width)));
    }
  }

  &--sidebar-open {
    .home-shell__aside {
      transform: translateX(0);
    }
  }
}

.home-shell__aside {
  background: var(--theme-sidebar-bg);
  overflow-x: hidden;
  transition: transform 0.2s ease;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}

.home-shell__header {
  padding: 0;
  background: var(--theme-header-gradient);
  height: $header-height !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--theme-shadow);
  border-bottom: 1px solid var(--theme-border);
}

.home-shell__header-left {
  height: 100%;
  width: 100%;
}

.home-shell__header-actions {
  display: flex;
  align-items: center;
  background: transparent;
  padding-left: 20px;
  height: var(--home-header-actions-height);

  &--compact {
    height: var(--home-header-actions-compact-height);
  }
}

.home-shell__toggle-icon {
  font-size: 16px;
  font-weight: 500;
  color: $right-side-font-color;
  cursor: pointer;
  transform: rotate(0deg);
  transition: all 0.3s linear;
  margin-right: 10px;

  &:hover {
    color: var(--theme-primary);
  }

  &--collapsed {
    transform: rotate(180deg);
    transition: all 0.3s linear;
  }
}

.home-shell__main {
  overflow-y: auto;
  position: relative;
  padding: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 160px), transparent;
}

.home-shell__app-main {
  min-height: var(--home-app-main-min-height);
}

.home-shell__sidenav-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--theme-menu-mask);
  z-index: 10;
  display: none;
  cursor: pointer;

  &--visible {
    display: block;
  }
}
</style>
