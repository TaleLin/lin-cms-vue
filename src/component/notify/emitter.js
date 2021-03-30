class Emitter {
  constructor() {
    this.listeners = new Map()
  }

  addListener(label, callback, vm) {
    if (typeof callback === 'function') {
      // eslint-disable-next-line no-unused-expressions
      this.listeners.has(label) || this.listeners.set(label, [])
      this.listeners.get(label).push({ callback, vm })
      return true
    }
    return false
  }

  removeListener(label, callback, vm) {
    const listeners = this.listeners.get(label)
    let index

    if (listeners?.length) {
      index = listeners.reduce((i, listener, index) => {
        if (typeof listener.callback === 'function' && listener.callback === callback && listener.vm === vm) {
          // eslint-disable-next-line no-param-reassign
          i = index
        }
        return i
      }, -1)

      if (index > -1) {
        listeners.splice(index, 1)
        this.listeners.set(label, listeners)
        return true
      }
    }
    return false
  }

  emit(label, ...args) {
    const listeners = this.listeners.get(label)

    if (listeners?.length) {
      listeners.forEach(listener => {
        listener.callback.call(listener.vm, ...args)
      })
      return true
    }
    return false
  }
}

export default new Emitter()
