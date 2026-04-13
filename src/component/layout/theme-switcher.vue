<template>
  <el-popover
    :visible="isPopoverVisible"
    placement="bottom-end"
    popper-class="theme-switcher-popper"
    trigger="manual"
    :show-arrow="false"
    :width="348"
  >
    <template #reference>
      <div class="theme-switcher-trigger-wrap" @mouseenter="openPopover" @mouseleave="scheduleClosePopover">
        <button class="theme-switcher" title="主题配色" type="button">
          <Brush class="theme-switcher__icon" />
        </button>
      </div>
    </template>

    <div class="theme-switcher-panel" @mouseenter="openPopover" @mouseleave="scheduleClosePopover">
      <div class="theme-switcher-panel__header">
        <span class="theme-switcher-panel__title">配色印谱</span>
        <span class="theme-switcher-panel__subtitle">悬停预览，点击应用</span>
      </div>

      <!-- Dark mode toggle -->
      <div class="theme-switcher-panel__dark-toggle">
        <span class="theme-switcher-panel__dark-label">暗色模式</span>
        <button
          class="theme-dark-toggle"
          :class="{ 'theme-dark-toggle--active': isDark }"
          type="button"
          @click="toggleDark"
        >
          <span class="theme-dark-toggle__track">
            <span class="theme-dark-toggle__thumb" />
          </span>
        </button>
      </div>

      <!-- Theme cards (hidden when dark mode is active) -->
      <template v-if="showThemeCards">
        <el-divider class="theme-switcher-panel__divider" />

        <div class="theme-switcher-panel__grid">
          <button
            v-for="theme in themeCards"
            :key="theme.id"
            class="theme-card"
            :class="{ 'theme-card--active': theme.isActive }"
            :title="theme.description"
            type="button"
            @mouseenter="previewTheme(theme.id)"
            @focus="previewTheme(theme.id)"
            @click="commitTheme(theme.id)"
          >
            <div class="theme-card__top">
              <span class="theme-card__name">{{ theme.name }}</span>
              <span v-if="theme.isActive" class="theme-card__mark" aria-label="当前主题" />
            </div>
            <div class="theme-switcher__swatches">
              <span
                v-for="swatch in theme.swatches"
                :key="swatch"
                class="theme-switcher__swatch"
                :style="{ backgroundColor: swatch }"
              />
            </div>
            <div class="theme-card__desc">
              {{ theme.description }}
            </div>
          </button>
        </div>
      </template>
    </div>
  </el-popover>
</template>

<script setup>
import { Brush } from '@element-plus/icons-vue'
import { defaultDocument } from '@vueuse/core'
import { computed, onBeforeUnmount, ref } from 'vue'

import { useThemeStore } from '@/store/modules/theme'

defineOptions({
  name: 'ThemeSwitcher',
})

const themeStore = useThemeStore()
const themes = computed(() => themeStore.themes)
const activeTheme = computed(() => themeStore.activeTheme)
const activeThemeId = computed(() => activeTheme.value?.id ?? '')
const themeCards = computed(() =>
  themes.value.map(theme => ({
    ...theme,
    isActive: theme.id === activeThemeId.value,
  })),
)
const isDark = computed(() => themeStore.isDark)
const showThemeCards = computed(() => !isDark.value)
const isPopoverVisible = ref(false)
let closeTimer = null

function applyDocumentTheme(themeId) {
  const documentElement = defaultDocument?.documentElement

  if (!documentElement) {
    return
  }

  if (!themeId) {
    delete documentElement.dataset.chinaTheme
    return
  }

  documentElement.dataset.chinaTheme = themeId
}

function clearCloseTimer() {
  if (!closeTimer) {
    return
  }

  clearTimeout(closeTimer)
  closeTimer = null
}

function restoreActiveTheme() {
  applyDocumentTheme(activeThemeId.value)
}

function openPopover() {
  clearCloseTimer()
  isPopoverVisible.value = true
}

function scheduleClosePopover() {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    isPopoverVisible.value = false
    restoreActiveTheme()
  }, 120)
}

function previewTheme(themeId) {
  clearCloseTimer()
  applyDocumentTheme(themeId)
}

function commitTheme(themeId) {
  clearCloseTimer()
  const alreadyActive = themeId === activeThemeId.value
  themeStore.setTheme(themeId)
  // app.vue watch handles DOM update when theme actually changes
  // Edge case: clicking already-active theme won't trigger watch,
  // so we restore explicitly to clear any preview state
  if (alreadyActive) {
    restoreActiveTheme()
  }
  isPopoverVisible.value = false
}

function toggleDark() {
  themeStore.toggleDark()
  // DOM class toggling is handled by app.vue watch(isDark, ...)
}

onBeforeUnmount(() => {
  clearCloseTimer()
  restoreActiveTheme()
})
</script>

<style lang="scss" scoped>
.theme-switcher-trigger-wrap {
  display: flex;
  align-items: center;
}

.theme-switcher {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  transition:
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    color: var(--theme-primary);
    transform: translateY(-1px);
  }
}

.theme-switcher__icon {
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.theme-switcher__swatch {
  width: 10px;
  height: 26px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.45);
}

.theme-switcher__swatches {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.theme-switcher-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.theme-switcher-panel__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.theme-switcher-panel__title {
  color: var(--theme-text);
  font-size: 15px;
  font-family: var(--theme-font-display);
}

.theme-switcher-panel__subtitle {
  color: var(--theme-text-soft);
  font-size: 12px;
}

.theme-switcher-panel__dark-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
}

.theme-switcher-panel__dark-label {
  color: var(--theme-text);
  font-size: 14px;
  font-family: var(--theme-font-display);
}

.theme-dark-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
}

.theme-dark-toggle__track {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 2px;
  border-radius: 12px;
  background: var(--theme-border);
  transition: background-color 0.2s ease;
}

.theme-dark-toggle--active .theme-dark-toggle__track {
  background: var(--el-color-primary);
}

.theme-dark-toggle__thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.theme-dark-toggle--active .theme-dark-toggle__thumb {
  transform: translateX(20px);
}

.theme-switcher-panel__divider {
  margin: 0;
  border-color: var(--theme-border);
}

.theme-switcher-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.theme-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 116px;
  padding: 14px 14px 12px;
  border: 1px solid var(--theme-border);
  border-radius: 16px;
  background: linear-gradient(180deg, var(--theme-surface-raised), var(--theme-surface));
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: var(--theme-primary-soft-border);
    box-shadow: var(--theme-panel-shadow);
  }
}

.theme-card--active {
  border-color: var(--theme-primary);
  box-shadow: 0 0 0 1px var(--theme-primary) inset;
}

.theme-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.theme-card__name {
  color: var(--theme-text);
  font-size: 14px;
  line-height: 1.2;
  font-family: var(--theme-font-display);
}

.theme-card__mark {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: var(--theme-primary);
  box-shadow: 0 0 0 4px var(--theme-primary-soft);
  flex-shrink: 0;
}

.theme-card__desc {
  color: var(--theme-text-muted);
  font-size: 12px;
  line-height: 1.45;
}
</style>
