import { computed, reactive, ref, toValue } from 'vue'
import { ElMessage } from 'element-plus'

import { createRequiredRule, validateElementForm } from '@/lin/util/form'
import { notifyRequestError } from '@/lin/util/request-error'
import { isSuccessfulResponse } from '@/lin/util/response'
import { createBook, editBook, getBook } from '@/model/book'

const defaultBookService = {
  createBook,
  editBook,
  getBook,
}

function createBookDraft() {
  return {
    title: '',
    author: '',
    summary: '',
    image: '',
  }
}

function assignBookFields(target, source = {}) {
  Object.keys(target).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key] ?? ''
    }
  })
}

export function useBookForm({ editBookId, formRef, onSaved, message = ElMessage, model = defaultBookService } = {}) {
  const loading = ref(false)
  const book = reactive(createBookDraft())
  const rules = {
    title: [createRequiredRule('信息不能为空')],
    author: [createRequiredRule('信息不能为空')],
    summary: [createRequiredRule('信息不能为空')],
    image: [createRequiredRule('信息不能为空')],
  }
  const isEditing = computed(() => Boolean(toValue(editBookId)))

  async function loadBook() {
    if (!isEditing.value) {
      return
    }

    loading.value = true

    try {
      const result = await model.getBook(toValue(editBookId))
      assignBookFields(book, result)
    } catch (error) {
      notifyRequestError(message, error, '获取图书详情失败')
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    formRef.value?.resetFields()
  }

  async function submitForm() {
    const valid = await validateElementForm(formRef.value)

    if (!valid) {
      message.error('请将信息填写完整')
      return
    }

    loading.value = true

    try {
      if (isEditing.value) {
        const result = await model.editBook(toValue(editBookId), book)

        if (isSuccessfulResponse(result)) {
          message.success(result.message)
          await onSaved?.({ mode: 'edit', result })
          return
        }

        message.error(result.message)
        return
      }

      const result = await model.createBook(book)

      if (isSuccessfulResponse(result)) {
        message.success(result.message)
        resetForm()
        await onSaved?.({ mode: 'create', result })
        return
      }

      message.error(result.message)
    } catch (error) {
      notifyRequestError(message, error, isEditing.value ? '更新图书失败' : '创建图书失败')
    } finally {
      loading.value = false
    }
  }

  return {
    book,
    isEditing,
    loadBook,
    loading,
    resetForm,
    rules,
    submitForm,
  }
}
