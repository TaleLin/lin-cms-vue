export function isImageIcon(icon) {
  return typeof icon === 'string' && icon.includes('/')
}

export function getLayoutIconSource(icon = '') {
  return typeof icon === 'string' ? icon : ''
}

export function shouldUseImageIcon(icon = '') {
  return isImageIcon(getLayoutIconSource(icon))
}

export function getViewportState(clientWidth, clientHeight) {
  return {
    clientWidth,
    clientHeight,
    isPhone: clientWidth < 500,
  }
}

export function getInitialSidebarState(clientWidth) {
  return {
    isCollapse: clientWidth <= 768,
    shouldShowSearch: clientWidth > 768,
  }
}

export function getAsideStyle({ isPhone, isCollapse, clientHeight, expandedWidth }) {
  if (!isPhone) {
    return {}
  }

  return {
    position: 'absolute',
    height: `${clientHeight}px`,
    zIndex: 12,
    transform: isCollapse ? 'translateX(0)' : `translateX(-${expandedWidth})`,
  }
}

export function getSidebarWidth({ isPhone, isCollapse, expandedWidth, collapsedWidth }) {
  if (isPhone) {
    return expandedWidth
  }

  return isCollapse ? collapsedWidth : expandedWidth
}

export function flattenSidebarItems(items = []) {
  const result = []

  const traverse = source => {
    if (Array.isArray(source)) {
      source.forEach(traverse)
      return
    }

    if (source.children?.length) {
      source.children.forEach(traverse)
      return
    }

    result.push(source)
  }

  traverse(items)
  return result
}

export function findSidebarMatches(items = [], keyword = '') {
  if (!keyword) {
    return []
  }

  return flattenSidebarItems(items)
    .filter(item => item.title?.includes(keyword))
    .map(item => ({
      key: `${item.path}-${item.title}`,
      path: item.path,
      title: item.title,
    }))
}

export function getBreadcrumbTitles(stageInfo = []) {
  return stageInfo.map(item => item.title).filter(Boolean)
}

export function getBreadcrumbItems(stageInfo = []) {
  const pathSegments = []

  return stageInfo.reduce((items, item) => {
    if (!item?.title) {
      return items
    }

    const segment = item.route || item.path || item.name || item.title
    pathSegments.push(String(segment))
    items.push({
      key: pathSegments.join(' > '),
      title: item.title,
    })
    return items
  }, [])
}

export function getMenuTabs(stageInfo = []) {
  if (stageInfo.length < 2) {
    return []
  }

  const parent = stageInfo[stageInfo.length - 2]

  if (parent.type !== 'tab') {
    return []
  }

  return parent.children
    .filter(item => item.inNav)
    .map(item => ({
      icon: item.icon || '',
      title: item.title,
      path: item.route,
    }))
}
