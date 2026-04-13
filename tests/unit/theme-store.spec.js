import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import {
  CHINA_THEME_OPTIONS,
  useThemeStore,
  syncPrimaryColorVars,
  DARK_PRIMARY_PALETTE,
  buildColorPalette,
} from '@/store/modules/theme'

describe('theme store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('uses lin classic as the default theme and exposes the configured theme options', () => {
    const themeStore = useThemeStore()

    expect(themeStore.activeThemeId).toBe('lin-classic')
    expect(themeStore.activeTheme).toMatchObject({
      id: 'lin-classic',
      name: '海月靛青',
    })
    expect(CHINA_THEME_OPTIONS).toEqual([
      expect.objectContaining({
        id: 'lin-classic',
        swatches: ['#355C85', '#F3EEE6', '#1F3550'],
      }),
      expect.objectContaining({
        id: 'book-ink',
        swatches: ['#7A5230', '#F4EDE4', '#4B3122'],
      }),
      expect.objectContaining({
        id: 'palace-vermilion',
        swatches: ['#A64B55', '#F4EBE7', '#5B2F36'],
      }),
      expect.objectContaining({
        id: 'ru-yao-celadon',
        swatches: ['#48655A', '#EEF0EA', '#244239'],
      }),
    ])
  })

  it('switches to a valid theme and ignores unknown ids', () => {
    const themeStore = useThemeStore()

    themeStore.setTheme('ru-yao-celadon')
    expect(themeStore.activeTheme).toMatchObject({
      id: 'ru-yao-celadon',
      name: '松岚黛绿',
    })

    themeStore.setTheme('missing-theme')
    expect(themeStore.activeTheme).toMatchObject({
      id: 'ru-yao-celadon',
      name: '松岚黛绿',
    })
  })

  it('supports dark mode toggle', () => {
    const themeStore = useThemeStore()

    expect(themeStore.isDark).toBe(false)

    themeStore.toggleDark()
    expect(themeStore.isDark).toBe(true)

    themeStore.toggleDark()
    expect(themeStore.isDark).toBe(false)

    themeStore.setDark(true)
    expect(themeStore.isDark).toBe(true)

    themeStore.setDark(false)
    expect(themeStore.isDark).toBe(false)
  })

  it('each theme includes color palette definitions', () => {
    CHINA_THEME_OPTIONS.forEach(theme => {
      expect(theme.colors).toBeDefined()
      expect(theme.colors.primary).toBeDefined()
      expect(theme.colors.primary.base.toLowerCase()).toBe(theme.swatches[0].toLowerCase())
      expect(theme.colors.success).toBeDefined()
      expect(theme.colors.warning).toBeDefined()
      expect(theme.colors.danger).toBeDefined()
      expect(theme.colors.info).toBeDefined()
    })
  })

  it('all themes share identical success/warning/danger/info palettes', () => {
    const reference = CHINA_THEME_OPTIONS[0].colors
    CHINA_THEME_OPTIONS.forEach(theme => {
      expect(theme.colors.success).toEqual(reference.success)
      expect(theme.colors.warning).toEqual(reference.warning)
      expect(theme.colors.danger).toEqual(reference.danger)
      expect(theme.colors.info).toEqual(reference.info)
    })
  })
})

describe('buildColorPalette', () => {
  it('returns exactly 7 keys', () => {
    const palette = buildColorPalette('#355C85')
    expect(Object.keys(palette)).toHaveLength(7)
    expect(palette).toHaveProperty('base')
    expect(palette).toHaveProperty('dark-2')
    expect(palette).toHaveProperty('light-3')
    expect(palette).toHaveProperty('light-5')
    expect(palette).toHaveProperty('light-7')
    expect(palette).toHaveProperty('light-8')
    expect(palette).toHaveProperty('light-9')
  })

  it('base equals the input color as-is', () => {
    const palette = buildColorPalette('#355C85')
    expect(palette.base).toBe('#355C85')
  })
})

describe('DARK_PRIMARY_PALETTE', () => {
  it('has correct 7 keys matching PRIMARY_VAR_MAP', () => {
    expect(Object.keys(DARK_PRIMARY_PALETTE)).toHaveLength(7)
    expect(DARK_PRIMARY_PALETTE).toHaveProperty('base')
    expect(DARK_PRIMARY_PALETTE).toHaveProperty('dark-2')
    expect(DARK_PRIMARY_PALETTE).toHaveProperty('light-3')
    expect(DARK_PRIMARY_PALETTE).toHaveProperty('light-5')
    expect(DARK_PRIMARY_PALETTE).toHaveProperty('light-7')
    expect(DARK_PRIMARY_PALETTE).toHaveProperty('light-8')
    expect(DARK_PRIMARY_PALETTE).toHaveProperty('light-9')
  })
})

describe('syncPrimaryColorVars', () => {
  beforeEach(() => {
    vi.stubGlobal('document', {
      documentElement: {
        style: {
          setProperty: vi.fn(),
        },
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sets all 7 primary CSS variables on documentElement', () => {
    const palette = buildColorPalette('#355C85')
    syncPrimaryColorVars(palette)

    expect(document.documentElement.style.setProperty).toHaveBeenCalledTimes(7)
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--el-color-primary', '#355C85')
    expect(document.documentElement.style.setProperty).toHaveBeenCalledWith(
      '--el-color-primary-dark-2',
      palette['dark-2'],
    )
  })

  it('does nothing when palette is undefined', () => {
    syncPrimaryColorVars(undefined)
    expect(document.documentElement.style.setProperty).not.toHaveBeenCalled()
  })

  it('does nothing when document is undefined', () => {
    vi.stubGlobal('document', undefined)
    expect(() => syncPrimaryColorVars(buildColorPalette('#355C85'))).not.toThrow()
  })
})
