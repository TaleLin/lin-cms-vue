import { computed, ref, watch } from 'vue'

import { getInitialSidebarState, getSidebarWidth, getViewportState } from '@/component/layout/layout-helpers'
import {
  getHeaderActionsClasses,
  getHomeShellClasses,
  getHomeStyleVars,
  getSidebarToggleClasses,
  getSidenavMaskClasses,
  HOME_BACK_TOP_PROPS,
  HOME_LAYOUT_DIMENSIONS,
} from './home-helpers'

export function useHomeLayout({ reuseTabRef, route, windowSize } = {}) {
  const { width, height } = windowSize
  const initialViewport = getViewportState(width.value, height.value)
  const initialSidebarState = getInitialSidebarState(width.value)
  const isDesktopSidebarCollapsed = ref(initialViewport.isPhone ? false : initialSidebarState.isCollapse)
  const isPhoneSidebarOpen = ref(false)
  const hasReuseTab = ref(false)

  const isPhone = computed(() => getViewportState(width.value, height.value).isPhone)
  const isSidenavMaskVisible = computed(() => isPhone.value && isPhoneSidebarOpen.value)
  const homeShellClasses = computed(() =>
    getHomeShellClasses({
      isPhone: isPhone.value,
      isPhoneSidebarOpen: isSidenavMaskVisible.value,
    }),
  )
  const headerActionsClasses = computed(() => getHeaderActionsClasses({ hasReuseTab: hasReuseTab.value }))
  const toggleIconClasses = computed(() =>
    getSidebarToggleClasses({
      isDesktopSidebarCollapsed: isDesktopSidebarCollapsed.value,
    }),
  )
  const sidenavMaskClasses = computed(() => getSidenavMaskClasses({ isVisible: isSidenavMaskVisible.value }))
  const showSidebarSearch = computed(() => !isPhone.value && !isDesktopSidebarCollapsed.value)
  const homeStyleVars = computed(() => getHomeStyleVars(height.value))
  const backTopProps = HOME_BACK_TOP_PROPS

  const sidebarWidth = computed(() =>
    getSidebarWidth({
      isPhone: isPhone.value,
      isCollapse: isDesktopSidebarCollapsed.value,
      expandedWidth: HOME_LAYOUT_DIMENSIONS.expandedSidebarWidth,
      collapsedWidth: HOME_LAYOUT_DIMENSIONS.collapsedSidebarWidth,
    }),
  )
  function toggleSidebar() {
    if (isPhone.value) {
      isPhoneSidebarOpen.value = !isPhoneSidebarOpen.value
      return
    }

    isDesktopSidebarCollapsed.value = !isDesktopSidebarCollapsed.value
  }

  function closePhoneSidebar() {
    if (!isSidenavMaskVisible.value) {
      return
    }

    isPhoneSidebarOpen.value = false
  }

  function clearReuseTab() {
    reuseTabRef?.value?.clearTabs()
  }

  function handleHistoryCountChange(count) {
    hasReuseTab.value = count > 1
  }

  watch(
    () => route.fullPath,
    () => {
      closePhoneSidebar()
    },
  )

  watch(isPhone, () => {
    isPhoneSidebarOpen.value = false
  })

  return {
    isDesktopSidebarCollapsed,
    hasReuseTab,
    isPhone,
    isSidenavMaskVisible,
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
  }
}
