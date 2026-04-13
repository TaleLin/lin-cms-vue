import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useBookForm } from '@/view/book/use-book-form'

describe('use-book-form', () => {
  it('loads the existing book when editing', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn(),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const model = {
      createBook: vi.fn(),
      editBook: vi.fn(),
      getBook: vi.fn().mockResolvedValue({
        title: 'Vue 3 Guide',
        author: 'Lin',
        summary: 'Modern patterns',
        image: '/cover.png',
      }),
    }
    const { book, loadBook, loading } = useBookForm({
      editBookId: () => 9,
      formRef,
      message,
      model,
    })

    await loadBook()

    expect(model.getBook).toHaveBeenCalledWith(9)
    expect(book).toMatchObject({
      title: 'Vue 3 Guide',
      author: 'Lin',
      summary: 'Modern patterns',
      image: '/cover.png',
    })
    expect(loading.value).toBe(false)
    expect(message.error).not.toHaveBeenCalled()
  })

  it('creates a new book and resets the form on success', async () => {
    const resetFields = vi.fn()
    const formRef = ref({
      resetFields,
      validate: vi.fn().mockResolvedValue(true),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const model = {
      createBook: vi.fn().mockResolvedValue({
        code: 0,
        message: '创建成功',
      }),
      editBook: vi.fn(),
      getBook: vi.fn(),
    }
    const onSaved = vi.fn()
    const { book, submitForm } = useBookForm({
      editBookId: () => null,
      formRef,
      message,
      model,
      onSaved,
    })

    book.title = 'Vue 3 Guide'
    book.author = 'Lin'
    book.summary = 'Modern patterns'
    book.image = '/cover.png'

    await submitForm()

    expect(model.createBook).toHaveBeenCalledWith(book)
    expect(resetFields).toHaveBeenCalledTimes(1)
    expect(message.success).toHaveBeenCalledWith('创建成功')
    expect(onSaved).toHaveBeenCalledWith({
      mode: 'create',
      result: {
        code: 0,
        message: '创建成功',
      },
    })
  })

  it('updates the current book and notifies the page on success', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const model = {
      createBook: vi.fn(),
      editBook: vi.fn().mockResolvedValue({
        code: 0,
        message: '修改成功',
      }),
      getBook: vi.fn(),
    }
    const onSaved = vi.fn()
    const { book, submitForm } = useBookForm({
      editBookId: () => 5,
      formRef,
      message,
      model,
      onSaved,
    })

    book.title = 'Vue 3 Guide'
    book.author = 'Lin'
    book.summary = 'Modern patterns'
    book.image = '/cover.png'

    await submitForm()

    expect(model.editBook).toHaveBeenCalledWith(5, book)
    expect(message.success).toHaveBeenCalledWith('修改成功')
    expect(onSaved).toHaveBeenCalledWith({
      mode: 'edit',
      result: {
        code: 0,
        message: '修改成功',
      },
    })
  })

  it('shows validation errors and skips requests when the form is invalid', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockRejectedValue(new Error('invalid')),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const model = {
      createBook: vi.fn(),
      editBook: vi.fn(),
      getBook: vi.fn(),
    }
    const { submitForm } = useBookForm({
      editBookId: () => null,
      formRef,
      message,
      model,
    })

    await submitForm()

    expect(message.error).toHaveBeenCalledWith('请将信息填写完整')
    expect(model.createBook).not.toHaveBeenCalled()
    expect(model.editBook).not.toHaveBeenCalled()
  })

  it('shows page-level errors when a handleError request rejects with backend details', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const model = {
      createBook: vi.fn().mockRejectedValue({
        config: {
          handleError: true,
        },
        data: {
          message: '创建失败',
        },
        status: 400,
      }),
      editBook: vi.fn(),
      getBook: vi.fn(),
    }
    const { submitForm } = useBookForm({
      editBookId: () => null,
      formRef,
      message,
      model,
    })

    await submitForm()

    expect(message.error).toHaveBeenCalledWith('创建失败')
    expect(message.success).not.toHaveBeenCalled()
  })

  it('does not duplicate messages when the axios interceptor already handled the request error', async () => {
    const formRef = ref({
      resetFields: vi.fn(),
      validate: vi.fn().mockResolvedValue(true),
    })
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const model = {
      createBook: vi.fn(),
      editBook: vi.fn().mockRejectedValue({
        config: {},
        data: {
          message: '重复提示',
        },
        status: 400,
      }),
      getBook: vi.fn(),
    }
    const { submitForm } = useBookForm({
      editBookId: () => 5,
      formRef,
      message,
      model,
    })

    await submitForm()

    expect(message.error).not.toHaveBeenCalled()
    expect(message.success).not.toHaveBeenCalled()
  })
})
