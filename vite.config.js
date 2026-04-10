import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve('src'),
      lin: resolve('src/lin'),
      assets: resolve('src/assets'),
    },
    extensions: ['.js', '.json', '.vue', '.scss', '.html'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'shared' as *;`,
        loadPaths: [resolve('src/assets/style'), resolve('src/plugin/lin-cms-ui/assets/style')],
        silenceDeprecations: ['import'],
      },
    },
  },
  server: {
    port: 8080,
    open: true,
  },
  build: {
    sourcemap: false,
    target: 'es2015',
  },
})
