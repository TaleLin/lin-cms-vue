import { describe, expect, it } from 'vitest'

import { isFailedResponse, isSuccessfulResponse } from '@/lin/util/response'

describe('response util', () => {
  it('judges responses by the default success threshold', () => {
    expect(isSuccessfulResponse({ code: 0 })).toBe(true)
    expect(isSuccessfulResponse({ code: 9997 })).toBe(true)
    expect(isSuccessfulResponse({ code: 9998 })).toBe(false)
    expect(isFailedResponse({ code: 9998 })).toBe(true)
    expect(isFailedResponse({ code: 0 })).toBe(false)
  })

  it('supports custom success thresholds', () => {
    expect(isSuccessfulResponse({ code: 100 }, 200)).toBe(true)
    expect(isSuccessfulResponse({ code: 200 }, 200)).toBe(false)
    expect(isFailedResponse({ code: 200 }, 200)).toBe(true)
  })

  it('treats invalid response payloads as failed', () => {
    expect(isSuccessfulResponse()).toBe(false)
    expect(isSuccessfulResponse({ code: '0' })).toBe(false)
    expect(isFailedResponse()).toBe(true)
  })
})
