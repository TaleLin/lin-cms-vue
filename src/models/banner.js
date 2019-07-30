/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class Banner {
  async addBanner(info) {
    const res = await post('sleeve/banner/', info)
    return res
  }

  async getBanner(id) {
    const res = await get(`sleeve/banner/${id}`)
    return res
  }

  async editBanner(id, info) {
    const res = await put(`sleeve/banner/${id}`, info)
    return res
  }

  async delectBanner(id) {
    const res = await _delete(`sleeve/banner/${id}`)
    return res
  }

  async getBanners({ page = 0, count = 5 }) {
    const res = await get('sleeve/banner/page', { page, count })
    return res
  }
}

export default new Banner()
