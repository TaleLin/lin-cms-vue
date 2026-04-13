import { MAX_SUCCESS_CODE } from '@/config/global'

export function createBookDraft() {
  return {
    title: '',
    author: '',
    summary: '',
    image: '',
  }
}

export function assignBookFields(target, source = {}) {
  Object.keys(target).forEach(key => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key] ?? ''
    }
  })
}

export function createRequiredBookValidator() {
  return (_, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
      return
    }

    callback()
  }
}

export function getBookRules() {
  const checkInfo = createRequiredBookValidator()

  return {
    title: [{ validator: checkInfo, trigger: 'blur', required: true }],
    author: [{ validator: checkInfo, trigger: 'blur', required: true }],
    summary: [{ validator: checkInfo, trigger: 'blur', required: true }],
    image: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
}

export function getBookIndex(index) {
  return index + 1
}

export function isBookResponseSuccessful(response = {}) {
  return Number.isFinite(response.code) && response.code < MAX_SUCCESS_CODE
}

export function isBookListEmptyError(error = {}) {
  return error?.code === 10020
}

export async function validateBookForm(form) {
  if (!form) {
    return false
  }

  try {
    await form.validate()
    return true
  } catch {
    return false
  }
}
