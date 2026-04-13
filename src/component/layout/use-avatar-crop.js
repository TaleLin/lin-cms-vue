import { ElMessage } from 'element-plus'

import { uploadSingleFile } from '@/model/file'
import { notifyRequestError } from '@/lin/util/request-error'

export function getUploadedAvatarPath(uploadResult) {
  if (!Array.isArray(uploadResult) || uploadResult.length !== 1) {
    return ''
  }

  return uploadResult[0]?.path || ''
}

const defaultFileModel = {
  uploadSingleFile,
}

export function useAvatarCrop({
  close,
  pictureCropper,
  updateProfile,
  message = ElMessage,
  fileModel = defaultFileModel,
}) {
  async function handleCrop() {
    try {
      const blob = await pictureCropper.value?.cropper?.getBlob()

      if (!blob) {
        message.error('头像裁剪失败, 请重试')
        return null
      }

      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
      const uploadResult = await fileModel.uploadSingleFile(file)
      const avatarPath = getUploadedAvatarPath(uploadResult)

      if (!avatarPath) {
        message.error('头像上传失败, 请重试')
        return null
      }

      const nextUser = await updateProfile(
        {
          avatar: avatarPath,
        },
        {
          successMessage: '更新头像成功',
          failureMessage: '更新头像失败',
        },
      )

      if (!nextUser) {
        return null
      }

      close()
      return nextUser
    } catch (error) {
      notifyRequestError(message, error, '更新头像失败')
      return null
    }
  }

  function closeCropper() {
    close()
  }

  return {
    closeCropper,
    handleCrop,
  }
}
