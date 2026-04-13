import { findSidebarMatches } from '@/component/layout/layout-helpers'

export function resolveSidebarMenuCollapse({ isPhone = false, isCollapse = false } = {}) {
  if (isPhone) {
    return false
  }

  return isCollapse
}

export function hasSidebarItems(sidebarList = []) {
  return Array.isArray(sidebarList) && sidebarList.length > 0
}

export function getSidebarSearchGroups(sidebarList = [], keyword = '', matcher = findSidebarMatches) {
  return matcher(sidebarList, keyword)
}

export function shouldShowSidebarSearch({ configEnabled = true, visible = true, sidebarList = [] } = {}) {
  return Boolean(configEnabled && visible && hasSidebarItems(sidebarList))
}
