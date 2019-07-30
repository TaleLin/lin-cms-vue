/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class Brand {
  async addBrand(info) {
    const res = await post('sleeve/brand/', info)
    return res
  }

  async getBrand(id) {
    const res = await get(`sleeve/brand/${id}`)
    return res
  }

  async editBrand(id, info) {
    const res = await put(`sleeve/brand/${id}`, info)
    return res
  }

  async delectBrand(id) {
    const res = await _delete(`sleeve/brand/${id}`)
    return res
  }

  async getBrands({ page = 0, count = 5 }) {
    const res = await get('sleeve/brand/page', { page, count })
    return res
  }

  async getSuggestions(id) {
    const res = await get('sleeve/brand/suggestion', { id })
    return res
  }
}

export default new Brand()
