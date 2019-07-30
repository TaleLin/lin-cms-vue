/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class Sku {
  async addSku(info) {
    const res = await post('sleeve/sku/', info)
    return res
  }

  async getSku(id) {
    const res = await get(`sleeve/sku/${id}`)
    return res
  }

  async getSkuWithName(id) {
    const res = await get(`sleeve/sku/${id}/name`)
    return res
  }

  async editSku(id, info) {
    const res = await put(`sleeve/sku/${id}`, info)
    return res
  }

  async delectSku(id) {
    const res = await _delete(`sleeve/sku/${id}`)
    return res
  }

  async getSkus({ page = 0, count = 5 }) {
    const res = await get('sleeve/sku/page', { page, count })
    return res
  }

  async getSuggestions(spuId, id) {
    const res = await get('sleeve/sku/suggestion', { id, spu_id: spuId })
    return res
  }
}

export default new Sku()
