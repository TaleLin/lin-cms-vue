import { describe, expect, it } from 'vitest'

import { createManualChunks } from '../../vite.shared.mjs'

describe('createManualChunks', () => {
  it('returns undefined for application source files', () => {
    expect(createManualChunks('/project/src/view/home/home.vue')).toBeUndefined()
  })

  it('groups vue ecosystem packages into the vue vendor chunk', () => {
    expect(createManualChunks('/project/node_modules/vue/dist/vue.runtime.esm-bundler.js')).toBe('vendor-vue')
    expect(createManualChunks('/project/node_modules/@vueuse/core/index.mjs')).toBe('vendor-vue')
  })

  it('splits element-plus packages by UI domain and isolates the icon package', () => {
    expect(createManualChunks('/project/node_modules/element-plus/es/index.mjs')).toBe('vendor-ui-core')
    expect(createManualChunks('/project/node_modules/element-plus/es/components/input/index.mjs')).toBe(
      'vendor-ui-form',
    )
    expect(createManualChunks('/project/node_modules/element-plus/es/components/table/index.mjs')).toBe(
      'vendor-ui-data',
    )
    expect(createManualChunks('/project/node_modules/element-plus/es/components/menu/index.mjs')).toBe('vendor-ui-nav')
    expect(createManualChunks('/project/node_modules/element-plus/es/components/dialog/index.mjs')).toBe(
      'vendor-ui-feedback',
    )
    expect(createManualChunks('/project/node_modules/element-plus/es/components/button/index.mjs')).toBe(
      'vendor-ui-layout',
    )
    expect(createManualChunks('/project/node_modules/@element-plus/icons-vue/dist/index.js')).toBe('vendor-icons')
  })

  it('groups upload-related libraries separately', () => {
    expect(createManualChunks('/project/node_modules/cropperjs/dist/cropper.esm.js')).toBe('vendor-upload')
    expect(createManualChunks('/project/node_modules/swiper/swiper.mjs')).toBe('vendor-upload')
  })

  it('groups common utility libraries separately and falls back for the rest', () => {
    expect(createManualChunks('/project/node_modules/axios/index.js')).toBe('vendor-utils')
    expect(createManualChunks('/project/node_modules/dayjs/dayjs.min.js')).toBe('vendor-utils')
    expect(createManualChunks('/project/node_modules/nprogress/nprogress.js')).toBe('vendor-misc')
  })
})
