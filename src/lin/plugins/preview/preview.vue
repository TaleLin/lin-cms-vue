<template>
  <div v-if="data.length">
    <div ref="myGallery" class="my-gallery" data-pswp-uid="1">
      <div v-if="slides.length">
        <div :key="index" v-for="(l ,index) in slides">
          <img preview :src="l" alt="">
        </div>
      </div>
    </div>
    <div
      ref="pswpWrap"
      class="pswp"
      tabindex="-1"
      role="dialog"
      aria-hidden="true">
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
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
          </button>
          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
          </button>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// photoswipe接口文档 http://photoswipe.com/documentation/api.html

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUIDefault from 'photoswipe/dist/photoswipe-ui-default'

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
      slides: this.data || [],
      gallery: null, //
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
    initPhotoSwipe() {
      const that = this
      const defaultOptions = {
        fullscreenEl: true,
        shareEl: false,
        arrowEl: true,
        preloaderEl: true,
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
      const galleryElement = this.$refs.myGallery
      let pswpElement = this.$refs.pswpWrap
      const items = this.transThumbnailElements()
      let photoSwipeOptions = {
        galleryUID: galleryElement.getAttribute('data-pswp-uid'),
        getThumbBoundsFn: function (index) {
          let thumbnail = items[index].el
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          }
        },
        ...options
      }
      this.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUIDefault, items, photoSwipeOptions)
      this.gallery.init()
      // Gallery starts closing
      this.gallery.listen('close', () => {
        if (this.gallery) {
          this.gallery.close()
          this.gallery = null
        }
        that.$emit('close')
      })
    },
    transThumbnailElements() {
      const galleryElement = this.$refs.myGallery
      const items = []
      const previewElements = galleryElement.querySelectorAll('img[preview]')
      for (let i = 0, l = previewElements.length; i < l; i++) {
        let elem = previewElements[i]
        let rw = 0
        let rh = 0
        if (typeof elem.naturalWidth === "undefined") {
          // IE 6/7/8
          let img = new window.Image()
          img.src = elem.getAttribute('src')
          rw = img.width
          rh = img.height
        } else {
          // HTML5 browsers
          rw = elem.naturalWidth
          rh = elem.naturalHeight
        }
        items.push({
          el: elem,
          src: elem.getAttribute('src'),
          w: rw,
          h: rh,
        })
      }
      return items
    },
  },
  beforeDestroy() {
    // 销毁
    if (this.gallery) {
      this.gallery.close()
      this.gallery = null
    }
  },
}
</script>

<style lang="css" scoped>
.my-gallery {
  opacity: 0;
}
</style>
