/* eslint-disable class-methods-use-this */
import _axios, { get } from '@/lin/plugin/axios'

class Log {
  name = null

  start = null

  end = null

  keyword = null

  constructor({
    uPage = 0,
    uCount = 5,

    lPage = 0,
    lCount = 15,

    sPage = 0,
    sCount = 15,
  }) {
    if (uPage === 0) {
      this.uPage = uPage
    }
    if (uCount) {
      this.uCount = uCount
    }
    if (lPage === 0) {
      this.lPage = lPage
    }
    if (lCount) {
      this.lCount = lCount
    }
    if (sPage === 0) {
      this.sPage = sPage
    }
    if (sCount) {
      this.sCount = sCount
    }
    // lCount && this.lCount = lCount
  }

  async increaseUpage() {
    this.uPage += 1
  }

  async increaseLpage() {
    this.lPage += 1
  }

  increaseSpage() {
    this.sPage += 1
  }

  init() {
    this.lPage = 0
    this.uPage = 0
    this.sPage = 0
  }

  setBaseInfo(name, start, end) {
    this.name = name
    this.start = start
    this.end = end
  }

  setKeyword(keyword) {
    this.keyword = keyword
  }

  async addTestLog() {
    const log = await get('cms/test/info')
    return log
  }

  /**
   * 查询已经被记录过日志的用户（分页）
   * @param {number} count 每页个数
   * @param {number} page 第几页
   */
  async getLoggedUsers({ count, page }) {
    const users = await get('cms/log/users', {
      count: count || this.uCount,
      page: page || this.uPage,
    })
    return users
  }

  /**
   * 查询日志信息（分页）
   * @param {number} count 每页个数
   * @param {number} page 第几页
   * @param {number} name 用户昵称
   * @param {number} start 起始时间 # 2018-11-01 09:39:35
   * @param {number} end 结束时间
   */
  async getLogs({ count, page, name, start, end, next = false }) {
    if (!next) {
      this.setBaseInfo(name, start, end)
    }
    if (page === 0) {
      this.lPage = 0
    }
    const res = await _axios({
      url: 'cms/log',
      params: {
        count: count || this.lCount,
        page: page || this.lPage,
        name: name || this.name,
        start: start || this.start,
        end: end || this.end,
      },
      handleError: true,
    })
    return res
  }

  /**
   * 所搜日志信息（分页）
   * @param {number} count 每页个数
   * @param {number} page 第几页
   * @param {number} keyword 搜索关键词
   * @param {number} name 用户昵称
   * @param {number} start 起始时间 # 2018-11-01 09:39:35
   * @param {number} end 结束时间
   */
  async searchLogs({ count, page, keyword, name, start, end, next = false }) {
    if (!next) {
      this.setBaseInfo(name, start, end)
      this.setKeyword(keyword)
    }
    if (page === 0) {
      this.sPage = 0
    }
    try {
      const res = await get('cms/log/search', {
        count: count || this.sCount,
        page: page || this.sPage,
        keyword: keyword || this.keyword,
        name: name || this.name,
        start: start || this.start,
        end: end || this.end,
      })
      return res
    } catch (error) {
      console.log(error)
    }
  }

  async moreUserPage() {
    await this.increaseUpage()
    return this.getLoggedUsers({})
  }

  async moreLogPage() {
    await this.increaseLpage()
    return this.getLogs({ next: true })
  }

  async moreSearchPage() {
    this.increaseSpage()
    return this.searchLogs({ next: true })
  }
}

export default new Log({})
