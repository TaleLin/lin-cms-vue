import { describe, expect, it } from 'vitest'

import stageConfig from '@/config/stage'

describe('stage config', () => {
  it('uses distinct route name descriptions for the book list and create pages', () => {
    const bookStage = stageConfig.find(item => item.title === '图书管理')
    const bookChildren = bookStage?.children || []
    const routeNameDescriptions = bookChildren.map(item => item.name?.description)

    expect(routeNameDescriptions).toEqual(['BookList', 'BookCreate'])
  })
})
