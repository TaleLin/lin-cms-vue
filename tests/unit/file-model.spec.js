import { beforeEach, describe, expect, it, vi } from 'vitest'

const axiosMocks = vi.hoisted(() => ({
  request: vi.fn(),
}))

vi.mock('@/lin/plugin/axios', () => ({
  request: axiosMocks.request,
}))

import { uploadFiles, uploadSingleFile } from '@/model/file'

describe('file model', () => {
  beforeEach(() => {
    axiosMocks.request.mockReset()
  })

  it('uploads a single file through the shared request layer', () => {
    const file = new File(['avatar'], 'avatar.jpg', { type: 'image/jpeg' })

    uploadSingleFile(file)

    expect(axiosMocks.request).toHaveBeenCalledWith({
      method: 'post',
      url: '/cms/file',
      data: {
        file,
      },
    })
  })

  it('uploads file batches through the shared request layer', () => {
    const data = {
      file_0: new File(['a'], 'a.png', { type: 'image/png' }),
      file_1: new File(['b'], 'b.png', { type: 'image/png' }),
    }

    uploadFiles(data)

    expect(axiosMocks.request).toHaveBeenCalledWith({
      method: 'post',
      url: 'cms/file',
      data,
    })
  })
})
