import { describe, expect, it } from 'vitest'

import { extractResponseMessage, resolveResponseErrorMessage } from '@/lin/plugin/axios-response-helpers'

describe('axios response helpers', () => {
  it('extracts backend messages from strings, arrays and objects', () => {
    expect(extractResponseMessage('直接错误')).toBe('直接错误')
    expect(extractResponseMessage(['首个错误', '第二个错误'])).toBe('首个错误')
    expect(extractResponseMessage({ field: ['字段错误'] })).toBe('字段错误')
  })

  it('prefers backend messages over mapped frontend error codes', () => {
    expect(
      resolveResponseErrorMessage({
        code: 10030,
        message: ['后端返回错误'],
        useFrontEndErrorMsg: true,
        showBackend: false,
        errorCodeMap: {
          777: '前端错误码未定义',
          10030: '参数错误',
        },
      }),
    ).toBe('后端返回错误')
  })

  it('falls back to mapped frontend messages when backend messages are absent', () => {
    expect(
      resolveResponseErrorMessage({
        code: 10030,
        message: null,
        useFrontEndErrorMsg: true,
        showBackend: false,
        errorCodeMap: {
          777: '前端错误码未定义',
          10030: '参数错误',
        },
      }),
    ).toBe('参数错误')
  })

  it('uses the fallback code when no specific frontend code exists', () => {
    expect(
      resolveResponseErrorMessage({
        code: 12345,
        message: null,
        useFrontEndErrorMsg: true,
        showBackend: false,
        errorCodeMap: {
          777: '前端错误码未定义',
        },
      }),
    ).toBe('前端错误码未定义')
  })

  it('suppresses frontend code mapping when showBackend is enabled', () => {
    expect(
      resolveResponseErrorMessage({
        code: 10030,
        message: null,
        useFrontEndErrorMsg: true,
        showBackend: true,
        errorCodeMap: {
          777: '前端错误码未定义',
          10030: '参数错误',
        },
      }),
    ).toBe('')
  })
})
