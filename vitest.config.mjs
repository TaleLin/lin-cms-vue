import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

import { appResolveExtensions, createAlias, createCssConfig } from './vite.shared.mjs'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: createAlias(),
    extensions: appResolveExtensions,
  },
  css: createCssConfig(),
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/unit/**/*.spec.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,vue}'],
      exclude: ['src/main.js', 'src/router/**', 'src/config/**'],
      thresholds: {
        statements: 75,
        branches: 65,
        functions: 69,
        lines: 76,
      },
    },
  },
})
