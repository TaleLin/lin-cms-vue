import { createRequire } from 'node:module'
import { defineConfig, loadEnv, normalizePath } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import {
  appResolveExtensions,
  createAlias,
  createCssConfig,
  createManualChunks,
  projectRoot,
  resolvePath,
} from './vite.shared.mjs'

const require = createRequire(`${process.cwd()}/package.json`)
const generatePluginConfig = require('./script/lib/generate-plugin-config.js')
const pluginRoot = resolvePath('./src/plugin')
const normalizedPluginRoot = normalizePath(pluginRoot)

function resolveAppEnv(mode) {
  const env = loadEnv(mode, projectRoot, 'VITE_')

  return {
    open: env.VITE_OPEN !== 'false',
  }
}

function createPluginStageSync() {
  let lastResult = ''

  const shouldRegenerate = file => normalizePath(file || '').startsWith(normalizedPluginRoot)

  const regenerate = server => {
    const { result } = generatePluginConfig()
    const changed = result !== lastResult
    lastResult = result

    if (server && changed) {
      server.ws.send({ type: 'full-reload' })
    }
  }

  return {
    name: 'lin-plugin-stage-sync',
    buildStart() {
      regenerate()
    },
    configureServer(server) {
      regenerate(server)
      server.watcher.add(pluginRoot)

      const onPluginChange = file => {
        if (shouldRegenerate(file)) {
          regenerate(server)
        }
      }

      server.watcher.on('add', onPluginChange)
      server.watcher.on('change', onPluginChange)
      server.watcher.on('unlink', onPluginChange)
      server.watcher.on('addDir', onPluginChange)
      server.watcher.on('unlinkDir', onPluginChange)
    },
  }
}

function createPlugins({ isTest }) {
  const elementPlusResolver = ElementPlusResolver({
    directives: true,
    importStyle: 'css',
  })

  return [
    vue(),
    AutoImport({
      dts: false,
      eslintrc: {
        enabled: false,
      },
      resolvers: [elementPlusResolver],
      vueTemplate: true,
    }),
    Components({
      dts: false,
      resolvers: [elementPlusResolver],
    }),
    !isTest && createPluginStageSync(),
  ].filter(Boolean)
}

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test' || process.env.VITEST === 'true'
  const env = resolveAppEnv(mode)

  return {
    envPrefix: 'VITE_',
    plugins: createPlugins({ isTest }),
    resolve: {
      alias: createAlias(),
      extensions: appResolveExtensions,
    },
    css: createCssConfig(),
    server: {
      open: env.open,
      port: env.port,
    },
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: createManualChunks,
        },
      },
    },
  }
})
