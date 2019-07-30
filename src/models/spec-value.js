/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class SpecValue {
  // 类中的方法可以代表一个用户行为
  async addSpecValue(info) {
    const res = await post('sleeve/spec_value/', info)
    return res
  }

  async getSpecValue(id) {
    const res = await get(`sleeve/spec_value/${id}`)
    return res
  }

  async editSpecValue(id, info) {
    const res = await put(`sleeve/spec_value/${id}`, info)
    return res
  }

  async delectSpecValue(id) {
    const res = await _delete(`sleeve/spec_value/${id}`)
    return res
  }

  async getSpecValues({ page = 0, count = 5 }) {
    const res = await get('sleeve/spec_value/page', { page, count })
    return res
  }
}

export default new SpecValue()
