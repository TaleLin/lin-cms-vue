import { get, request } from '@/lin/plugin/axios'

function createDefaultState({ uPage, uCount, lPage, lCount, sPage, sCount }) {
  return {
    name: null,
    start: null,
    end: null,
    keyword: null,
    uPage,
    uCount,
    lPage,
    lCount,
    sPage,
    sCount,
  }
}

function resolveQueryValue(value, fallback) {
  return value === undefined ? fallback : value
}

export function createLogModel({ uPage = 0, uCount = 5, lPage = 0, lCount = 10, sPage = 0, sCount = 10 } = {}) {
  const initialState = { uPage, uCount, lPage, lCount, sPage, sCount }
  const state = createDefaultState(initialState)

  function init() {
    Object.assign(state, createDefaultState(initialState))
  }

  function setBaseInfo(name, start, end) {
    state.name = name
    state.start = start
    state.end = end
  }

  function setKeyword(keyword) {
    state.keyword = keyword
  }

  function increaseUserPage() {
    state.uPage += 1
  }

  function increaseLogPage() {
    state.lPage += 1
  }

  function increaseSearchPage() {
    state.sPage += 1
  }

  async function addTestLog() {
    return get('cms/test/info')
  }

  async function getLoggedUsers({ count, page } = {}) {
    if (typeof count === 'number') {
      state.uCount = count
    }

    return get('cms/log/users', {
      count: typeof count === 'number' ? count : state.uCount,
      page: typeof page === 'number' ? page : state.uPage,
    })
  }

  async function getLogs({ count, page, name, start, end, next = false } = {}) {
    if (!next) {
      setBaseInfo(name, start, end)
    }

    if (page === 0) {
      state.lPage = 0
    }

    if (typeof count === 'number') {
      state.lCount = count
    }

    return request({
      url: 'cms/log',
      params: {
        count: typeof count === 'number' ? count : state.lCount,
        page: typeof page === 'number' ? page : state.lPage,
        name: resolveQueryValue(name, state.name),
        start: resolveQueryValue(start, state.start),
        end: resolveQueryValue(end, state.end),
      },
    })
  }

  async function searchLogs({ count, page, keyword, name, start, end, next = false } = {}) {
    if (!next) {
      setBaseInfo(name, start, end)
      setKeyword(keyword)
    }

    if (page === 0) {
      state.sPage = 0
    }

    if (typeof count === 'number') {
      state.sCount = count
    }

    return request({
      url: 'cms/log/search',
      params: {
        count: typeof count === 'number' ? count : state.sCount,
        page: typeof page === 'number' ? page : state.sPage,
        keyword: resolveQueryValue(keyword, state.keyword),
        name: resolveQueryValue(name, state.name),
        start: resolveQueryValue(start, state.start),
        end: resolveQueryValue(end, state.end),
      },
    })
  }

  async function moreUserPage() {
    increaseUserPage()
    return getLoggedUsers()
  }

  async function moreLogPage() {
    increaseLogPage()
    return getLogs({ next: true })
  }

  async function moreSearchPage() {
    increaseSearchPage()
    return searchLogs({ next: true })
  }

  return {
    addTestLog,
    getLoggedUsers,
    getLogs,
    init,
    moreLogPage,
    moreSearchPage,
    moreUserPage,
    searchLogs,
  }
}

export const logModel = createLogModel()
