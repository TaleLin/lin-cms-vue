/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class SpecKey {
  // 类中的方法可以代表一个用户行为
  async addSpecKey(info) {
    const res = await post('sleeve/spec_key/', info)
    return res
  }

  async getSpecKey(id) {
    const res = await get(`sleeve/spec_key/${id}`)
    return res
  }

  async getSpecKeyDetail(id) {
    const res = await get(`sleeve/spec_key/${id}/detail`)
    return res
  }

  async editSpecKey(id, info) {
    const res = await put(`sleeve/spec_key/${id}`, info)
    return res
  }

  async delectSpecKey(id) {
    const res = await _delete(`sleeve/spec_key/${id}`)
    return res
  }

  async getSpecKeys({ page = 0, count = 5 }) {
    const res = await get('sleeve/spec_key/page', { page, count })
    return res
  }

  async getSuggestions(id) {
    const res = await get('sleeve/spec_key/suggestion', { id })
    return res
  }
}

export default new SpecKey()
