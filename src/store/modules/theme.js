import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// Element Plus color palette builder
// Given a base color, generates the full color scale
export function buildColorPalette(base) {
  return {
    base,
    'dark-2': adjustBrightness(base, -20),
    'light-3': adjustBrightness(base, 30),
    'light-5': adjustBrightness(base, 50),
    'light-7': adjustBrightness(base, 65),
    'light-8': adjustBrightness(base, 78),
    'light-9': adjustBrightness(base, 90),
  }
}

// Adjusts brightness of a hex color (percentage: positive = lighter, negative = darker)
function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000ff) + amt))
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`
}

export const CHINA_THEME_OPTIONS = Object.freeze([
  {
    id: 'lin-classic',
    name: '海月靛青',
    description: '偏深的靛青配熟纸底色，稳重清朗，适合作为默认后台主题',
    swatches: ['#355C85', '#F3EEE6', '#1F3550'],
    colors: {
      primary: buildColorPalette('#355C85'),
      success: buildColorPalette('#67c23a'),
      warning: buildColorPalette('#e6a23c'),
      danger: buildColorPalette('#f56c6c'),
      info: buildColorPalette('#909399'),
    },
  },
  {
    id: 'book-ink',
    name: '茶烟栗褐',
    description: '以栗褐做主色，取旧纸与茶烟层次，适合内容密集和表单场景',
    swatches: ['#7A5230', '#F4EDE4', '#4B3122'],
    colors: {
      primary: buildColorPalette('#7a5230'),
      success: buildColorPalette('#67c23a'),
      warning: buildColorPalette('#e6a23c'),
      danger: buildColorPalette('#f56c6c'),
      info: buildColorPalette('#909399'),
    },
  },
  {
    id: 'palace-vermilion',
    name: '绛纱胭脂',
    description: '用偏深胭脂红做识别色，保留宫廷色意象，但避免大面积艳红',
    swatches: ['#A64B55', '#F4EBE7', '#5B2F36'],
    colors: {
      primary: buildColorPalette('#a64b55'),
      success: buildColorPalette('#67c23a'),
      warning: buildColorPalette('#e6a23c'),
      danger: buildColorPalette('#f56c6c'),
      info: buildColorPalette('#909399'),
    },
  },
  {
    id: 'ru-yao-celadon',
    name: '松岚黛绿',
    description: '取松岚与黛绿的中深色阶，界面清润但不轻飘，适合长时间使用',
    swatches: ['#48655A', '#EEF0EA', '#244239'],
    colors: {
      primary: buildColorPalette('#48655a'),
      success: buildColorPalette('#67c23a'),
      warning: buildColorPalette('#e6a23c'),
      danger: buildColorPalette('#f56c6c'),
      info: buildColorPalette('#909399'),
    },
  },
])

const DEFAULT_THEME_ID = CHINA_THEME_OPTIONS[0].id
const themeOptionMap = Object.freeze(Object.fromEntries(CHINA_THEME_OPTIONS.map(theme => [theme.id, theme])))

// Maps buildColorPalette output keys to CSS variable names
const PRIMARY_VAR_MAP = Object.freeze({
  base: '--el-color-primary',
  'dark-2': '--el-color-primary-dark-2',
  'light-3': '--el-color-primary-light-3',
  'light-5': '--el-color-primary-light-5',
  'light-7': '--el-color-primary-light-7',
  'light-8': '--el-color-primary-light-8',
  'light-9': '--el-color-primary-light-9',
})

// Dark mode primary palette (matches SCSS :root.dark --el-color-primary-* values)
export const DARK_PRIMARY_PALETTE = Object.freeze({
  base: '#5a8fc7',
  'dark-2': '#4a7eb5',
  'light-3': '#7ba3d4',
  'light-5': '#9dbbe2',
  'light-7': '#bfd3ed',
  'light-8': '#d0e0f0',
  'light-9': '#e1ecf6',
})

/**
 * Injects primary color palette into CSS custom properties at runtime.
 * This keeps buildColorPalette() as the single source of truth for primary colors.
 */
export function syncPrimaryColorVars(palette) {
  if (typeof document === 'undefined' || !palette) {
    return
  }

  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(PRIMARY_VAR_MAP)) {
    root.style.setProperty(cssVar, palette[key])
  }
}

export const useThemeStore = defineStore(
  'theme',
  () => {
    const activeThemeId = ref(DEFAULT_THEME_ID)
    const isDark = ref(false)

    const themes = computed(() => CHINA_THEME_OPTIONS)
    const activeTheme = computed(() => themeOptionMap[activeThemeId.value] || CHINA_THEME_OPTIONS[0])

    function setTheme(themeId) {
      if (!themeOptionMap[themeId]) {
        return
      }

      activeThemeId.value = themeId
    }

    function toggleDark() {
      isDark.value = !isDark.value
    }

    function setDark(dark) {
      isDark.value = dark
    }

    return {
      activeThemeId,
      isDark,
      themes,
      activeTheme,
      setTheme,
      toggleDark,
      setDark,
    }
  },
  {
    persist: {
      key: 'lin-cms:theme',
      pick: ['activeThemeId', 'isDark'],
    },
  },
)
