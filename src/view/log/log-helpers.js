import dayjs from 'dayjs'

import { createDebouncedHandler } from '@/lin/util/rate-limit'

export const LOG_PAGE_SIZE = 10
export const LOG_SEARCH_DEBOUNCE_WAIT = 1000
export const LOG_DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'
export const LOG_NO_MORE_CODE = 10020

export function createLogSearchKeywordCommit(
  onQuery,
  wait = LOG_SEARCH_DEBOUNCE_WAIT,
  debounce = createDebouncedHandler,
) {
  return debounce(keyword => {
    onQuery(keyword.trim())
  }, wait)
}

export function createLogDateDefaultTime() {
  return [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]
}

export function createLogRecentDateRange(days, now = new Date()) {
  const end = new Date(now)
  const start = new Date(now)

  start.setTime(start.getTime() - 3600 * 1000 * 24 * days)

  return [start, end]
}

export function createLogDateShortcuts(now = new Date()) {
  return [
    {
      text: '最近一周',
      value: createLogRecentDateRange(7, now),
    },
    {
      text: '最近一个月',
      value: createLogRecentDateRange(30, now),
    },
    {
      text: '最近三个月',
      value: createLogRecentDateRange(90, now),
    },
  ]
}

export function formatLogDateRange(dateRange) {
  if (!Array.isArray(dateRange) || dateRange.length !== 2) {
    return []
  }

  return dateRange.map(item => dayjs(item).format(LOG_DATE_TIME_FORMAT))
}

export function canQueryLoggedUsers(user = {}, permissions = []) {
  return Boolean(user.admin || permissions.includes('查询日志记录的用户'))
}

export function normalizeSearchUser(searchUser = '') {
  return searchUser === '全部人员' ? '' : searchUser
}

export function buildLogSearchParams({
  count = LOG_PAGE_SIZE,
  page = 0,
  searchKeyword = '',
  searchUser = '',
  searchDate = [],
} = {}) {
  return {
    count,
    page,
    keyword: searchKeyword,
    name: normalizeSearchUser(searchUser),
    start: searchDate[0],
    end: searchDate[1],
  }
}

export function mergeLogItems(currentLogs = [], nextLogs = []) {
  return currentLogs.concat(nextLogs)
}

export function hasMoreLogItems(items = []) {
  return items.length > 0
}

export function isLogNoMoreError(error) {
  return error?.data?.code === LOG_NO_MORE_CODE || error?.response?.data?.code === LOG_NO_MORE_CODE
}

export function buildLogKeyword({ searchUser = '', searchKeyword = '', searchDate = [] } = {}) {
  const parts = []

  if (searchUser) {
    parts.push(searchUser)
  }

  if (searchKeyword) {
    parts.push(searchKeyword)
  }

  if (Array.isArray(searchDate) && searchDate.length === 2) {
    parts.push(`${searchDate[0]}至${searchDate[1]}`)
  }

  return parts.join(' ')
}

export function hasActiveLogFilters({ searchUser = '', searchKeyword = '', searchDate = [] } = {}) {
  return Boolean(searchUser || searchKeyword || (Array.isArray(searchDate) && searchDate.length === 2))
}
