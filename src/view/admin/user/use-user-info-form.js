import { computed, reactive, ref, toValue, useTemplateRef, watch } from 'vue'
import { ElMessage } from 'element-plus'

import { MAX_SUCCESS_CODE } from '@/config/global'
import { updateUser } from '@/model/admin'
import { notifyRequestError } from '@/lin/util/request-error'
import { register } from '@/model/user'

import {
  createUserUpdatePayload,
  createUserInfoDraft,
  createUserInfoRules,
  hasGroupSelectionChanged,
  populateUserInfoDraft,
  validateElementForm,
} from './user-helpers'

const defaultUserModel = {
  register,
}

const defaultAdminModel = {
  updateUser,
}

export function useUserInfoForm(
  { id, userDetail, pageType, onSubmitted = () => {} },
  {
    adminModel = defaultAdminModel,
    userModel = defaultUserModel,
    formRef = undefined,
    message = ElMessage,
    notifyError = notifyRequestError,
    successCode = MAX_SUCCESS_CODE,
    validateForm = validateElementForm,
  } = {},
) {
  const form = formRef ?? useTemplateRef('form')
  const loading = ref(false)
  const userInfo = reactive(createUserInfoDraft())
  const isCreateMode = computed(() => toValue(pageType) === 'add')
  const isEdited = computed(() => toValue(pageType) === 'edit')
  const rules = createUserInfoRules(userInfo)

  function syncUserInfoFromDetail() {
    populateUserInfoDraft(userInfo, toValue(userDetail))
  }

  watch(
    () => [toValue(pageType), toValue(userDetail)],
    ([currentPageType]) => {
      if (currentPageType === 'edit') {
        syncUserInfoFromDetail()
      }
    },
    { deep: true, immediate: true },
  )

  async function submitCreateForm() {
    try {
      const response = await userModel.register(userInfo)

      if (response.code < successCode) {
        message.success(response.message)
        resetForm()
        return
      }

      message.error(response.message)
    } catch (error) {
      notifyError(message, error, '新增用户失败')
    }
  }

  async function submitEditForm() {
    if (!hasGroupSelectionChanged(userInfo.groupIds, toValue(userDetail)?.groups ?? [])) {
      onSubmitted(false)
      return
    }

    const userId = toValue(id)

    if (!Number.isInteger(userId)) {
      message.error('无效的用户ID')
      onSubmitted(false)
      return
    }

    const payload = createUserUpdatePayload(userId, userInfo)

    try {
      const response = await adminModel.updateUser(payload)

      if (response.code < successCode) {
        message.success(response.message)
        onSubmitted(true)
        return
      }

      message.error(response.message)
    } catch (error) {
      notifyError(message, error, '更新用户信息失败')
    }
  }

  async function submitForm() {
    const valid = await validateForm(form.value)

    if (!valid) {
      message.error('请填写正确的信息')
      return
    }

    loading.value = true

    try {
      if (isCreateMode.value) {
        await submitCreateForm()
        return
      }

      await submitEditForm()
    } finally {
      loading.value = false
    }
  }

  function resetForm() {
    if (toValue(pageType) === 'edit') {
      syncUserInfoFromDetail()
      form.value?.clearValidate()
      return
    }

    userInfo.groupIds = []
    form.value?.resetFields()
  }

  return {
    isEdited,
    loading,
    resetForm,
    rules,
    submitForm,
    userInfo,
  }
}
