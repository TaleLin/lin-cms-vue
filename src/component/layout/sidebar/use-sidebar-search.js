import { computed, nextTick, ref, toValue, useTemplateRef, watch } from 'vue'

import { getSidebarSearchGroups, shouldShowSidebarSearch } from './sidebar-helpers'

export function useSidebarSearch({ configEnabled = true, visible, sidebarList, navigate } = {}) {
  const searchInput = useTemplateRef('searchInput')
  const groups = ref([])
  const sidebar = ref('')
  const showSearchList = ref(false)

  const sidebarItems = computed(() => toValue(sidebarList) ?? [])
  const showSidebarSearch = computed(() =>
    shouldShowSidebarSearch({
      configEnabled,
      visible: toValue(visible),
      sidebarList: sidebarItems.value,
    }),
  )

  function resetSearchState() {
    groups.value = []
    sidebar.value = ''
    showSearchList.value = false
  }

  watch(
    showSidebarSearch,
    nextVisible => {
      if (!nextVisible) {
        resetSearchState()
      }
    },
    { immediate: true },
  )

  async function openSearch() {
    showSearchList.value = true
    await nextTick()
    searchInput.value?.focus?.()
  }

  function handleChange(path) {
    resetSearchState()
    navigate?.(path)
  }

  function search(keyword) {
    groups.value = getSidebarSearchGroups(sidebarItems.value, keyword)
  }

  return {
    groups,
    handleChange,
    openSearch,
    search,
    searchInput,
    showSearchList,
    showSidebarSearch,
    sidebar,
  }
}
