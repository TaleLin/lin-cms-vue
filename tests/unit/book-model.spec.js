import { beforeEach, describe, expect, it, vi } from 'vitest'

const axiosMocks = vi.hoisted(() => ({
  request: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  _delete: vi.fn(),
}))

vi.mock('@/lin/plugin/axios', () => ({
  request: axiosMocks.request,
  get: axiosMocks.get,
  put: axiosMocks.put,
  _delete: axiosMocks._delete,
}))

import * as bookModel from '@/model/book'

describe('book model', () => {
  beforeEach(() => {
    axiosMocks.request.mockReset()
    axiosMocks.get.mockReset()
    axiosMocks.put.mockReset()
    axiosMocks._delete.mockReset()
  })

  it('creates books with the post request contract', async () => {
    axiosMocks.request.mockResolvedValue({ code: 200 })
    const payload = {
      title: 'Lin CMS',
      author: '七月',
    }

    await bookModel.createBook(payload)

    expect(axiosMocks.request).toHaveBeenCalledWith({
      method: 'post',
      url: 'v1/book',
      data: payload,
    })
  })

  it('loads and updates books by id', async () => {
    axiosMocks.get.mockResolvedValue({ id: 1 })
    axiosMocks.put.mockResolvedValue({ code: 200 })

    await bookModel.getBook(1)
    await bookModel.editBook(1, { title: 'Lin CMS Vue' })

    expect(axiosMocks.get).toHaveBeenCalledWith('v1/book/1')
    expect(axiosMocks.put).toHaveBeenCalledWith('v1/book/1', { title: 'Lin CMS Vue' })
  })

  it('deletes books and requests the list through the shared request layer', async () => {
    axiosMocks._delete.mockResolvedValue({ code: 200 })
    axiosMocks.request.mockResolvedValue({ items: [] })

    await bookModel.deleteBook(9)
    await bookModel.getBooks()

    expect(axiosMocks._delete).toHaveBeenCalledWith('v1/book/9')
    expect(axiosMocks.request).toHaveBeenCalledWith({
      method: 'get',
      url: 'v1/book',
    })
  })
})
