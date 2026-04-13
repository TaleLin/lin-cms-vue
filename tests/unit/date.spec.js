import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDateAfterDays, getDateAfterHours } from '@/lin/util/date'

describe('date utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds hours relative to the current time', () => {
    expect(getDateAfterHours(3).toISOString()).toBe('2024-01-01T03:00:00.000Z')
  })

  it('adds days relative to the current time', () => {
    expect(getDateAfterDays(2).toISOString()).toBe('2024-01-03T00:00:00.000Z')
  })
})
