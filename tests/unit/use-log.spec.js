import { defineComponent, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { LOG_SEARCH_DEBOUNCE_WAIT } from '@/view/log/log-helpers'
import { useLog } from '@/view/log/use-log'

const createHost = options =>
  defineComponent({
    name: 'UseLogHost',
    setup(_, { expose }) {
      const logState = useLog(options)
      expose(logState)
      return () => null
    },
  })

describe('use-log', () => {
  it('loads the initial log list and falls back to the default list when all filters are cleared', async () => {
    vi.useFakeTimers()

    try {
      const userStore = {
        user: {},
        permissions: [],
      }
      const logService = {
        getLoggedUsers: vi.fn(),
        getLogs: vi
          .fn()
          .mockResolvedValueOnce({ items: [{ id: 1, message: 'init-1' }] })
          .mockResolvedValueOnce({ items: [{ id: 2, message: 'init-2' }] }),
        searchLogs: vi.fn().mockResolvedValue({ items: [{ id: 3, message: 'search' }], total: 1 }),
        moreLogPage: vi.fn(),
        moreSearchPage: vi.fn(),
      }

      const Host = createHost({
        userStore,
        logService,
        highlightKeyword: vi.fn((_keyword, items) => items),
        message: {
          error: vi.fn(),
        },
      })
      const wrapper = mount(Host)

      await vi.runAllTimersAsync()
      await flushPromises()
      await nextTick()

      expect(logService.getLoggedUsers).not.toHaveBeenCalled()
      expect(logService.getLogs).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.logs).toEqual([{ id: 1, message: 'init-1' }])
      expect(wrapper.vm.count).toBe(1)

      wrapper.vm.searchKeywordInput = '日志'
      await nextTick()
      await vi.advanceTimersByTimeAsync(LOG_SEARCH_DEBOUNCE_WAIT)
      await flushPromises()
      await nextTick()

      expect(logService.searchLogs).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.keyword).toBe('日志')
      expect(wrapper.vm.logs).toEqual([{ id: 3, message: 'search' }])
      expect(wrapper.vm.count).toBe(1)

      wrapper.vm.clearKeywordSearch()
      await nextTick()
      await flushPromises()
      await nextTick()

      expect(logService.getLogs).toHaveBeenCalledTimes(2)
      expect(wrapper.vm.keyword).toBe('')
      expect(wrapper.vm.logs).toEqual([{ id: 2, message: 'init-2' }])
      expect(wrapper.vm.count).toBe(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('loads logged users for authorized operators and paginates highlighted search results', async () => {
    vi.useFakeTimers()

    try {
      const highlightKeyword = vi.fn((keyword, items) =>
        items.map(item => ({
          ...item,
          message: `${keyword}:${item.message}`,
        })),
      )
      const userStore = {
        user: { admin: true },
        permissions: [],
      }
      const logService = {
        getLoggedUsers: vi.fn().mockResolvedValue({ items: ['alice'] }),
        getLogs: vi.fn().mockResolvedValue({ items: [] }),
        searchLogs: vi.fn().mockResolvedValue({
          items: [{ id: 11, message: 'first' }],
          total: 2,
        }),
        moreLogPage: vi.fn(),
        moreSearchPage: vi.fn().mockResolvedValue({
          items: [{ id: 12, message: 'second' }],
        }),
      }

      const Host = createHost({
        userStore,
        logService,
        highlightKeyword,
        message: {
          error: vi.fn(),
        },
      })
      const wrapper = mount(Host)

      await vi.runAllTimersAsync()
      await flushPromises()
      await nextTick()

      expect(logService.getLoggedUsers).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.users).toEqual({ items: ['alice'] })

      wrapper.vm.handleCommand(['alice'])
      await flushPromises()
      await nextTick()

      expect(logService.searchLogs).toHaveBeenCalledWith({
        count: 10,
        page: 0,
        keyword: '',
        name: 'alice',
        start: undefined,
        end: undefined,
      })

      wrapper.vm.searchKeywordInput = '删除'
      await nextTick()
      await vi.advanceTimersByTimeAsync(LOG_SEARCH_DEBOUNCE_WAIT)
      await flushPromises()
      await nextTick()

      expect(highlightKeyword).toHaveBeenCalledWith('删除', [{ id: 11, message: 'first' }])
      expect(wrapper.vm.logs).toEqual([{ id: 11, message: '删除:first' }])
      expect(wrapper.vm.count).toBe(1)

      await wrapper.vm.nextPage()

      expect(logService.moreSearchPage).toHaveBeenCalledTimes(1)
      expect(highlightKeyword).toHaveBeenCalledWith('删除', [{ id: 12, message: 'second' }])
      expect(wrapper.vm.logs).toEqual([
        { id: 11, message: '删除:first' },
        { id: 12, message: '删除:second' },
      ])
      expect(wrapper.vm.count).toBe(2)
    } finally {
      vi.useRealTimers()
    }
  })
})
