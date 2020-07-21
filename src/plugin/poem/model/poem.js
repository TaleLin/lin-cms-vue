/* eslint-disable class-methods-use-this */
import { get } from '@/lin/plugin/axios'

class Poem {
  async fetchPoem(params) {
    const res = await get(`plugin/poem/all?count=${params.count}`)
    return res
  }
}

export default new Poem()
