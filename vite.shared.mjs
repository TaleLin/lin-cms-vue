import { fileURLToPath, URL } from 'node:url'
import { normalizePath } from 'vite'

export function resolvePath(pathname) {
  return fileURLToPath(new URL(pathname, import.meta.url))
}

export const projectRoot = resolvePath('.')
export const appResolveExtensions = ['.mjs', '.js', '.json', '.vue']

const srcRoot = resolvePath('./src')
const sharedStylePath = normalizePath(resolvePath('./src/assets/style/shared.scss'))
const elementPlusComponentChunks = Object.freeze({
  'vendor-ui-form': [
    'autocomplete',
    'cascader',
    'cascader-panel',
    'checkbox',
    'checkbox-button',
    'checkbox-group',
    'color-picker',
    'date-picker',
    'date-picker-panel',
    'form',
    'form-item',
    'input',
    'input-number',
    'input-tag',
    'mention',
    'option',
    'option-group',
    'radio',
    'radio-button',
    'radio-group',
    'rate',
    'select',
    'select-v2',
    'slider',
    'switch',
    'time-picker',
    'time-select',
    'transfer',
    'tree-select',
    'upload',
  ],
  'vendor-ui-data': [
    'avatar',
    'avatar-group',
    'badge',
    'calendar',
    'card',
    'countdown',
    'descriptions',
    'descriptions-item',
    'empty',
    'image',
    'image-viewer',
    'pagination',
    'progress',
    'result',
    'skeleton',
    'skeleton-item',
    'statistic',
    'table',
    'table-column',
    'table-v2',
    'tag',
    'timeline',
    'timeline-item',
    'tree',
    'tree-v2',
    'virtual-list',
  ],
  'vendor-ui-nav': [
    'anchor',
    'anchor-link',
    'backtop',
    'breadcrumb',
    'breadcrumb-item',
    'dropdown',
    'dropdown-item',
    'dropdown-menu',
    'menu',
    'menu-item',
    'menu-item-group',
    'page-header',
    'step',
    'steps',
    'sub-menu',
    'tab-pane',
    'tabs',
  ],
  'vendor-ui-feedback': [
    'alert',
    'dialog',
    'drawer',
    'loading',
    'message',
    'message-box',
    'notification',
    'popover',
    'popconfirm',
    'tooltip',
    'tour',
    'tour-step',
  ],
  'vendor-ui-layout': [
    'affix',
    'aside',
    'button',
    'button-group',
    'col',
    'collapse',
    'collapse-item',
    'collapse-transition',
    'container',
    'divider',
    'footer',
    'header',
    'icon',
    'link',
    'main',
    'overlay',
    'row',
    'scrollbar',
    'space',
    'splitter',
    'splitter-panel',
    'text',
  ],
})
const vendorChunkGroups = Object.freeze({
  'vendor-vue': ['vue', 'vue-router', 'pinia', 'pinia-plugin-persistedstate', '@vueuse/core'],
  'vendor-upload': ['cropperjs', 'vue-picture-cropper', 'swiper'],
  'vendor-utils': ['axios', 'dayjs', 'lodash', 'screenfull', 'event-source-polyfill', 'fastscan'],
})

function resolveElementPlusChunk(id) {
  if (id.includes('/node_modules/@element-plus/icons-vue/')) {
    return 'vendor-icons'
  }

  const componentMatch = id.match(/\/element-plus\/(?:es|lib)\/components\/([^/]+)\//)
  const componentName = componentMatch?.[1]

  if (componentName) {
    for (const [chunkName, componentNames] of Object.entries(elementPlusComponentChunks)) {
      if (componentNames.includes(componentName)) {
        return chunkName
      }
    }
  }

  if (id.includes('/node_modules/element-plus/')) {
    return 'vendor-ui-core'
  }

  return null
}

export function createAlias() {
  return {
    '@': srcRoot,
    lin: resolvePath('./src/lin'),
    assets: resolvePath('./src/assets'),
  }
}

export function createCssConfig() {
  return {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "${sharedStylePath}" as *;`,
      },
    },
  }
}

export function createManualChunks(id) {
  if (!id.includes('/node_modules/')) {
    return undefined
  }

  const elementPlusChunk = resolveElementPlusChunk(id)
  if (elementPlusChunk) {
    return elementPlusChunk
  }

  for (const [chunkName, packageNames] of Object.entries(vendorChunkGroups)) {
    const matchesChunk = packageNames.some(packageName => id.includes(`/node_modules/${packageName}/`))

    if (matchesChunk) {
      return chunkName
    }
  }

  return 'vendor-misc'
}
