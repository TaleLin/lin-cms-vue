import { describe, expect, it, vi } from 'vitest'

import { getUploadedAvatarPath, useAvatarCrop } from '@/component/layout/use-avatar-crop'

describe('use-avatar-crop helpers', () => {
  it('extracts the uploaded avatar path from a single upload result', () => {
    expect(getUploadedAvatarPath([{ path: '/assets/avatar.jpg' }])).toBe('/assets/avatar.jpg')
    expect(getUploadedAvatarPath([{ path: '/a.jpg' }, { path: '/b.jpg' }])).toBe('')
    expect(getUploadedAvatarPath([])).toBe('')
    expect(getUploadedAvatarPath(null)).toBe('')
  })

  it('uploads the cropped avatar, refreshes the user profile, and closes on success', async () => {
    const fileModel = {
      uploadSingleFile: vi.fn().mockResolvedValue([{ path: '/assets/avatar.jpg' }]),
    }
    const updateProfile = vi.fn().mockResolvedValue({ id: 7, avatar: '/assets/avatar.jpg' })
    const close = vi.fn()
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const pictureCropper = {
      value: {
        cropper: {
          getBlob: vi.fn().mockResolvedValue(new Blob(['avatar'], { type: 'image/jpeg' })),
        },
      },
    }

    const { handleCrop } = useAvatarCrop({
      close,
      pictureCropper,
      message,
      updateProfile,
      fileModel,
    })

    await expect(handleCrop()).resolves.toEqual({ id: 7, avatar: '/assets/avatar.jpg' })
    expect(fileModel.uploadSingleFile).toHaveBeenCalledWith(expect.any(File))
    expect(updateProfile).toHaveBeenCalledWith(
      {
        avatar: '/assets/avatar.jpg',
      },
      {
        successMessage: '更新头像成功',
        failureMessage: '更新头像失败',
      },
    )
    expect(message.error).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalledTimes(1)
  })

  it('does not report success when refreshing the current user fails after upload', async () => {
    const fileModel = {
      uploadSingleFile: vi.fn().mockResolvedValue([{ path: '/assets/avatar.jpg' }]),
    }
    const updateProfile = vi.fn().mockResolvedValue(null)
    const close = vi.fn()
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const pictureCropper = {
      value: {
        cropper: {
          getBlob: vi.fn().mockResolvedValue(new Blob(['avatar'], { type: 'image/jpeg' })),
        },
      },
    }

    const { handleCrop } = useAvatarCrop({
      close,
      pictureCropper,
      message,
      updateProfile,
      fileModel,
    })

    await expect(handleCrop()).resolves.toBeNull()
    expect(message.success).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
  })

  it('uses unified request notifications when avatar upload fails', async () => {
    const error = {
      config: { handleError: true },
      data: {
        message: '头像上传失败',
      },
      status: 400,
    }
    const fileModel = {
      uploadSingleFile: vi.fn().mockRejectedValueOnce(error),
    }
    const close = vi.fn()
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const pictureCropper = {
      value: {
        cropper: {
          getBlob: vi.fn().mockResolvedValue(new Blob(['avatar'], { type: 'image/jpeg' })),
        },
      },
    }

    const { handleCrop } = useAvatarCrop({
      close,
      pictureCropper,
      message,
      updateProfile: vi.fn(),
      fileModel,
    })

    await expect(handleCrop()).resolves.toBeNull()
    expect(message.error).toHaveBeenCalledWith('头像上传失败')
    expect(message.success).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()
  })
})
