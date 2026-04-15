import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { notifyRequestError } from '@/lin/util/request-error'
import { isSuccessfulResponse } from '@/lin/util/response'
import { deleteBook, getBooks } from '@/model/book'

const defaultBookService = {
  deleteBook,
  getBooks,
}

function isBookListEmptyError(error = {}) {
  return error?.code === 10020
}

export function useBookList({
  bookService = defaultBookService,
  message = ElMessage,
  messageBox = ElMessageBox,
  notifyError = notifyRequestError,
} = {}) {
  const books = ref([])
  const editBookId = ref(null)
  const loading = ref(false)
  const showEdit = ref(false)

  async function loadBooks() {
    try {
      loading.value = true
      books.value = await bookService.getBooks()
    } catch (error) {
      if (isBookListEmptyError(error)) {
        books.value = []
        return
      }

      notifyError(message, error, '获取图书列表失败')
    } finally {
      loading.value = false
    }
  }

  function handleEdit(id) {
    showEdit.value = true
    editBookId.value = id
  }

  async function handleDelete(id) {
    try {
      await messageBox.confirm('此操作将永久删除该图书, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return false
    }

    loading.value = true

    try {
      const result = await bookService.deleteBook(id)

      if (isSuccessfulResponse(result)) {
        await loadBooks()
        message.success(result.message)
        return true
      }

      message.error(result.message || '删除图书失败')
      return false
    } catch (error) {
      notifyError(message, error, '删除图书失败')
      return false
    } finally {
      loading.value = false
    }
  }

  async function editClose() {
    showEdit.value = false
    await loadBooks()
  }

  onMounted(() => {
    void loadBooks()
  })

  return {
    books,
    editBookId,
    editClose,
    handleDelete,
    handleEdit,
    loading,
    loadBooks,
    showEdit,
  }
}
