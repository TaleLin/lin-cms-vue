<template>
  <div v-if="data.length">
    <div ref="myGallery" class="my-gallery" :data-pswp-uid="radom">
      <div v-if="slides.length">
        <div :key="radom + '_' + index" v-for="(l, index) in slides"><img preview :src="l" alt="" /></div>
      </div>
    </div>
    <div ref="pswpWrap" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="pswp__bg"></div>
      <div class="pswp__scroll-wrap">
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <div class="pswp__counter"></div>
            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
            <button class="pswp__button pswp__button--share" title="Share"></button>
            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut"><div class="pswp__preloader__donut"></div></div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
          <div class="pswp__caption"><div class="pswp__caption__center"></div></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// photoswipe接口文档 http://photoswipe.com/documentation/api.html

import { Loading } from 'element-ui'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'
/** 生成随机字符串 */
function createId() {
  return Math.random()
    .toString(36)
    .substring(2)
}
export default {
  name: 'PreviewImage',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    imageIndex: {
      type: Number,
      default: 0,
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      radom: createId(),
      slides: this.data || [],
      gallery: null,
    }
  },
  watch: {
    data(newVal) {
      if (Array.isArray(newVal)) {
        this.slides = Object.assign([], newVal)
        if (newVal.length > 0) {
          this.$nextTick(() => {
            this.initPhotoSwipe()
          })
        }
      }
    },
  },
  mounted() {
    if (this.slides.length > 0) {
      this.$nextTick(() => {
        this.initPhotoSwipe()
      })
    }
  },
  methods: {
    /* eslint-disable */
    async initPhotoSwipe() {
      const that = this
      const defaultOptions = {
        fullscreenEl: true,
        shareEl: false,
        arrowEl: true,
        preloaderEl: true,
        history: false,
        loop: false,
        bgOpacity: 0.85,
        showHideOpacity: true,
        errorMsg: '<div class="pswp__error-msg">图片加载失败</div>',
      }
      let { options, imageIndex } = this
      options = options || {}
      options = Object.assign(defaultOptions, options, {
        index: imageIndex,
      })
      const loadingInstance = Loading.service()
      const galleryElement = this.$refs.myGallery
      this.radom = createId()
      let pswpElement = this.$refs.pswpWrap
      const items = await this.transThumbnailElements()
      let photoSwipeOptions = {
        galleryUID: this.radom,
        getThumbBoundsFn: function(index) {
          let thumbnail = items[index].el
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width,
          }
        },
        ...options,
      }
      this.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUIDefault, items, photoSwipeOptions)
      this.gallery.init()
      loadingInstance.close()
      // Gallery starts closing
      this.gallery.listen('close', () => {
        if (this.gallery) {
          this.gallery.close()
          this.gallery = null
          this.slides = []
        }
        that.$emit('close')
      })
    },
    async getWH(elem) {
      return new Promise((resolve, reject) => {
        if (typeof elem.naturalWidth === 'undefined') {
          // IE 6/7/8
          let img = new window.Image()
          img.src = elem.getAttribute('src')
          img.onload = function() {
            resolve({
              w: this.width,
              h: this.height,
            })
          }
          img.onerror = function() {
            reject({
              w: 0,
              h: 0,
            })
          }
        } else {
          if (elem.naturalWidth > 0) {
            resolve({
              w: elem.naturalWidth,
              h: elem.naturalHeight,
            })
          } else {
            elem.onload = function() {
              resolve({
                w: this.naturalWidth,
                h: this.naturalHeight,
              })
            }
          }
        }
      })
    },
    async transThumbnailElements() {
      const galleryElement = this.$refs.myGallery
      const items = []
      const previewElements = galleryElement.querySelectorAll('img[preview]')

      for (let i = 0, l = previewElements.length; i < l; i++) {
        let elem = previewElements[i]
        let rw = 0
        let rh = 0
        const wh = await this.getWH(elem)
        rw = wh.w
        rh = wh.h

        items.push({
          el: elem,
          src: elem.getAttribute('src'),
          w: rw,
          h: rh,
        })
      }
      return items
    },
    destroy() {
      // 销毁
      if (this.gallery) {
        this.gallery.close()
        this.gallery = null
      }
    },
  },
  beforeDestroy() {
    this.destroy()
  },
}
</script>

<style lang="scss" scoped>
.my-gallery {
  opacity: 0;
  display: none;
}
</style>
