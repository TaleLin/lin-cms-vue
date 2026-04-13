import { computed, ref, toValue, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

import {
  appendHistoryEntryIfMissing,
  closeLeftHistories,
  closeRightHistories,
  getContextMenuLeft,
  getContextMenuState,
  getNextPathOnClose,
  keepOnlySelectedHistory,
  resolveHistoriesWithStage,
  restoreHistories,
} from '@/component/layout/reuse-tab-helpers'

const CONTEXT_MENU_TOP = 18

export function useReuseTab({
  currentRoute,
  navigate,
  getStageByName,
  getStageByRoute,
  defaultRoute,
  loggedIn,
  permissionStageConfig,
  storedHistories,
  reuseTabRef,
  emitHistoryCountChange,
} = {}) {
  const histories = ref([])
  const visible = ref(false)
  const hasLeft = ref(true)
  const hasRight = ref(true)
  const top = ref(0)
  const left = ref(0)
  const selectedIndex = ref(0)

  const contextMenuStyle = computed(() => ({
    left: `${left.value}px`,
    top: `${top.value}px`,
  }))
  const defaultRouteValue = computed(() => toValue(defaultRoute))
  const loggedInValue = computed(() => toValue(loggedIn))
  const permissionStageConfigValue = computed(() => toValue(permissionStageConfig) ?? [])

  const resolvedHistories = computed(() =>
    resolveHistoriesWithStage(histories.value, {
      getStageByName,
      getStageByRoute,
    }),
  )

  function closeMenu() {
    visible.value = false
    hasLeft.value = true
    hasRight.value = true
  }

  function clearTabs() {
    histories.value = []
  }

  function restoreHistoryState() {
    const localHistory = histories.value.length > 0 ? [...histories.value] : [...storedHistories.value]

    histories.value = restoreHistories(localHistory, {
      getStageByName,
      getStageByRoute,
    })
  }

  function closeAll() {
    closeMenu()
    histories.value = []
    navigate?.(defaultRouteValue.value)
  }

  function closeOthers() {
    const nextHistories = keepOnlySelectedHistory(histories.value, selectedIndex.value)
    const nextPath = nextHistories[0]?.path

    closeMenu()
    histories.value = nextHistories

    if (nextPath) {
      navigate?.(nextPath)
    }
  }

  function closeLeft() {
    closeMenu()
    histories.value = closeLeftHistories(histories.value, selectedIndex.value)
  }

  function closeRight() {
    closeMenu()
    histories.value = closeRightHistories(histories.value, selectedIndex.value)
  }

  function openContextMenu(index, event) {
    closeMenu()

    const rootElement = reuseTabRef.value

    if (!rootElement) {
      return
    }

    const { hasLeft: nextHasLeft, hasRight: nextHasRight } = getContextMenuState(index, histories.value.length)

    left.value = getContextMenuLeft({
      clientX: event.clientX,
      offsetLeft: rootElement.getBoundingClientRect().left,
      offsetWidth: rootElement.offsetWidth,
    })
    hasLeft.value = nextHasLeft
    hasRight.value = nextHasRight
    top.value = CONTEXT_MENU_TOP
    selectedIndex.value = index
    visible.value = true
  }

  function close(index) {
    const nextPath = getNextPathOnClose({
      currentPath: currentRoute.path,
      histories: histories.value,
      index,
      defaultRoute: defaultRouteValue.value,
    })

    if (nextPath) {
      navigate?.(nextPath)
    }

    histories.value.splice(index, 1)
    histories.value = [...histories.value]
  }

  restoreHistoryState()

  watch(
    () => currentRoute.path,
    () => {
      histories.value = appendHistoryEntryIfMissing(histories.value, currentRoute)
    },
    { immediate: true },
  )

  watch(loggedInValue, isLoggedIn => {
    if (!isLoggedIn) {
      closeAll()
    }
  })

  watch(permissionStageConfigValue, restoreHistoryState, { deep: true })

  watch(
    histories,
    nextHistories => {
      storedHistories.value = nextHistories.slice()
      emitHistoryCountChange?.(nextHistories.length)
    },
    { deep: true, immediate: true },
  )

  onClickOutside(reuseTabRef, closeMenu)

  return {
    clearTabs,
    close,
    closeAll,
    closeLeft,
    closeMenu,
    closeOthers,
    closeRight,
    contextMenuStyle,
    hasLeft,
    hasRight,
    openContextMenu,
    resolvedHistories,
    visible,
  }
}
