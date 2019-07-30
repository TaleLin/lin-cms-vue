/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class Spu {
  async addSpu(info) {
    const res = await post('sleeve/spu/', info)
    return res
  }

  async getSpu(id) {
    const res = await get(`sleeve/spu/${id}`)
    return res
  }

  async getSpuWithNames(id) {
    const res = await get(`sleeve/spu/${id}/names`)
    return res
  }

  async editSpu(id, info) {
    const res = await put(`sleeve/spu/${id}`, info)
    return res
  }

  async delectSpu(id) {
    const res = await _delete(`sleeve/spu/${id}`)
    return res
  }

  async getSpus({ page = 0, count = 5 }) {
    const res = await get('sleeve/spu/page', { page, count })
    return res
  }

  async getSuggestions(id) {
    const res = await get('sleeve/spu/suggestion', { id })
    return res
  }
}

export default new Spu()
