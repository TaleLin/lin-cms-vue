/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class ThirdUser {
  async addThirdUser(info) {
    const res = await post('sleeve/user/', info)
    return res
  }

  async getThirdUser(id) {
    const res = await get(`sleeve/user/${id}`)
    return res
  }

  async editThirdUser(id, info) {
    const res = await put(`sleeve/user/${id}`, info)
    return res
  }

  async delectThirdUser(id) {
    const res = await _delete(`sleeve/user/${id}`)
    return res
  }

  async getThirdUsers({ page = 0, count = 5 }) {
    const res = await get('sleeve/user/page', { page, count })
    return res
  }
}

export default new ThirdUser()
