/* eslint-disable*/

/* Author: https://github.com/nathantsoi/vue-native-websocket */
import Notify from './notify.vue'
import Observer from './observer'
import Emitter from './emitter'

export default {
  install(Vue, connection, opts = {}) {
    if (typeof connection === 'object') {
      opts = connection
      connection = ''
    }
    let observer = null

    opts.$setInstance = wsInstance => {
      Vue.prototype.$socket = wsInstance
    }
    Vue.prototype.$connect = (connectionUrl = connection, connectionOpts = opts) => {
      connectionOpts.$setInstance = opts.$setInstance
      observer = new Observer(connectionUrl, connectionOpts)
      Vue.prototype.$socket = observer.WebSocket
    }

    Vue.prototype.$disconnect = () => {
      if (observer && observer.reconnection) {
        observer.reconnection = false
      }
      if (Vue.prototype.$socket) {
        Vue.prototype.$socket.close()
        delete Vue.prototype.$socket
      }
    }
    const hasProxy = typeof Proxy !== 'undefined' && typeof Proxy === 'function' && /native code/.test(Proxy.toString())
    Vue.component('LinNotify', Notify)
    Vue.mixin({
      created() {
        const vm = this
        const { sockets } = this.$options

        if (hasProxy) {
          this.$options.sockets = new Proxy(
            {},
            {
              set(target, key, value) {
                Emitter.addListener(key, value, vm)
                target[key] = value
                return true
              },
              deleteProperty(target, key) {
                Emitter.removeListener(key, vm.$options.sockets[key], vm)
                delete target.key
                return true
              },
            },
          )
          if (sockets) {
            Object.keys(sockets).forEach(key => {
              this.$options.sockets[key] = sockets[key]
            })
          }
        } else {
          Object.seal(this.$options.sockets)

          // if !hasProxy need addListener
          if (sockets) {
            Object.keys(sockets).forEach(key => {
              Emitter.addListener(key, sockets[key], vm)
            })
          }
        }
      },
      beforeDestroy() {
        if (hasProxy) {
          const { sockets } = this.$options

          if (sockets) {
            Object.keys(sockets).forEach(key => {
              delete this.$options.sockets[key]
            })
          }
        }
      },
    })
  },
}
