import { describe, expect, it } from 'vitest'

import {
  appendHistoryEntryIfMissing,
  closeLeftHistories,
  closeRightHistories,
  createHistoryEntry,
  getContextMenuLeft,
  getContextMenuState,
  getNextPathOnClose,
  getReuseTabItemClass,
  keepOnlySelectedHistory,
  resolveHistoryStage,
  resolveHistoriesWithStage,
  restoreHistories,
  shouldShowReuseTabBar,
} from '@/component/layout/reuse-tab-helpers'

describe('reuse tab helpers', () => {
  it('creates history entries from a route record', () => {
    const route = {
      name: 'UserList',
      path: '/admin/user/list',
      matched: [{ path: '/' }, { path: '/admin/user/list' }],
    }

    expect(createHistoryEntry(route)).toEqual({
      stageId: 'UserList',
      path: '/admin/user/list',
      routePath: '/admin/user/list',
    })
  })

  it('prepends a route history entry only when the current path is missing', () => {
    const route = {
      name: 'UserList',
      path: '/admin/user/list',
      matched: [{ path: '/' }, { path: '/admin/user/list' }],
    }
    const histories = [{ path: '/about', routePath: '/about' }]

    expect(appendHistoryEntryIfMissing(histories, route)).toEqual([
      {
        stageId: 'UserList',
        path: '/admin/user/list',
        routePath: '/admin/user/list',
      },
      { path: '/about', routePath: '/about' },
    ])
    expect(appendHistoryEntryIfMissing([{ path: '/admin/user/list' }], route)).toEqual([{ path: '/admin/user/list' }])
  })

  it('restores histories by matching stage config', () => {
    const stageName = Symbol('userList')
    const localHistory = [{ name: 'userList', path: '/admin/user/list', routePath: '/admin/user/list' }]

    const histories = restoreHistories(localHistory, {
      getStageByName: name => (name === 'userList' ? { name: stageName } : null),
      getStageByRoute: () => null,
    })

    expect(histories).toEqual([
      { name: 'userList', path: '/admin/user/list', routePath: '/admin/user/list', stageId: stageName },
    ])
  })

  it('resolves a history stage from stored stage id before falling back to route path', () => {
    const stageId = Symbol('log')
    const stageById = { name: stageId, title: '日志管理', route: '/log' }
    const fallbackStage = { name: Symbol('about'), title: '关于', route: '/about' }

    expect(
      resolveHistoryStage(
        {
          stageId,
          routePath: '/about',
        },
        {
          getStageByName: name => (name === stageId ? stageById : null),
          getStageByRoute: () => fallbackStage,
        },
      ),
    ).toBe(stageById)
  })

  it('attaches resolved stages and drops unknown histories', () => {
    const knownStage = { name: 'about', title: '关于', route: '/about' }

    expect(
      resolveHistoriesWithStage([{ routePath: '/about' }, { routePath: '/missing' }], {
        getStageByName: () => null,
        getStageByRoute: path => (path === '/about' ? knownStage : null),
      }),
    ).toEqual([
      {
        routePath: '/about',
        stage: knownStage,
      },
    ])
  })

  it('computes whether the reuse tab bar should be displayed and which tab is active', () => {
    expect(shouldShowReuseTabBar([])).toBe(false)
    expect(shouldShowReuseTabBar([{ path: '/about' }])).toBe(false)
    expect(shouldShowReuseTabBar([{ path: '/about' }, { path: '/log' }])).toBe(true)

    expect(getReuseTabItemClass({ currentPath: '/log', historyPath: '/log' })).toBe('active')
    expect(getReuseTabItemClass({ currentPath: '/about', historyPath: '/log' })).toBe('')
  })

  it('computes context menu state and positions', () => {
    expect(getContextMenuState(0, 3)).toEqual({ hasLeft: false, hasRight: true })
    expect(getContextMenuState(2, 3)).toEqual({ hasLeft: true, hasRight: false })
    expect(getContextMenuLeft({ clientX: 400, offsetLeft: 100, offsetWidth: 200 })).toBe(74)
  })

  it('chooses the next path when closing the active tab', () => {
    const histories = [{ path: '/a' }, { path: '/b' }, { path: '/c' }]

    expect(getNextPathOnClose({ currentPath: '/b', histories, index: 1, defaultRoute: '/home' })).toBe('/a')
    expect(getNextPathOnClose({ currentPath: '/a', histories, index: 0, defaultRoute: '/home' })).toBe('/b')
    expect(getNextPathOnClose({ currentPath: '/x', histories, index: 0, defaultRoute: '/home' })).toBeNull()
  })

  it('keeps only the selected history and trims histories on both sides', () => {
    const histories = [{ path: '/a' }, { path: '/b' }, { path: '/c' }]

    expect(keepOnlySelectedHistory(histories, 1)).toEqual([{ path: '/b' }])
    expect(closeLeftHistories(histories, 1)).toEqual([{ path: '/b' }, { path: '/c' }])
    expect(closeRightHistories(histories, 1)).toEqual([{ path: '/a' }, { path: '/b' }])
  })
})
