export const HOME_LAYOUT_METRICS = {
  appMainMinHeightOffset: 136,
  headerActionsHeight: 86,
  compactHeaderActionsHeight: 45,
}

export const HOME_LAYOUT_DIMENSIONS = {
  expandedSidebarWidth: '210px',
  collapsedSidebarWidth: '64px',
}

export const HOME_BACK_TOP_PROPS = {
  right: 50,
  bottom: 50,
  fontSize: 34,
}

export const HOME_LAYOUT_CLASS_NAMES = {
  phone: 'home-shell--phone',
  sidebarOpen: 'home-shell--sidebar-open',
  headerActionsCompact: 'home-shell__header-actions--compact',
  toggleIconCollapsed: 'home-shell__toggle-icon--collapsed',
  sidenavMaskVisible: 'home-shell__sidenav-mask--visible',
}

export function getAppMainMinHeight(clientHeight, metrics = HOME_LAYOUT_METRICS) {
  const minHeight = clientHeight - metrics.appMainMinHeightOffset
  return `${Math.max(minHeight, 0)}px`
}

export function getHomeStyleVars(
  viewportHeight,
  { metrics = HOME_LAYOUT_METRICS, dimensions = HOME_LAYOUT_DIMENSIONS } = {},
) {
  return {
    '--home-app-main-min-height': getAppMainMinHeight(viewportHeight, metrics),
    '--home-expanded-sidebar-width': dimensions.expandedSidebarWidth,
    '--home-viewport-height': `${viewportHeight}px`,
    '--home-header-actions-height': `${metrics.headerActionsHeight}px`,
    '--home-header-actions-compact-height': `${metrics.compactHeaderActionsHeight}px`,
  }
}

export function getHomeShellClasses({ isPhone, isPhoneSidebarOpen }) {
  return {
    [HOME_LAYOUT_CLASS_NAMES.phone]: isPhone,
    [HOME_LAYOUT_CLASS_NAMES.sidebarOpen]: isPhoneSidebarOpen,
  }
}

export function getHeaderActionsClasses({ hasReuseTab }) {
  return {
    [HOME_LAYOUT_CLASS_NAMES.headerActionsCompact]: hasReuseTab,
  }
}

export function getSidebarToggleClasses({ isDesktopSidebarCollapsed }) {
  return {
    [HOME_LAYOUT_CLASS_NAMES.toggleIconCollapsed]: isDesktopSidebarCollapsed,
  }
}

export function getSidenavMaskClasses({ isVisible }) {
  return {
    [HOME_LAYOUT_CLASS_NAMES.sidenavMaskVisible]: isVisible,
  }
}
