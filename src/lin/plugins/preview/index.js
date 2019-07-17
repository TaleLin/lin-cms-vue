import Vue from 'vue'
import Preview from '@/components/base/preview/preview'


const previewImage = {}
previewImage.install = (Vue, options = {}) => { // eslint-disable-line
  const PreviewConstructor = Vue.extend(Preview)

  let instance = null

  // eslint-disable-next-line func-names
  PreviewConstructor.prototype.close = function () {
    this.data = []
    this.options = {}
    this.imageIndex = 0
  }

  const getInstance = () => {
    if (!instance) {
      instance = new PreviewConstructor()
    }
    return instance
  }

  Vue.prototype.$imagePreview = (opts = {}) => { // eslint-disable-line
    const elem = document.createElement('div')
    if (!instance) {
      let myInstance = getInstance()
      Vue.prototype.$previewInstance = myInstance // eslint-disable-line
      myInstance.$mount(elem)
      myInstance.data = opts.images || []
      myInstance.imageIndex = opts.index || 0
      myInstance.options = opts.defaultOpt || {}
      document.body.appendChild(myInstance.$el)
      myInstance.$on('close', () => {
        myInstance.close()
        document.body.removeChild(myInstance.$el)
        myInstance.$destroy()
        myInstance = null
        instance = null
      })
    }
  }
}

Vue.use(previewImage)

export default previewImage
