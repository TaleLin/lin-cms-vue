import { createRequire } from 'node:module'

import * as prettier from 'prettier'
import { describe, expect, it } from 'vitest'

const require = createRequire(import.meta.url)
const { renderPluginConfig } = require('../../script/lib/generate-plugin-config')

describe('plugin config generator', () => {
  it('renders plugin config that passes prettier when plugins exist', async () => {
    const result = await renderPluginConfig([
      { camelCaseName: 'demoPlugin', name: 'demo-plugin' },
      { camelCaseName: 'fooBar', name: 'foo-bar' },
    ])

    const prettierConfig = (await prettier.resolveConfig('src/config/stage/plugin.js')) || {}

    await expect(prettier.check(result, { ...prettierConfig, filepath: 'src/config/stage/plugin.js' })).resolves.toBe(
      true,
    )
    expect(result).not.toContain('\n\n\n')
  })
})
