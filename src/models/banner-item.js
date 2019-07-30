/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class BannerItem {
  async addBannerItem(info) {
    const res = await post('sleeve/banner_item/', info)
    return res
  }

  async getBannerItem(id) {
    const res = await get(`sleeve/banner_item/${id}`)
    return res
  }

  async editBannerItem(id, info) {
    const res = await put(`sleeve/banner_item/${id}`, info)
    return res
  }

  async delectBannerItem(id) {
    const res = await _delete(`sleeve/banner_item/${id}`)
    return res
  }

  async getBannerItems({ page = 0, count = 5 }) {
    const res = await get('sleeve/banner_item/page', { page, count })
    return res
  }
}

export default new BannerItem()
