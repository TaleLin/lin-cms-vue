import { ElMessage } from 'element-plus'

import { getInformation, updateProfile as updateUserProfile } from '@/model/user'
import { notifyRequestError } from '@/lin/util/request-error'
import { isFailedResponse } from '@/lin/util/response'
import { mergeUserSnapshot } from '@/store/modules/user-helpers'

const defaultUserModel = {
  getInformation,
  updateProfile: updateUserProfile,
}

export function useCurrentUserProfile({ userStore, message = ElMessage, userModel = defaultUserModel }) {
  async function refreshCurrentUser() {
    try {
      const nextUser = mergeUserSnapshot(userStore.user, await userModel.getInformation())
      userStore.setUserAndState(nextUser)
      return nextUser
    } catch (error) {
      notifyRequestError(message, error, '获取当前用户信息失败')
      return null
    }
  }

  async function updateProfile(profile, { successMessage = '更新资料成功', failureMessage = '更新资料失败' } = {}) {
    try {
      const result = await userModel.updateProfile(profile)

      if (isFailedResponse(result)) {
        message.error(result.message || failureMessage)
        return null
      }

      const nextUser = await refreshCurrentUser()

      if (!nextUser) {
        return null
      }

      message.success(successMessage)
      return nextUser
    } catch (error) {
      notifyRequestError(message, error, failureMessage)
      return null
    }
  }

  function updateNickname(nickname) {
    return updateProfile(
      { nickname },
      {
        successMessage: '更新昵称成功',
        failureMessage: '更新昵称失败',
      },
    )
  }

  return {
    refreshCurrentUser,
    updateProfile,
    updateNickname,
  }
}
