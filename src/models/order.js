/* eslint-disable class-methods-use-this */
import {
  post, get, put, _delete,
} from '@/lin/plugins/axios'

class Order {
  async addOrder(info) {
    const res = await post('sleeve/order/', info)
    return res
  }

  async getOrder(id) {
    const res = await get(`sleeve/order/${id}`)
    return res
  }

  async editOrder(id, info) {
    const res = await put(`sleeve/order/${id}`, info)
    return res
  }

  async delectOrder(id) {
    const res = await _delete(`sleeve/order/${id}`)
    return res
  }

  async getOrders({ page = 0, count = 5 }) {
    const res = await get('sleeve/order/page', { page, count })
    return res
  }
}

export default new Order()
