export function createHistoryEntry(route) {
  return {
    stageId: route.name,
    path: route.path,
    routePath: route.matched[route.matched.length - 1].path,
  }
}

export function appendHistoryEntryIfMissing(histories = [], route) {
  if (histories.some(item => item.path === route?.path)) {
    return histories
  }

  return [createHistoryEntry(route), ...histories]
}

export function restoreHistories(localHistory = [], { getStageByName, getStageByRoute }) {
  return localHistory.reduce((histories, item) => {
    const stage = resolveHistoryStage(item, { getStageByName, getStageByRoute })

    if (!stage) {
      return histories
    }

    histories.push({
      ...item,
      stageId: stage.name,
    })

    return histories
  }, [])
}

export function resolveHistoryStage(history, { getStageByName, getStageByRoute }) {
  if (history?.stageId) {
    const stageById = getStageByName(history.stageId)
    if (stageById) {
      return stageById
    }
  }

  if (history?.name) {
    const stageByName = getStageByName(history.name)
    if (stageByName) {
      return stageByName
    }
  }

  return getStageByRoute(history?.routePath)
}

export function resolveHistoriesWithStage(histories = [], { getStageByName, getStageByRoute }) {
  return histories
    .map(history => ({
      ...history,
      stage: resolveHistoryStage(history, {
        getStageByName,
        getStageByRoute,
      }),
    }))
    .filter(history => Boolean(history.stage))
}

export function shouldShowReuseTabBar(histories = []) {
  return histories.length > 1
}

export function getReuseTabItemClass({ currentPath = '', historyPath = '' } = {}) {
  return currentPath === historyPath ? 'active' : ''
}

export function getContextMenuState(index, total) {
  return {
    hasLeft: index !== 0,
    hasRight: index + 1 !== total,
  }
}

export function getContextMenuLeft({ clientX, offsetLeft, offsetWidth, menuMinWidth = 126 }) {
  const maxLeft = offsetWidth - menuMinWidth
  const left = clientX - offsetLeft + 15

  return left > maxLeft ? maxLeft : left
}

export function getNextPathOnClose({ currentPath, histories, index, defaultRoute }) {
  if (currentPath !== histories[index]?.path) {
    return null
  }

  if (index > 0) {
    return histories[index - 1].path
  }

  if (histories.length > 1) {
    return histories[1].path
  }

  return defaultRoute
}

export function keepOnlySelectedHistory(histories = [], index) {
  const selectedHistory = histories[index]

  if (!selectedHistory) {
    return histories
  }

  return [selectedHistory]
}

export function closeLeftHistories(histories = [], index) {
  return histories.slice(index)
}

export function closeRightHistories(histories = [], index) {
  return histories.slice(0, index + 1)
}
