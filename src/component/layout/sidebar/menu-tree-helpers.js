export function hasMenuChildren(item) {
  return Array.isArray(item?.children) && item.children.length > 0
}

export function createMenuNavigationTarget(path = '') {
  return { path }
}

export function getMenuTreeIconSource(icon = '') {
  return typeof icon === 'string' ? icon : ''
}

export function isMenuTreeImageIcon(icon = '') {
  return getMenuTreeIconSource(icon).includes('/')
}
