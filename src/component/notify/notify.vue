<template>
  <el-dropdown class="notify-dropdown" :trigger :placement :hide-on-click="hideOnClick">
    <div class="notify">
      <el-badge :value :hidden :max :is-dot="isDot" class="item">
        <el-icon>
          <component :is="icon" />
        </el-icon>
      </el-badge>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <div class="notify-title">
          <p>消息提醒</p>
          <p class="notify-title__action" @click="emit('readAll')">全部已读</p>
        </div>
        <div class="notify-panel" :style="panelStyle">
          <div v-if="messages.length === 0" class="notify-empty" :style="panelStyle">
            <div class="notify-empty__state">
              <svg width="150" height="120" viewBox="0 0 150 120" fill="currentColor">
                <path
                  fill="#EBEEF5"
                  d="M46.76 78.71a1.895 1.895 0 0 0-1.378 2.092c.13.948.94 1.648 1.904 1.635h55.468a1.882 1.882 0 0 0 1.884-1.635c.13-.95-.46-1.846-1.367-2.09a8.61 8.61 0 0 1-6.4-7.872l-2.473-20.928c-.96-7.872-6.567-14.37-14.178-16.435l-.986-.267-.113-1.014c-.24-2.106-2.01-3.696-4.11-3.696s-3.87 1.59-4.104 3.696l-.114 1.014-.98.267c-7.61 2.063-13.22 8.563-14.18 16.43L53.15 70.84c-.2 3.74-2.79 6.926-6.393 7.87zm50.61-29.155l2.482 20.982c.127 2.562 1.817 4.654 4.19 5.276a4.895 4.895 0 0 1 3.568 5.397c-.336 2.446-2.434 4.26-4.876 4.227H47.306a4.883 4.883 0 0 1-4.896-4.227 4.897 4.897 0 0 1 3.58-5.4 5.614 5.614 0 0 0 4.17-5.168l2.49-21.093c1.068-8.77 7.135-16.06 15.46-18.7.807-3.11 3.615-5.35 6.9-5.35s6.094 2.24 6.9 5.35c8.325 2.64 14.393 9.93 15.46 18.7zm-16.417 38.91c-.288 3.184-3.007 5.36-5.943 5.36-2.936 0-5.655-2.176-5.943-5.36l-2.988.27c.43 4.82 4.52 8.09 8.93 8.09s8.49-3.27 8.93-8.09l-2.99-.27z"
                ></path>
              </svg>
              <div>还没有消息</div>
            </div>
          </div>
          <el-dropdown-item
            v-for="(msg, index) in messages"
            :key="resolveMessageKey(msg, index)"
            @click="emit('readMessage', msg, index)"
          >
            <slot :row="msg">
              <p
                :class="[
                  'notify-message',
                  msg[resolvedFieldMap.is_read] ? 'notify-message--read' : 'notify-message--unread',
                ]"
              >
                {{ msg[resolvedFieldMap.content] }}
              </p>
              <div class="notify-message-meta">
                <p class="user">{{ msg[resolvedFieldMap.user] }}</p>
                <p class="date-time">{{ msg[resolvedFieldMap.time] }}</p>
              </div>
            </slot>
          </el-dropdown-item>
        </div>
        <div class="notify-footer">
          <p class="notify-footer__action" @click="emit('viewAll')">查看全部 &gt;</p>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { Bell } from '@element-plus/icons-vue'

defineOptions({
  name: 'LinNotify',
})

const { height, trigger, placement, hideOnClick, max, isDot, hidden, value, icon, fieldMap, messages } = defineProps({
  height: {
    type: [String, Number],
    default: 200,
  },
  trigger: {
    type: String,
  },
  placement: {
    type: String,
  },
  hideOnClick: {
    type: Boolean,
  },
  max: {
    type: Number,
  },
  isDot: Boolean,
  hidden: {
    type: Boolean,
  },
  value: {
    type: [String, Number],
  },
  icon: {
    type: [Object, Function],
    default: () => Bell,
  },
  fieldMap: {
    type: Object,
    default: null,
  },
  messages: {
    type: Array,
    default: () => [],
  },
})

const DEFAULT_FIELD_MAP = Object.freeze({
  user: 'user',
  is_read: 'is_read',
  content: 'content',
  time: 'time',
})

const resolvedFieldMap = computed(() => ({
  ...DEFAULT_FIELD_MAP,
  ...(fieldMap || {}),
}))

const emit = defineEmits(['readMessage', 'readAll', 'viewAll'])
const panelStyle = computed(() => {
  const resolvedHeight = normalizePanelHeight(height)

  return {
    minHeight: resolvedHeight,
    maxHeight: resolvedHeight,
  }
})

function normalizePanelHeight(heightValue) {
  if (typeof heightValue === 'number') {
    return `${heightValue}px`
  }

  if (typeof heightValue === 'string' && /^\d+$/.test(heightValue)) {
    return `${heightValue}px`
  }

  return heightValue
}

function resolveMessageKey(message, fallbackIndex) {
  return (
    message?.id ??
    message?.messageId ??
    message?.[resolvedFieldMap.value.time] ??
    `${message?.[resolvedFieldMap.value.content] || 'notify-message'}-${fallbackIndex}`
  )
}
</script>

<style lang="scss" scoped>
.notify-dropdown {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.notify {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 36px;
  height: 36px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.el-badge) {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  :deep(.el-icon) {
    width: 18px;
    height: 18px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.el-badge__content.is-fixed) {
    transform: translateY(-50%) translateX(100%);
  }
}

.notify-panel {
  overflow-y: auto;
}

.notify-empty {
  display: flex;
  box-sizing: border-box;
  min-width: 0;
  align-items: center;
  justify-content: center;
  margin: 0;
  flex: 1 1 0;
}

.notify-empty__state {
  box-sizing: border-box;
  min-width: 0;
  text-align: center;
  color: rgba(133, 144, 166);
  margin: 0;
}

.notify-message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.notify-message {
  position: relative;

  &:before {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    top: 50%;
    left: -15px;
    transform: translateY(-50%);
  }
}

.notify-message--unread {
  &:before {
    background: #f4516c;
  }
}

.notify-message--read {
  &:before {
    background: #ebedf2;
  }
}

.notify-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #45526b;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 8px;
  height: 50px;
  font-weight: 500;
  min-width: 386px;
  border-bottom: 1px solid #dee2e6;

  &__action {
    font-size: 12px;
    border: 1px solid #596c8e;
    border-radius: 2px;
    cursor: pointer;
    height: 20px;
    line-height: 20px;
    padding-left: 5px;
    padding-right: 5px;
  }
}

.notify-footer {
  padding: 19px 0;
  border-top: solid 1px #dee2e6;

  &__action {
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    color: #45526b;
  }
}

:deep(.el-dropdown-menu__item) {
  padding: 0 35px;
}
</style>
