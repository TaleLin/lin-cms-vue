import { describe, expect, it } from 'vitest'

import { createViewRoute } from '@/router/home-router'

describe('home-router', () => {
  it('maps stage config values into route meta without stringifying them', () => {
    const component = () => null
    const route = createViewRoute(
      {
        route: '/demo',
        name: 'DemoRoute',
        title: 'Demo',
        icon: 'House',
        permission: ['view:demo'],
        type: 'view',
        filePath: 'view/demo/demo.vue',
        blueBaseColor: '#1890ff',
        inNav: true,
        order: 9,
      },
      {
        '../view/demo/demo.vue': component,
      },
    )

    expect(route).toMatchObject({
      path: '/demo',
      name: 'DemoRoute',
      component,
      meta: {
        title: 'Demo',
        icon: 'House',
        permission: ['view:demo'],
        type: 'view',
        blueBaseColor: '#1890ff',
      },
    })
    expect(route.meta).not.toHaveProperty('inNav')
    expect(route.meta).not.toHaveProperty('order')
  })

  it('fails fast when the stage config points to a missing view component', () => {
    expect(() =>
      createViewRoute(
        {
          route: '/missing',
          name: 'MissingRoute',
          title: 'Missing',
          icon: 'QuestionFilled',
          type: 'view',
          filePath: 'view/missing/index.vue',
        },
        {},
      ),
    ).toThrow('Missing route component for "view/missing/index.vue"')
  })

  it('fails fast when the stage config does not contain required route fields', () => {
    expect(() =>
      createViewRoute(
        {
          name: Symbol('BrokenRoute'),
          title: 'Broken',
          type: 'view',
          filePath: 'view/broken/index.vue',
        },
        {},
      ),
    ).toThrow('Invalid route config: missing route')
  })
})
