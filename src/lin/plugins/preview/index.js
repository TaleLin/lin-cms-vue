import Vue from 'vue'
import Preview from '@/components/base/preview/preview'

const previewImage = {}
previewImage.install = (Vue, options = {}) => { // eslint-disable-line
  const PreviewConstructor = Vue.extend(Preview)

  // eslint-disable-next-line func-names
  PreviewConstructor.prototype.close = function () {
    this.data = []
    this.options = {}
    this.imageIndex = 0
  }

  Vue.prototype.$imagePreview = (opts = {}) => { // eslint-disable-line
    const elem = document.createElement('div')
    let instance = new PreviewConstructor()
    instance.$mount(elem)
    instance.data = opts.images || []
    instance.imageIndex = opts.index || 0
    instance.options = opts.defaultOpt || {}
    document.body.appendChild(instance.$el)
    instance.$on('close', () => {
      instance.close()
      document.body.removeChild(instance.$el)
      instance.$destroy()
      instance = null
    })
  }
}

Vue.use(previewImage)

export default previewImage
