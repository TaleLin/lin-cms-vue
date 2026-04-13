import { hasPermission } from '@/lin/util/permission'
import { getRandomStr } from '@/lin/util/random'

function visitStages(stages, visit) {
  const stageList = Array.isArray(stages) ? stages : [stages]

  stageList.forEach(stage => {
    if (!stage || typeof stage !== 'object') {
      return
    }

    if (stage.name) {
      visit(stage)
    }

    if (Array.isArray(stage.children) && stage.children.length > 0) {
      visitStages(stage.children, visit)
    }
  })
}

function buildSidebarItem(stage, level, createRandomPath) {
  if (!stage?.inNav) {
    return null
  }

  if (stage.type === 'view') {
    return {
      name: stage.name,
      title: stage.title,
      icon: stage.icon,
      isElementIcon: stage.isElementIcon,
      path: stage.route,
    }
  }

  if (stage.type === 'tab') {
    return {
      name: stage.name,
      title: stage.title,
      icon: stage.icon,
      isElementIcon: stage.isElementIcon,
      path: stage.route || stage.children?.[0]?.route,
    }
  }

  if (stage.type === 'folder' && level !== 0) {
    return {
      name: stage.name,
      title: stage.title,
      icon: stage.icon,
      isElementIcon: stage.isElementIcon,
      path: stage.route || createRandomPath(6),
      children: (stage.children || [])
        .map(child => buildSidebarItem(child, level - 1, createRandomPath))
        .filter(Boolean),
    }
  }

  if (level <= 0) {
    return {
      name: stage.name,
      title: stage.title,
      icon: stage.icon,
      isElementIcon: stage.isElementIcon,
      path: stage.children?.[0]?.route || createRandomPath(6),
    }
  }

  return null
}

export function filterAuthorizedStages(stages = [], permissions, currentUser, permissionChecker = hasPermission) {
  return stages.flatMap(stage => {
    if (!permissionChecker(permissions, stage, currentUser)) {
      return []
    }

    const nextStage = { ...stage }

    if (Array.isArray(stage.children)) {
      const visibleChildren = filterAuthorizedStages(stage.children, permissions, currentUser, permissionChecker)

      if (visibleChildren.length === 0) {
        return []
      }

      nextStage.children = visibleChildren
    }

    return [nextStage]
  })
}

export function createStageMap(stages = []) {
  const stageMap = {}

  visitStages(stages, stage => {
    stageMap[stage.name] = stage
  })

  return stageMap
}

export function createSidebarList(stages, level, createRandomPath = getRandomStr) {
  if (!Array.isArray(stages)) {
    return buildSidebarItem(stages, level, createRandomPath)
  }

  return stages.map(stage => buildSidebarItem(stage, level - 1, createRandomPath)).filter(Boolean)
}

export function findStageBranch(stages, name) {
  const stageList = Array.isArray(stages) ? stages : [stages]

  for (const stage of stageList) {
    if (!stage || typeof stage !== 'object') {
      continue
    }

    if (stage.name === name) {
      return [stage]
    }

    if (!Array.isArray(stage.children) || stage.children.length === 0) {
      continue
    }

    const branch = findStageBranch(stage.children, name)

    if (branch) {
      return [stage, ...branch]
    }
  }

  return null
}

export function findStageByRoutePath(stageMap, path) {
  return Reflect.ownKeys(stageMap)
    .map(key => stageMap[key])
    .find(stage => stage?.route === path)
}

export function mergeUserSnapshot(currentUser = {}, nextUser = {}) {
  return {
    ...(currentUser || {}),
    ...(nextUser || {}),
  }
}

export function mapPermissionIdentifiers(groups = []) {
  return groups.flatMap(group => Object.values(group).flat(2)).map(permission => permission.permission)
}

export function markMessageAsRead(message) {
  return {
    ...message,
    is_read: true,
  }
}

export function markMessageAsUnread(message) {
  return {
    ...message,
    is_read: false,
  }
}
