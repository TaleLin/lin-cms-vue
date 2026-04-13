import { reactive, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DARK_PRIMARY_PALETTE, useThemeStore } from '@/store/modules/theme'

const route = reactive({
  meta: {
    title: '仪表盘',
  },
})

vi.mock('vue-router', () => ({
  useRoute: () => route,
}))

describe('App', () => {
  beforeEach(() => {
    document.title = ''
    document.body.innerHTML = '<div id="loader"></div>'
    delete document.documentElement.dataset.chinaTheme
    document.documentElement.className = ''
    document.documentElement.style.removeProperty('--el-color-primary')
    route.meta.title = '仪表盘'
  })

  it('syncs the page title from the current route meta', async () => {
    const App = (await import('@/app.vue')).default

    mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterView: true,
        },
      },
    })

    await nextTick()
    expect(document.title).toBe('仪表盘')

    route.meta.title = ''
    await nextTick()

    expect(document.title).toBe('lin-cms')
  })

  it('hides the startup loader after mount', async () => {
    const App = (await import('@/app.vue')).default

    mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: {
          RouterView: true,
        },
      },
    })

    await nextTick()

    expect(document.getElementById('loader')?.style.display).toBe('none')
  })

  it('syncs theme state to the document element and primary color variables', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)

    const App = (await import('@/app.vue')).default
    const themeStore = useThemeStore()

    mount(App, {
      global: {
        plugins: [pinia],
        stubs: {
          RouterView: true,
        },
      },
    })

    await nextTick()

    expect(document.documentElement.dataset.chinaTheme).toBe('lin-classic')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.getPropertyValue('--el-color-primary')).toBe(
      themeStore.activeTheme.colors.primary.base,
    )

    themeStore.setDark(true)
    await nextTick()

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.getPropertyValue('--el-color-primary')).toBe(DARK_PRIMARY_PALETTE.base)

    themeStore.setTheme('book-ink')
    themeStore.setDark(false)
    await nextTick()

    expect(document.documentElement.dataset.chinaTheme).toBe('book-ink')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.getPropertyValue('--el-color-primary')).toBe(
      themeStore.activeTheme.colors.primary.base,
    )
  })
})
