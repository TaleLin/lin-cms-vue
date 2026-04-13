import stageConfig from '@/config/stage'
import { visitStageViews } from '@/config/stage/stage-helpers'
import { assertViewRouteConfig, createRouteMeta } from './router-helpers'

const viewModules = import.meta.glob('../view/**/*.vue')
const pluginModules = import.meta.glob('../plugin/**/*.vue')

const modules = { ...viewModules, ...pluginModules }

function getModuleKey(filePath) {
  return `../${filePath}`
}

export function createViewRoute(viewConfig, moduleMap = modules) {
  assertViewRouteConfig(viewConfig)

  const moduleKey = getModuleKey(viewConfig.filePath)
  const component = moduleMap[moduleKey]

  if (!component) {
    throw new Error(`Missing route component for "${viewConfig.filePath}"`)
  }

  return {
    path: viewConfig.route,
    name: viewConfig.name,
    component,
    meta: createRouteMeta(viewConfig),
  }
}

export function createHomeRoutes(config = stageConfig, moduleMap = modules) {
  const routes = []

  visitStageViews(config, viewConfig => {
    routes.push(createViewRoute(viewConfig, moduleMap))
  })

  return routes
}

const homeRouter = createHomeRoutes()

export default homeRouter
