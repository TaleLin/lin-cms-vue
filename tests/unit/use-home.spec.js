import { describe, expect, it } from 'vitest'

import {
  getAppMainMinHeight,
  getHeaderActionsClasses,
  getHomeShellClasses,
  getHomeStyleVars,
  getSidebarToggleClasses,
  getSidenavMaskClasses,
} from '@/view/home/home-helpers'

describe('use-home helpers', () => {
  it('computes the app main min height from layout metrics', () => {
    expect(getAppMainMinHeight(900)).toBe('764px')
  })

  it('returns the home style vars from viewport metrics', () => {
    expect(getHomeStyleVars(900)).toEqual({
      '--home-app-main-min-height': '764px',
      '--home-expanded-sidebar-width': '210px',
      '--home-viewport-height': '900px',
      '--home-header-actions-height': '86px',
      '--home-header-actions-compact-height': '45px',
    })
  })

  it('derives stable layout state classes', () => {
    expect(getHomeShellClasses({ isPhone: true, isPhoneSidebarOpen: true })).toEqual({
      'home-shell--phone': true,
      'home-shell--sidebar-open': true,
    })
    expect(getHeaderActionsClasses({ hasReuseTab: true })).toEqual({
      'home-shell__header-actions--compact': true,
    })
    expect(getSidebarToggleClasses({ isDesktopSidebarCollapsed: true })).toEqual({
      'home-shell__toggle-icon--collapsed': true,
    })
    expect(getSidenavMaskClasses({ isVisible: true })).toEqual({
      'home-shell__sidenav-mask--visible': true,
    })
  })
})
