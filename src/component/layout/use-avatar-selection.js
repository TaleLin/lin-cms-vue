import { ref, toValue, watch } from 'vue'

import { clearFileInput, createAvatarCropPreview, revokeObjectUrl } from './profile-helpers'

export function useAvatarSelection({ avatarInput, onError } = {}) {
  const cropImg = ref('')
  const cropVisible = ref(false)

  function clearCropSelection() {
    revokeObjectUrl(cropImg.value)
    cropImg.value = ''
  }

  function resetAvatarInput() {
    clearFileInput(toValue(avatarInput))
  }

  async function handleAvatarFileChange(event) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      clearCropSelection()
      cropImg.value = await createAvatarCropPreview(file)
      cropVisible.value = true
    } catch (error) {
      onError?.(error)
      resetAvatarInput()
    }
  }

  watch(cropVisible, visible => {
    if (!visible) {
      clearCropSelection()
      resetAvatarInput()
    }
  })

  return {
    cropImg,
    cropVisible,
    clearCropSelection,
    handleAvatarFileChange,
  }
}
