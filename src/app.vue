<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { defaultDocument, useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { useThemeStore, syncPrimaryColorVars, DARK_PRIMARY_PALETTE } from '@/store/modules/theme'

const route = useRoute()
const themeStore = useThemeStore()
const pageTitle = computed(() => route.meta.title || 'lin-cms')
const activeTheme = computed(() => themeStore.activeTheme)
const isDark = computed(() => themeStore.isDark)

useTitle(pageTitle)

watch(
  activeTheme,
  theme => {
    const documentElement = defaultDocument?.documentElement

    if (!documentElement || !theme) {
      return
    }

    documentElement.dataset.chinaTheme = theme.id
    if (!isDark.value) {
      syncPrimaryColorVars(theme.colors.primary)
    }
  },
  {
    immediate: true,
  },
)

watch(
  isDark,
  dark => {
    const documentElement = defaultDocument?.documentElement

    if (!documentElement) {
      return
    }

    documentElement.classList.toggle('dark', dark)
    syncPrimaryColorVars(dark ? DARK_PRIMARY_PALETTE : activeTheme.value.colors.primary)
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  const loader = defaultDocument?.getElementById('loader')

  if (loader) {
    loader.style.display = 'none'
  }
})
</script>

<style lang="scss">
#app {
  position: relative;
  isolation: isolate;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--theme-text);
  background: transparent;
  font-family: var(--theme-font-body);

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition:
      color 99999s ease-out 99999s,
      background-color 99999s ease-out 99999s;
  }
}
</style>
