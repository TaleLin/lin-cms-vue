<template>
  <div class="app-nav-bar">
    <div class="nav-content">
      <Breadcrumb :stage-info="stageInfo" />
      <div class="right-info">
        <LinNotify
          :hidden="hidden"
          :messages="messages"
          trigger="click"
          :value="unreadCount"
          height="370"
          @readAll="handleReadAll"
          @readMessage="handleReadMessage"
          @viewAll="handleViewAll"
        />
        <ThemeSwitcher />
        <ClearTab @clear="handleClearReuseTab" />
        <Screenfull />
        <User :logout-action="logout" :navigate-to-center="navigateToCenter" :user-store="userStore" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'

import Config from '@/config'
import { useTokenRef } from '@/lin/util/token'
import { notifyConnectKey, notifyDisconnectKey } from '@/component/layout/use-notify-provider'
import LinNotify from '@/component/notify/notify.vue'

import User from './user'
import ThemeSwitcher from './theme-switcher.vue'
import ClearTab from './clear-tab'
import Breadcrumb from './breadcrumb'
import Screenfull from './screen-full'
import { buildNotifySocketPath } from './notify-helpers'

defineOptions({
  name: 'NavBar',
})

const { stageInfo, messages, unreadCount, hidden, notifyEvents, navigateToCenter, logout, userStore } = defineProps({
  stageInfo: {
    type: Array,
    default: () => [],
  },
  messages: {
    type: Array,
    default: () => [],
  },
  unreadCount: {
    type: [Number, String],
    default: 0,
  },
  hidden: {
    type: Boolean,
    default: true,
  },
  notifyEvents: {
    type: Object,
    default: () => ({}),
  },
  navigateToCenter: {
    type: Function,
    required: true,
  },
  logout: {
    type: Function,
    required: true,
  },
  userStore: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['clearReuseTab', 'readAll', 'readMessage', 'viewAll'])

const connect = inject(notifyConnectKey, null)
const disconnect = inject(notifyDisconnectKey, null)
const accessToken = useTokenRef('access_token')
const connectedSocketPath = ref('')
const path = computed(() => buildNotifySocketPath(accessToken.value))

function handleClearReuseTab() {
  emit('clearReuseTab')
}

function handleReadAll() {
  emit('readAll')
}

function handleReadMessage(message) {
  emit('readMessage', message)
}

function handleViewAll() {
  emit('viewAll')
}

function disconnectNotifySocket() {
  if (!connectedSocketPath.value) {
    return
  }

  disconnect?.()
  connectedSocketPath.value = ''
}

function connectNotifySocket(nextPath) {
  if (!nextPath || connectedSocketPath.value === nextPath) {
    return
  }

  if (!Config.websocketEnable || !connect) {
    return
  }

  connect(nextPath, {
    format: 'json',
    events: notifyEvents,
  })
  connectedSocketPath.value = nextPath
}

watch(
  path,
  nextPath => {
    if (!Config.websocketEnable || !connect || !nextPath) {
      disconnectNotifySocket()
      return
    }

    connectNotifySocket(nextPath)
  },
  {
    immediate: true,
  },
)

onBeforeUnmount(() => {
  disconnectNotifySocket()
})
</script>

<style lang="scss" scoped>
.app-nav-bar {
  width: 100%;
  height: $navbar-height;
  display: flex;
  align-items: center;

  .logo.js-min-logo {
    width: 64px;
    font-size: 16px;
    color: #fff;
  }

  .nav-content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: $navbar-padding;

    .right-info {
      display: flex;
      align-items: center;
      gap: 10px;

      > * {
        flex-shrink: 0;
      }
    }
  }
}
</style>
