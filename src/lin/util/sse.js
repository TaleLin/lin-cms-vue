import Vue from 'vue'
// import EventSourcePolyfill from 'event-source-polyfill'
import 'event-source-polyfill/src/eventsource'
import { getToken } from './cookie'
import store from '../../store'

export default class Sse {
  source = null

  /**
   * 需在vuex中确认有user对象后才能初始化，否则不连接服务器
   * 注意： sse单独走自己的请求路线，不与axios重合，所以axios里面的配置在此处失效
   * @param {string} url sse全路径
   * @param {Array} events 当前用户可监听的路径
   */
  constructor(url, events) {
    /* eslint-disable no-undef */
    this.source = new EventSourcePolyfill(url, {
      headers: {
        Authorization: getToken('access_token'),
      },
    })
    this.open()

    events.forEach(event => {
      this.addEventListener(event)
    })
  }

  open() {
    this.source.onopen = event => {
      console.log('sse opened', event)
    }
  }

  error() {
    this.source.onerror = event => {
      console.log('error', event)
    }
  }

  addEventListener(eventName) {
    this.source.addEventListener(eventName, event => {
      // console.log('receive one message: ', event.data)
      // console.log('receive one message: ', event.lastEventId)
      store.commit('ADD_UNREAD_MESSAGE', { data: event.data, id: event.lastEventId })
      Vue.prototype.$notify({
        title: '您有新的消息',
        dangerouslyUseHTMLString: true,
        message: `<strong class="my-notify">${JSON.parse(event.data).message}</strong>`,
      })
    })
  }
}
