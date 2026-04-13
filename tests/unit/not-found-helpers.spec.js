import { describe, expect, it } from 'vitest'

import { getNotFoundContainerHeight, NOT_FOUND_HEADER_HEIGHT } from '@/view/error-page/not-found-helpers'

describe('not-found helpers', () => {
  it('computes the remaining viewport height below the header', () => {
    expect(getNotFoundContainerHeight(900)).toBe(`${900 - NOT_FOUND_HEADER_HEIGHT}px`)
    expect(getNotFoundContainerHeight(500, 100)).toBe('400px')
  })
})
