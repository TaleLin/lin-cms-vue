import { describe, expect, it, vi } from 'vitest'

import {
  buildLogKeyword,
  canQueryLoggedUsers,
  createLogSearchKeywordCommit,
  hasActiveLogFilters,
  LOG_SEARCH_DEBOUNCE_WAIT,
  normalizeSearchUser,
} from '@/view/log/log-helpers'

describe('log helpers', () => {
  it('builds readable search keywords from active filters', () => {
    expect(
      buildLogKeyword({
        searchUser: '七月',
        searchKeyword: '删除图书',
        searchDate: ['2026-04-01 00:00:00', '2026-04-02 00:00:00'],
      }),
    ).toBe('七月 删除图书 2026-04-01 00:00:00至2026-04-02 00:00:00')

    expect(buildLogKeyword({ searchKeyword: '登录' })).toBe('登录')
    expect(buildLogKeyword()).toBe('')
    expect(hasActiveLogFilters({ searchKeyword: '登录' })).toBe(true)
    expect(hasActiveLogFilters({ searchDate: ['2026-04-01 00:00:00', '2026-04-02 00:00:00'] })).toBe(true)
    expect(hasActiveLogFilters()).toBe(false)
  })

  it('normalizes selected users and checks permission gates', () => {
    expect(normalizeSearchUser('全部人员')).toBe('')
    expect(normalizeSearchUser('Pedro')).toBe('Pedro')

    expect(canQueryLoggedUsers({ admin: true }, [])).toBe(true)
    expect(canQueryLoggedUsers({}, ['查询日志记录的用户'])).toBe(true)
    expect(canQueryLoggedUsers({}, [])).toBe(false)
  })

  it('debounces keyword commits and trims the submitted text', async () => {
    vi.useFakeTimers()

    try {
      const onCommit = vi.fn()
      const commitKeyword = createLogSearchKeywordCommit(onCommit)

      commitKeyword(' lin ')
      commitKeyword(' lin cms ')

      await vi.advanceTimersByTimeAsync(LOG_SEARCH_DEBOUNCE_WAIT)

      expect(onCommit).toHaveBeenCalledTimes(1)
      expect(onCommit).toHaveBeenCalledWith('lin cms')
    } finally {
      vi.useRealTimers()
    }
  })
})
