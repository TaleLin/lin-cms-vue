/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class Category {
  async addCategory(info) {
    const res = await post('sleeve/category/', info)
    return res
  }

  async getCategory(id) {
    const res = await get(`sleeve/category/${id}`)
    return res
  }

  async editCategory(id, info) {
    const res = await put(`sleeve/category/${id}`, info)
    return res
  }

  async delectCategory(id) {
    const res = await _delete(`sleeve/category/${id}`)
    return res
  }

  async getCategorys({ page = 0, count = 5 }) {
    const res = await get('sleeve/category/page', { page, count })
    return res
  }

  async getSuggestions(id) {
    const res = await get('sleeve/category/suggestion', { id })
    return res
  }
}

export default new Category()
