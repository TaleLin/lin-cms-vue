import { describe, expect, it, vi } from 'vitest'

import { sortByOrder } from '@/lin/util/order'

describe('util helpers', () => {
  it('sorts ordered items without mutating unrelated entries', () => {
    const source = [
      { name: 'tail', order: 2 },
      { name: 'head', order: -1 },
      { name: 'middle' },
      { name: 'body', order: 0 },
    ]

    expect(sortByOrder(source)).toEqual([
      { name: 'body', order: 0 },
      { name: 'tail', order: 2 },
      { name: 'middle' },
      { name: 'head', order: -1 },
    ])
  })

  it('throws directly when sortByOrder receives a non-array value', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => sortByOrder(null)).toThrow('sortByOrder 传入参数不符合要求, 应为数组')
    expect(consoleError).not.toHaveBeenCalled()

    consoleError.mockRestore()
  })
})
