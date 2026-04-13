import { beforeEach, describe, expect, it, vi } from 'vitest'

const axiosMocks = vi.hoisted(() => ({
  request: vi.fn(),
  get: vi.fn(),
}))

vi.mock('@/lin/plugin/axios', () => ({
  request: axiosMocks.request,
  get: axiosMocks.get,
}))

import { createLogModel, logModel } from '@/model/log'

describe('log model', () => {
  beforeEach(() => {
    axiosMocks.request.mockReset()
    axiosMocks.get.mockReset()
    logModel.init()
  })

  it('issues search requests through the shared request layer', async () => {
    axiosMocks.request.mockResolvedValue({ items: [] })

    await logModel.searchLogs({
      count: 5,
      page: 0,
      keyword: '删除图书',
      name: '七月',
      start: '2026-04-01 00:00:00',
      end: '2026-04-02 00:00:00',
    })

    expect(axiosMocks.request).toHaveBeenCalledWith({
      url: 'cms/log/search',
      params: {
        count: 5,
        page: 0,
        keyword: '删除图书',
        name: '七月',
        start: '2026-04-01 00:00:00',
        end: '2026-04-02 00:00:00',
      },
    })
  })

  it('keeps search state for loading the next search page', async () => {
    axiosMocks.request.mockResolvedValue({ items: [] })

    await logModel.searchLogs({
      count: 8,
      page: 0,
      keyword: '登录',
      name: 'Pedro',
      start: '2026-04-03 00:00:00',
      end: '2026-04-04 00:00:00',
    })
    await logModel.moreSearchPage()

    expect(axiosMocks.request).toHaveBeenNthCalledWith(2, {
      url: 'cms/log/search',
      params: {
        count: 8,
        page: 1,
        keyword: '登录',
        name: 'Pedro',
        start: '2026-04-03 00:00:00',
        end: '2026-04-04 00:00:00',
      },
    })
  })

  it('does not swallow search errors', async () => {
    const error = { data: { code: 10020, message: '没有更多数据' } }
    axiosMocks.request.mockRejectedValue(error)

    await expect(logModel.searchLogs({ keyword: '登录' })).rejects.toBe(error)
  })

  it('resets stored query state when a new model instance is re-initialized', async () => {
    const model = createLogModel()
    axiosMocks.request.mockResolvedValue({ items: [] })

    await model.searchLogs({
      keyword: '登录',
      name: 'Pedro',
      start: '2026-04-03 00:00:00',
      end: '2026-04-04 00:00:00',
    })

    model.init()
    await model.moreSearchPage()

    expect(axiosMocks.request).toHaveBeenNthCalledWith(2, {
      url: 'cms/log/search',
      params: {
        count: 10,
        page: 1,
        keyword: null,
        name: null,
        start: null,
        end: null,
      },
    })
  })

  it('loads logged users with explicit defaults and increments the user page for follow-up requests', async () => {
    const model = createLogModel({ uCount: 12, uPage: 0 })
    axiosMocks.get.mockResolvedValue({ items: [] })

    await model.getLoggedUsers()
    await model.getLoggedUsers({ count: 6, page: 3 })
    await model.moreUserPage()

    expect(axiosMocks.get).toHaveBeenNthCalledWith(1, 'cms/log/users', {
      count: 12,
      page: 0,
    })
    expect(axiosMocks.get).toHaveBeenNthCalledWith(2, 'cms/log/users', {
      count: 6,
      page: 3,
    })
    expect(axiosMocks.get).toHaveBeenNthCalledWith(3, 'cms/log/users', {
      count: 6,
      page: 1,
    })
  })

  it('loads logs with remembered filters and advances paging through moreLogPage', async () => {
    const model = createLogModel({ lCount: 9 })
    axiosMocks.request.mockResolvedValue({ items: [] })

    await model.getLogs({
      count: 4,
      page: 0,
      name: '七月',
      start: '2026-04-05 00:00:00',
      end: '2026-04-06 00:00:00',
    })
    await model.moreLogPage()

    expect(axiosMocks.request).toHaveBeenNthCalledWith(1, {
      url: 'cms/log',
      params: {
        count: 4,
        page: 0,
        name: '七月',
        start: '2026-04-05 00:00:00',
        end: '2026-04-06 00:00:00',
      },
    })
    expect(axiosMocks.request).toHaveBeenNthCalledWith(2, {
      url: 'cms/log',
      params: {
        count: 4,
        page: 1,
        name: '七月',
        start: '2026-04-05 00:00:00',
        end: '2026-04-06 00:00:00',
      },
    })
  })

  it('uses the log test endpoint and preserves remembered filters when the next page omits fields', async () => {
    const model = createLogModel({ lCount: 9, sCount: 7 })
    axiosMocks.get.mockResolvedValue({ code: 200 })
    axiosMocks.request.mockResolvedValue({ items: [] })

    await expect(model.addTestLog()).resolves.toEqual({ code: 200 })

    await model.getLogs({
      count: 5,
      page: 0,
      name: 'Pedro',
      start: '2026-04-01 00:00:00',
      end: '2026-04-02 00:00:00',
    })
    await model.getLogs({
      next: true,
      page: 4,
      name: undefined,
      start: undefined,
      end: undefined,
    })
    await model.searchLogs({
      count: 3,
      page: 0,
      keyword: '创建',
      name: 'Pedro',
      start: '2026-04-01 00:00:00',
      end: '2026-04-02 00:00:00',
    })
    await model.searchLogs({
      next: true,
      page: 2,
      keyword: undefined,
      name: undefined,
      start: undefined,
      end: undefined,
    })

    expect(axiosMocks.get).toHaveBeenCalledWith('cms/test/info')
    expect(axiosMocks.request).toHaveBeenNthCalledWith(2, {
      url: 'cms/log',
      params: {
        count: 5,
        page: 4,
        name: 'Pedro',
        start: '2026-04-01 00:00:00',
        end: '2026-04-02 00:00:00',
      },
    })
    expect(axiosMocks.request).toHaveBeenNthCalledWith(4, {
      url: 'cms/log/search',
      params: {
        count: 3,
        page: 2,
        keyword: '创建',
        name: 'Pedro',
        start: '2026-04-01 00:00:00',
        end: '2026-04-02 00:00:00',
      },
    })
  })
})
