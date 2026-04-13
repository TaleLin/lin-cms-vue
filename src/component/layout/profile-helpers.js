import { defaultWindow } from '@vueuse/core'

export const DEFAULT_NICKNAME = '佚名'
export const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024
export const MIN_AVATAR_IMAGE_SIZE = 50

export function getAvatarValidationMessage({ size, width, height }) {
  if (size > MAX_AVATAR_FILE_SIZE) {
    return '文件过大超过5M'
  }

  if (width < MIN_AVATAR_IMAGE_SIZE) {
    return '图像宽度过小, 请选择大于50px的图像'
  }

  if (height < MIN_AVATAR_IMAGE_SIZE) {
    return '图像高度过小, 请选择大于50px的图像'
  }

  return ''
}

export function shouldUpdateNickname(nickname, currentNickname) {
  return Boolean(nickname && nickname !== DEFAULT_NICKNAME && nickname !== currentNickname)
}

export function clearFileInput(inputRef) {
  if (inputRef) {
    inputRef.value = ''
  }
}

export function revokeObjectUrl(url) {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    defaultWindow?.URL?.revokeObjectURL(url)
  }
}

export async function createAvatarCropPreview(file) {
  const sizeError = getAvatarValidationMessage({
    size: file.size,
    width: MIN_AVATAR_IMAGE_SIZE,
    height: MIN_AVATAR_IMAGE_SIZE,
  })

  if (sizeError) {
    throw new Error(sizeError)
  }

  const imageUrl = defaultWindow?.URL?.createObjectURL(file)

  if (!imageUrl) {
    throw new Error('预览地址创建失败, 请重试')
  }

  try {
    const dimensions = await loadImageDimensions(imageUrl)
    const validationMessage = getAvatarValidationMessage({
      size: file.size,
      width: dimensions.width,
      height: dimensions.height,
    })

    if (validationMessage) {
      throw new Error(validationMessage)
    }

    return imageUrl
  } catch (error) {
    revokeObjectUrl(imageUrl)
    throw error
  }
}

function loadImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve({
        width: image.width,
        height: image.height,
      })
    }
    image.onerror = () => {
      reject(new Error('获取本地图片出现错误, 请重试'))
    }
    image.src = src
  })
}
