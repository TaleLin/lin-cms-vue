import { describe, expect, it } from 'vitest'

import {
  buildHighlightedMessageSegments,
  escapeSearchKeyword,
  highlightSearchKeyword,
  searchForWord,
  searchForWords,
  searchLogKeyword,
} from '@/lin/util/search'

describe('search utils', () => {
  it('searches one or many words through fastscan', async () => {
    await expect(searchForWord('微信', '今日头条和微信都支持搜索')).resolves.toEqual([[5, '微信']])
    await expect(searchForWords(['微信', '支付宝'], '微信和支付宝都出现了')).resolves.toEqual([
      [0, '微信'],
      [3, '支付宝'],
    ])
  })

  it('escapes keywords before building highlight regexes', () => {
    expect(escapeSearchKeyword('a+b?')).toBe('a\\+b\\?')
    expect(highlightSearchKeyword('a+b? a+b?', 'a+b?', 'hit')).toBe(
      '<span class="hit">a+b?</span> <span class="hit">a+b?</span>',
    )
    expect(buildHighlightedMessageSegments('a+b? a+b?', 'a+b?')).toEqual([
      { text: 'a+b?', highlighted: true },
      { text: ' ', highlighted: false },
      { text: 'a+b?', highlighted: true },
    ])
  })

  it('highlights log messages without mutating the original list', () => {
    const sourceLogs = [
      { id: 1, message: '用户执行了 a+b? 操作' },
      { id: 2, message: '普通日志' },
    ]

    const result = searchLogKeyword('a+b?', sourceLogs)

    expect(result).toEqual([
      {
        id: 1,
        message: '用户执行了 <span class="strong">a+b?</span> 操作',
        messageSegments: [
          { text: '用户执行了 ', highlighted: false },
          { text: 'a+b?', highlighted: true },
          { text: ' 操作', highlighted: false },
        ],
      },
      {
        id: 2,
        message: '普通日志',
        messageSegments: [{ text: '普通日志', highlighted: false }],
      },
    ])
    expect(sourceLogs).toEqual([
      { id: 1, message: '用户执行了 a+b? 操作' },
      { id: 2, message: '普通日志' },
    ])
  })
})
