import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { logModel } from '@/model/log'
import { notifyRequestError } from '@/lin/util/request-error'
import { searchLogKeyword } from '@/lin/util/search'

import {
  buildLogKeyword,
  buildLogSearchParams,
  canQueryLoggedUsers,
  createLogDateDefaultTime,
  createLogDateShortcuts,
  createLogSearchKeywordCommit,
  formatLogDateRange,
  hasActiveLogFilters,
  hasMoreLogItems,
  isLogNoMoreError,
  LOG_PAGE_SIZE,
  mergeLogItems,
} from './log-helpers'

export function useLog({
  userStore,
  message = ElMessage,
  logService = logModel,
  highlightKeyword = searchLogKeyword,
} = {}) {
  const user = computed(() => userStore?.user || {})
  const permissions = computed(() => userStore?.permissions || [])
  const logs = ref([])
  const users = ref({ items: [] })
  const loading = ref(false)
  const isSearch = ref(false)
  const finished = ref(false)
  const more = ref(false)
  const keyword = ref('')
  const searchUser = ref('')
  const searchKeywordInput = ref('')
  const searchKeyword = ref('')
  const selectedDateRange = ref([])
  const searchDate = computed(() => formatLogDateRange(selectedDateRange.value))
  const totalCount = ref(0)
  const count = computed(() => logs.value.length)
  const isResettingSearch = ref(false)
  const datePickerDefaultTime = createLogDateDefaultTime()
  const datePickerShortcuts = createLogDateShortcuts()
  const canLoadLoggedUsers = computed(() => canQueryLoggedUsers(user.value, permissions.value))
  const commitSearchKeyword = createLogSearchKeywordCommit(nextKeyword => {
    searchKeyword.value = nextKeyword
  })

  async function initPage() {
    try {
      loading.value = true
      finished.value = false
      isSearch.value = false
      totalCount.value = 0

      if (canLoadLoggedUsers.value) {
        users.value = await logService.getLoggedUsers({})
      } else {
        users.value = { items: [] }
      }

      const result = await logService.getLogs({ page: 0, count: LOG_PAGE_SIZE })
      logs.value = result.items
    } catch (error) {
      notifyRequestError(message, error, '获取日志列表失败')
    } finally {
      loading.value = false
    }
  }

  async function searchPage() {
    logs.value = []
    totalCount.value = 0
    finished.value = false
    loading.value = true

    try {
      const result = await logService.searchLogs(
        buildLogSearchParams({
          page: 0,
          searchKeyword: searchKeyword.value,
          searchUser: searchUser.value,
          searchDate: searchDate.value,
        }),
      )

      isSearch.value = true

      if (!result) {
        finished.value = true
        return
      }

      let nextLogs = result.items
      totalCount.value = result.total

      if (searchKeyword.value) {
        nextLogs = await highlightKeyword(searchKeyword.value, nextLogs)
      }

      logs.value = nextLogs
    } catch (error) {
      notifyRequestError(message, error, '搜索日志失败')
    } finally {
      loading.value = false
    }
  }

  function syncKeyword() {
    keyword.value = buildLogKeyword({
      searchUser: searchUser.value,
      searchKeyword: searchKeyword.value,
      searchDate: searchDate.value,
    })
  }

  async function applyFilters() {
    syncKeyword()

    if (
      !hasActiveLogFilters({
        searchUser: searchUser.value,
        searchKeyword: searchKeyword.value,
        searchDate: searchDate.value,
      })
    ) {
      keyword.value = ''
      await initPage()
      return
    }

    await searchPage()
  }

  function submitKeywordSearch() {
    commitSearchKeyword.cancel?.()
    const nextKeyword = searchKeywordInput.value.trim()

    if (nextKeyword === searchKeyword.value) {
      void applyFilters()
      return
    }

    searchKeyword.value = nextKeyword
  }

  function clearKeywordSearch() {
    commitSearchKeyword.cancel?.()
    isResettingSearch.value = true
    searchKeywordInput.value = ''
    isResettingSearch.value = false
    searchKeyword.value = ''
  }

  function handleCommand(currentUser) {
    searchUser.value = currentUser[0]
  }

  async function backInit() {
    isResettingSearch.value = true
    commitSearchKeyword.cancel?.()
    searchUser.value = ''
    searchKeywordInput.value = ''
    searchKeyword.value = ''
    selectedDateRange.value = []
    keyword.value = ''
    totalCount.value = 0
    logs.value = []
    isSearch.value = false
    isResettingSearch.value = false
    await initPage()
  }

  async function nextPage() {
    more.value = true

    try {
      const result = isSearch.value ? await logService.moreSearchPage() : await logService.moreLogPage()
      let nextLogs = result.items

      if (!hasMoreLogItems(nextLogs)) {
        finished.value = true
        return
      }

      if (isSearch.value && searchKeyword.value) {
        nextLogs = await highlightKeyword(searchKeyword.value, nextLogs)
      }

      logs.value = mergeLogItems(logs.value, nextLogs)
    } catch (error) {
      if (isLogNoMoreError(error)) {
        finished.value = true
        return
      }

      notifyRequestError(message, error, isSearch.value ? '获取更多搜索结果失败' : '获取更多日志失败')
    } finally {
      more.value = false
    }
  }

  watch(searchKeywordInput, nextKeyword => {
    if (isResettingSearch.value) {
      return
    }

    commitSearchKeyword(nextKeyword)
  })

  watch([searchKeyword, searchUser, searchDate], () => {
    if (isResettingSearch.value) {
      return
    }

    void applyFilters()
  })

  onBeforeUnmount(() => {
    commitSearchKeyword.cancel?.()
  })

  onMounted(() => {
    void initPage()
  })

  return {
    datePickerDefaultTime,
    datePickerShortcuts,
    finished,
    handleCommand,
    keyword,
    loading,
    logs,
    more,
    nextPage,
    searchKeywordInput,
    searchUser,
    selectedDateRange,
    submitKeywordSearch,
    clearKeywordSearch,
    count,
    backInit,
    totalCount,
    users,
  }
}
