import { effectScope, nextTick, ref } from 'vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'

const { createAvatarCropPreview } = vi.hoisted(() => ({
  createAvatarCropPreview: vi.fn(),
}))

vi.mock('@/component/layout/profile-helpers', async () => {
  const actual = await vi.importActual('@/component/layout/profile-helpers')

  return {
    ...actual,
    createAvatarCropPreview,
  }
})

import { useAvatarSelection } from '@/component/layout/use-avatar-selection'

describe('use-avatar-selection', () => {
  beforeEach(() => {
    createAvatarCropPreview.mockReset()
  })

  it('replaces previous previews and clears the input when the cropper closes', async () => {
    const revokeObjectURL = vi.fn()
    window.URL.revokeObjectURL = revokeObjectURL
    const avatarInput = ref({ value: 'picked-file' })
    let avatarSelection
    const scope = effectScope()

    createAvatarCropPreview.mockResolvedValueOnce('blob:first').mockResolvedValueOnce('blob:second')

    scope.run(() => {
      avatarSelection = useAvatarSelection({ avatarInput })
    })

    await avatarSelection.handleAvatarFileChange({
      target: {
        files: [{ name: 'first.png', size: 1024 }],
      },
    })

    expect(avatarSelection.cropImg.value).toBe('blob:first')
    expect(avatarSelection.cropVisible.value).toBe(true)

    await avatarSelection.handleAvatarFileChange({
      target: {
        files: [{ name: 'second.png', size: 2048 }],
      },
    })

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:first')
    expect(avatarSelection.cropImg.value).toBe('blob:second')

    avatarSelection.cropVisible.value = false
    await nextTick()

    expect(revokeObjectURL).toHaveBeenCalledWith('blob:second')
    expect(avatarSelection.cropImg.value).toBe('')
    expect(avatarInput.value.value).toBe('')

    scope.stop()
  })

  it('forwards preview errors and resets the file input', async () => {
    const onError = vi.fn()
    const avatarInput = ref({ value: 'picked-file' })
    let avatarSelection
    const scope = effectScope()
    const error = new Error('图像宽度过小')

    createAvatarCropPreview.mockRejectedValueOnce(error)

    scope.run(() => {
      avatarSelection = useAvatarSelection({ avatarInput, onError })
    })

    await avatarSelection.handleAvatarFileChange({
      target: {
        files: [{ name: 'broken.png', size: 1024 }],
      },
    })

    expect(onError).toHaveBeenCalledWith(error)
    expect(avatarSelection.cropVisible.value).toBe(false)
    expect(avatarSelection.cropImg.value).toBe('')
    expect(avatarInput.value.value).toBe('')

    scope.stop()
  })
})
