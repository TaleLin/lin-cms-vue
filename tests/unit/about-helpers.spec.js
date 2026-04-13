import { describe, expect, it, vi } from 'vitest'

import {
  ABOUT_ARTICLES,
  ABOUT_QUANTITY_STATS,
  getAboutTeamSections,
  openArticleLink,
  shouldCondenseTeam,
} from '@/view/about/about-helpers'

describe('about helpers', () => {
  it('detects the compact team range', () => {
    expect(shouldCondenseTeam(1210)).toBe(true)
    expect(shouldCondenseTeam(1199)).toBe(false)
    expect(shouldCondenseTeam(1330)).toBe(false)
  })

  it('builds team sections and keeps static card data centralized', () => {
    expect(getAboutTeamSections(false)[1].members).toContain('Pedro')
    expect(getAboutTeamSections(true)[1].members).toEqual(['林间有风 CMS 组'])
    expect(ABOUT_QUANTITY_STATS).toHaveLength(4)
    expect(ABOUT_ARTICLES).toHaveLength(2)
  })

  it('delegates article opening to the provided opener', () => {
    const open = vi.fn()

    openArticleLink('https://example.com', open)

    expect(open).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener')
  })
})
