import { describe, expect, it } from 'vitest'

import {
  createMenuNavigationTarget,
  getMenuTreeIconSource,
  hasMenuChildren,
  isMenuTreeImageIcon,
} from '@/component/layout/sidebar/menu-tree-helpers'

describe('menu tree helpers', () => {
  it('detects whether a sidebar node has children', () => {
    expect(
      hasMenuChildren({
        children: [{ path: '/about' }],
      }),
    ).toBe(true)

    expect(
      hasMenuChildren({
        children: [],
      }),
    ).toBe(false)

    expect(hasMenuChildren(null)).toBe(false)
  })

  it('creates menu navigation targets for router pushes', () => {
    expect(createMenuNavigationTarget('/about')).toEqual({ path: '/about' })
  })

  it('derives menu-tree icon display information', () => {
    expect(getMenuTreeIconSource('/icons/about.png')).toBe('/icons/about.png')
    expect(getMenuTreeIconSource(null)).toBe('')
    expect(isMenuTreeImageIcon('/icons/about.png')).toBe(true)
    expect(isMenuTreeImageIcon('House')).toBe(false)
  })
})
