import { describe, expect, it, vi } from 'vitest'

import { sortByOrder } from '@/lin/util/order'
import { hasPermission } from '@/lin/util/permission'
import { getRandomStr } from '@/lin/util/random'
import { createDebouncedHandler, createThrottledHandler } from '@/lin/util/rate-limit'

describe('extracted util helpers', () => {
  it('checks route permissions with explicit admin and permission branches', () => {
    expect(hasPermission([], { permission: ['view:log'] }, { admin: true })).toBe(true)
    expect(hasPermission(['view:log'], { permission: ['view:log'] }, {})).toBe(true)
    expect(hasPermission([], { permission: ['view:log'] }, {})).toBe(false)
    expect(hasPermission([], {}, {})).toBe(true)
  })

  it('creates random keys and preserves staged order sorting', () => {
    expect(getRandomStr(8)).toHaveLength(8)
    expect(
      sortByOrder([
        { title: 'B', order: 2 },
        { title: 'A', order: 0 },
      ]),
    ).toEqual([
      { title: 'A', order: 0 },
      { title: 'B', order: 2 },
    ])
  })

  it('wraps lodash debounce and throttle with explicit helper names', async () => {
    vi.useFakeTimers()

    try {
      const debounced = vi.fn()
      const throttled = vi.fn()
      const runDebounced = createDebouncedHandler(debounced, 50)
      const runThrottled = createThrottledHandler(throttled, 50)

      runDebounced('debounced')
      runThrottled('first')
      runThrottled('second')

      await vi.advanceTimersByTimeAsync(60)

      expect(debounced).toHaveBeenCalledWith('debounced')
      expect(throttled).toHaveBeenCalledTimes(2)
    } finally {
      vi.useRealTimers()
    }
  })
})
