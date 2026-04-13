import { describe, expect, it, vi } from 'vitest'

import {
  assignBookFields,
  createBookDraft,
  createRequiredBookValidator,
  getBookIndex,
  getBookRules,
} from '@/view/book/book-helpers'

describe('book helpers', () => {
  it('assigns fetched book fields onto the reactive draft', () => {
    const draft = createBookDraft()

    assignBookFields(draft, {
      title: 'Vue 3 Guide',
      author: 'Lin',
      summary: 'Modern patterns',
    })

    expect(draft).toEqual({
      title: 'Vue 3 Guide',
      author: 'Lin',
      summary: 'Modern patterns',
      image: '',
    })
  })

  it('keeps explicit empty strings from fetched book fields', () => {
    const draft = {
      ...createBookDraft(),
      title: 'Existing title',
      author: 'Existing author',
      summary: 'Existing summary',
      image: 'https://example.com/cover.png',
    }

    assignBookFields(draft, {
      title: '',
      image: '',
    })

    expect(draft.title).toBe('')
    expect(draft.image).toBe('')
    expect(draft.author).toBe('Existing author')
  })

  it('builds required field rules and index values', () => {
    const validator = createRequiredBookValidator()
    const fail = vi.fn()
    const pass = vi.fn()

    expect(createBookDraft()).toEqual({
      title: '',
      author: '',
      summary: '',
      image: '',
    })
    validator(null, '', fail)
    validator(null, 'filled', pass)

    expect(fail).toHaveBeenCalledWith(new Error('信息不能为空'))
    expect(pass).toHaveBeenCalledOnce()
    expect(getBookRules().title[0].required).toBe(true)
    expect(getBookIndex(0)).toBe(1)
  })
})
