/* Author: https://github.com/nathantsoi/vue-native-websocket */
import Notify from './notify.vue'
import Observer from './observer'
import Emitter from './emitter'

export default {
  install(app, connection, opts = {}) {
    if (typeof connection === 'object') {
      // eslint-disable-next-line no-param-reassign
      opts = connection
      // eslint-disable-next-line no-param-reassign
      connection = ''
    }
    let observer = null

    opts.$setInstance = wsInstance => {
      app.config.globalProperties.$socket = wsInstance
    }
    app.config.globalProperties.$connect = (connectionUrl = connection, connectionOpts = opts) => {
      connectionOpts.$setInstance = opts.$setInstance
      observer = new Observer(connectionUrl, connectionOpts)
      app.config.globalProperties.$socket = observer.WebSocket
    }

    app.config.globalProperties.$disconnect = () => {
      if (observer?.reconnection) {
        observer.reconnection = false
      }
      if (app.config.globalProperties.$socket) {
        app.config.globalProperties.$socket.close()
        delete app.config.globalProperties.$socket
      }
    }
    const hasProxy = typeof Proxy !== 'undefined' && typeof Proxy === 'function' && /native code/.test(Proxy.toString())
    app.component('LinNotify', Notify)
    app.mixin({
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
      beforeUnmount() {
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
