import { defineComponent, nextTick } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { useBookList } from '@/view/book/use-book-list'

const createHost = options =>
  defineComponent({
    name: 'UseBookListHost',
    setup(_, { expose }) {
      const state = useBookList(options)
      expose(state)
      return () => null
    },
  })

describe('use-book-list', () => {
  it('loads books on mount and opens the edit view for the selected book', async () => {
    const bookService = {
      deleteBook: vi.fn(),
      getBooks: vi.fn().mockResolvedValue([
        { id: 1, title: 'Lin CMS' },
        { id: 2, title: 'Vue 3' },
      ]),
    }
    const Host = createHost({
      bookService,
      message: {
        error: vi.fn(),
        success: vi.fn(),
      },
      messageBox: {
        confirm: vi.fn(),
      },
    })
    const wrapper = mount(Host)

    await flushPromises()
    await nextTick()

    expect(bookService.getBooks).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.books).toEqual([
      { id: 1, title: 'Lin CMS' },
      { id: 2, title: 'Vue 3' },
    ])

    wrapper.vm.handleEdit(2)
    expect(wrapper.vm.showEdit).toBe(true)
    expect(wrapper.vm.editBookId).toBe(2)
  })

  it('returns an empty list when the backend reports there are no books', async () => {
    const notifyError = vi.fn()
    const bookService = {
      deleteBook: vi.fn(),
      getBooks: vi.fn().mockRejectedValue({ code: 10020 }),
    }
    const Host = createHost({
      bookService,
      message: {
        error: vi.fn(),
        success: vi.fn(),
      },
      messageBox: {
        confirm: vi.fn(),
      },
      notifyError,
    })
    const wrapper = mount(Host)

    await flushPromises()
    await nextTick()

    expect(wrapper.vm.books).toEqual([])
    expect(notifyError).not.toHaveBeenCalled()
  })

  it('confirms deletions, reloads the list on success, and refreshes after closing the edit panel', async () => {
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const messageBox = {
      confirm: vi.fn().mockResolvedValue(undefined),
    }
    const bookService = {
      deleteBook: vi.fn().mockResolvedValue({
        code: 200,
        message: '删除成功',
      }),
      getBooks: vi
        .fn()
        .mockResolvedValueOnce([{ id: 1, title: 'Lin CMS' }])
        .mockResolvedValueOnce([{ id: 2, title: 'Vue 3' }])
        .mockResolvedValueOnce([{ id: 3, title: 'React' }]),
    }
    const Host = createHost({
      bookService,
      message,
      messageBox,
    })
    const wrapper = mount(Host)

    await flushPromises()
    await nextTick()

    await expect(wrapper.vm.handleDelete(9)).resolves.toBe(true)
    expect(messageBox.confirm).toHaveBeenCalledTimes(1)
    expect(bookService.deleteBook).toHaveBeenCalledWith(9)
    expect(bookService.getBooks).toHaveBeenCalledTimes(2)
    expect(message.success).toHaveBeenCalledWith('删除成功')
    expect(wrapper.vm.books).toEqual([{ id: 2, title: 'Vue 3' }])

    wrapper.vm.handleEdit(3)
    await wrapper.vm.editClose()
    await flushPromises()

    expect(wrapper.vm.showEdit).toBe(false)
    expect(bookService.getBooks).toHaveBeenCalledTimes(3)
    expect(wrapper.vm.books).toEqual([{ id: 3, title: 'React' }])
  })

  it('stops deletion when the dialog is canceled and surfaces backend failures', async () => {
    const notifyError = vi.fn()
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const bookService = {
      deleteBook: vi
        .fn()
        .mockResolvedValueOnce({ code: 10000, message: '删除失败' })
        .mockRejectedValueOnce(new Error('网络异常')),
      getBooks: vi.fn().mockResolvedValue([{ id: 1, title: 'Lin CMS' }]),
    }
    const messageBox = {
      confirm: vi
        .fn()
        .mockRejectedValueOnce(new Error('cancel'))
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined),
    }
    const Host = createHost({
      bookService,
      message,
      messageBox,
      notifyError,
    })
    const wrapper = mount(Host)

    await flushPromises()
    await nextTick()

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(false)
    expect(bookService.deleteBook).not.toHaveBeenCalled()

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(false)
    expect(message.error).toHaveBeenCalledWith('删除失败')

    await expect(wrapper.vm.handleDelete(1)).resolves.toBe(false)
    expect(notifyError).toHaveBeenCalledWith(message, expect.any(Error), '删除图书失败')
  })
})
