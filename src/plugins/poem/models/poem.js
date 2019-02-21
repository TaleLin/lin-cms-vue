/* eslint-disable class-methods-use-this */
import { get } from '@/lin/utils/http'

class Poem {
  async fetchPoem() {
    const res = await get('plugin/poem/all')
    return res
  }
}

export default new Poem()
