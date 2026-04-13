import { describe, expect, it } from 'vitest'

import {
  createStageConfig,
  filterDuplicatedPluginStages,
  normalizeStageNames,
  visitStageViews,
} from '@/config/stage/stage-helpers'
import { createHomeRoutes } from '@/router/home-router'

describe('stage helpers', () => {
  it('filters duplicate plugin stage references and normalizes missing names to symbols', () => {
    const duplicatedPlugin = {
      title: '插件页',
      type: 'view',
      route: '/plugin/demo',
      filePath: 'plugin/demo/index.vue',
      inNav: true,
    }
    const baseStages = [duplicatedPlugin]

    expect(filterDuplicatedPluginStages(baseStages, [duplicatedPlugin])).toEqual([])

    const normalized = normalizeStageNames(
      [
        {
          title: '根目录',
          children: [{ title: '子页', name: 'child' }],
        },
      ],
      () => 'random-stage',
    )

    expect(typeof normalized[0].name).toBe('symbol')
    expect(normalized[0].children[0].name.description).toBe('child')
  })

  it('creates normalized stage config without mutating plugin duplicates', () => {
    const pluginStage = {
      title: '插件页',
      type: 'view',
      route: '/plugin/demo',
      filePath: 'plugin/demo/index.vue',
      inNav: true,
      order: 3,
    }

    const stageConfig = createStageConfig({
      baseStages: [
        {
          title: '首页',
          type: 'view',
          route: '/about',
          filePath: 'view/about/about.vue',
          inNav: true,
          order: 1,
        },
      ],
      pluginStages: [pluginStage],
      createRandomName: () => 'generated-stage',
    })

    expect(stageConfig).toHaveLength(2)
    expect(stageConfig[0].route).toBe('/about')
    expect(typeof stageConfig[1].name).toBe('symbol')
    expect(pluginStage.name).toBeUndefined()
  })

  it('visits leaf stages and creates routes from them', () => {
    const views = []
    const config = [
      {
        title: '目录',
        children: [
          {
            title: '子页',
            route: '/demo',
            name: Symbol('Demo'),
            filePath: 'view/demo/demo.vue',
            type: 'view',
          },
        ],
      },
    ]

    visitStageViews(config, view => {
      views.push(view.title)
    })

    const routes = createHomeRoutes(config, {
      '../view/demo/demo.vue': () => null,
    })

    expect(views).toEqual(['子页'])
    expect(routes).toHaveLength(1)
    expect(routes[0].path).toBe('/demo')
  })

  it('creates plugin routes from plugin stage view modules', () => {
    const pluginStage = [
      {
        title: '插件演示',
        route: '/plugin/demo',
        name: Symbol('PluginDemo'),
        filePath: 'plugin/demo/index.vue',
        type: 'view',
      },
    ]

    const routes = createHomeRoutes(pluginStage, {
      '../plugin/demo/index.vue': () => null,
    })

    expect(routes).toHaveLength(1)
    expect(routes[0]).toMatchObject({
      path: '/plugin/demo',
      name: pluginStage[0].name,
    })
    expect(routes[0].component).toBeTypeOf('function')
  })

  it('creates a large batch of stage routes without dropping or duplicating entries', () => {
    const largeStageConfig = Array.from({ length: 200 }, (_, index) => ({
      title: `批量页面-${index + 1}`,
      route: `/batch/${index + 1}`,
      name: Symbol(`Batch${index + 1}`),
      filePath: `view/batch/page-${index + 1}.vue`,
      type: 'view',
    }))
    const moduleMap = Object.fromEntries(largeStageConfig.map(stage => [`../${stage.filePath}`, () => null]))

    const routes = createHomeRoutes(largeStageConfig, moduleMap)

    expect(routes).toHaveLength(200)
    expect(new Set(routes.map(route => route.path)).size).toBe(200)
    expect(routes[0].path).toBe('/batch/1')
    expect(routes[199].path).toBe('/batch/200')
  })
})
