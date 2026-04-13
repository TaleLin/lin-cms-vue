import { nextTick, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useHomeLayout } from '@/view/home/use-home-layout'

function createLayout({ width = 1024, height = 768, initialPath = '/home' } = {}) {
  const route = reactive({
    fullPath: initialPath,
  })
  const windowSize = {
    width: ref(width),
    height: ref(height),
  }
  const reuseTabClear = vi.fn()
  const reuseTabRef = ref({ clearTabs: reuseTabClear })

  const wrapper = mount({
    template: '<div />',
    setup() {
      return useHomeLayout({
        route,
        windowSize,
        reuseTabRef,
      })
    },
  })

  return { wrapper, route, windowSize, reuseTabClear }
}

describe('useHomeLayout', () => {
  it('derives layout values from viewport metrics', () => {
    const { wrapper } = createLayout({ width: 1200, height: 900 })

    expect(wrapper.vm.sidebarWidth).toBe('210px')
    expect(wrapper.vm.homeStyleVars['--home-viewport-height']).toBe('900px')
    expect(wrapper.vm.homeStyleVars['--home-header-actions-height']).toBe('86px')
    expect(wrapper.vm.isPhone).toBe(false)
    expect(wrapper.vm.showSidebarSearch).toBe(true)
    expect(wrapper.vm.backTopProps).toEqual({
      right: 50,
      bottom: 50,
      fontSize: 34,
    })
  })

  it('initializes the desktop sidebar state synchronously from the viewport width', () => {
    const { wrapper } = createLayout({ width: 700, height: 900 })

    expect(wrapper.vm.isPhone).toBe(false)
    expect(wrapper.vm.isDesktopSidebarCollapsed).toBe(true)
    expect(wrapper.vm.sidebarWidth).toBe('64px')
    expect(wrapper.vm.showSidebarSearch).toBe(false)
  })

  it('toggles desktop collapse state and tracks reuse tab visibility', () => {
    const { wrapper } = createLayout()

    expect(wrapper.vm.isDesktopSidebarCollapsed).toBe(false)
    wrapper.vm.toggleSidebar()
    expect(wrapper.vm.isDesktopSidebarCollapsed).toBe(true)
    expect(wrapper.vm.sidebarWidth).toBe('64px')
    expect(wrapper.vm.showSidebarSearch).toBe(false)
    expect(wrapper.vm.toggleIconClasses['home-shell__toggle-icon--collapsed']).toBe(true)

    wrapper.vm.handleHistoryCountChange(2)
    expect(wrapper.vm.hasReuseTab).toBe(true)
    expect(wrapper.vm.headerActionsClasses['home-shell__header-actions--compact']).toBe(true)
    wrapper.vm.handleHistoryCountChange(1)
    expect(wrapper.vm.hasReuseTab).toBe(false)
    expect(wrapper.vm.headerActionsClasses['home-shell__header-actions--compact']).toBe(false)
  })

  it('clears the reuse tab through the provided ref', () => {
    const { wrapper, reuseTabClear } = createLayout()

    wrapper.vm.clearReuseTab()
    expect(reuseTabClear).toHaveBeenCalledTimes(1)
  })

  it('closes the phone sidebar when the route changes', async () => {
    const { wrapper, route } = createLayout({ width: 360 })

    expect(wrapper.vm.isDesktopSidebarCollapsed).toBe(false)
    expect(wrapper.vm.showSidebarSearch).toBe(false)
    wrapper.vm.toggleSidebar()
    expect(wrapper.vm.isSidenavMaskVisible).toBe(true)
    expect(wrapper.vm.homeShellClasses['home-shell--sidebar-open']).toBe(true)
    expect(wrapper.vm.toggleIconClasses['home-shell__toggle-icon--collapsed']).toBe(false)

    route.fullPath = '/next'
    await nextTick()

    expect(wrapper.vm.isSidenavMaskVisible).toBe(false)
    expect(wrapper.vm.homeShellClasses['home-shell--sidebar-open']).toBe(false)
  })
})
