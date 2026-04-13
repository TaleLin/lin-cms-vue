import { describe, expect, it, vi } from 'vitest'

import { useCurrentUserProfile } from '@/component/layout/use-current-user-profile'

describe('use-current-user-profile', () => {
  it('refreshes the current user and stores it', async () => {
    const nextUser = { id: 7, nickname: 'Lin' }
    const userStore = {
      user: {
        roles: ['reader'],
      },
      setUserAndState: vi.fn(),
    }
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      getInformation: vi.fn().mockResolvedValue(nextUser),
    }

    const { refreshCurrentUser } = useCurrentUserProfile({
      message,
      userStore,
      userModel,
    })

    await expect(refreshCurrentUser()).resolves.toEqual({
      id: 7,
      nickname: 'Lin',
      roles: ['reader'],
    })
    expect(userModel.getInformation).toHaveBeenCalledTimes(1)
    expect(userStore.setUserAndState).toHaveBeenCalledWith({
      id: 7,
      nickname: 'Lin',
      roles: ['reader'],
    })
    expect(message.error).not.toHaveBeenCalled()
  })

  it('returns null and surfaces refresh errors', async () => {
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userStore = {
      user: {},
      setUserAndState: vi.fn(),
    }
    const userModel = {
      getInformation: vi.fn().mockRejectedValue(new Error('加载用户失败')),
    }

    const { refreshCurrentUser } = useCurrentUserProfile({
      message,
      userStore,
      userModel,
    })

    await expect(refreshCurrentUser()).resolves.toBeNull()
    expect(message.error).toHaveBeenCalledWith('加载用户失败')
    expect(userStore.setUserAndState).not.toHaveBeenCalled()
  })

  it('updates nickname through the shared request flow', async () => {
    const nextUser = { id: 7, nickname: '新昵称' }
    const userStore = {
      user: {
        roles: ['reader'],
      },
      setUserAndState: vi.fn(),
    }
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      getInformation: vi.fn().mockResolvedValue(nextUser),
      updateProfile: vi.fn().mockResolvedValue({ code: 0 }),
    }

    const { updateNickname } = useCurrentUserProfile({
      message,
      userModel,
      userStore,
    })

    await expect(updateNickname('新昵称')).resolves.toEqual({
      id: 7,
      nickname: '新昵称',
      roles: ['reader'],
    })
    expect(userModel.updateProfile).toHaveBeenCalledWith({
      nickname: '新昵称',
    })
    expect(message.success).toHaveBeenCalledWith('更新昵称成功')
    expect(userStore.setUserAndState).toHaveBeenCalledWith({
      id: 7,
      nickname: '新昵称',
      roles: ['reader'],
    })
  })

  it('shows backend failure messages when nickname update returns an unsuccessful result', async () => {
    const userStore = {
      user: {},
      setUserAndState: vi.fn(),
    }
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      getInformation: vi.fn(),
      updateProfile: vi.fn().mockResolvedValue({ code: 10000 }),
    }

    const { updateNickname } = useCurrentUserProfile({
      message,
      userModel,
      userStore,
    })

    await expect(updateNickname('失败昵称')).resolves.toBeNull()
    expect(message.error).toHaveBeenCalledWith('更新昵称失败')
    expect(userModel.getInformation).not.toHaveBeenCalled()
    expect(message.success).not.toHaveBeenCalled()
    expect(userStore.setUserAndState).not.toHaveBeenCalled()
  })

  it('surfaces request rejections without duplicating interceptor-managed errors', async () => {
    const userStore = {
      user: {},
      setUserAndState: vi.fn(),
    }
    const message = {
      error: vi.fn(),
      success: vi.fn(),
    }
    const userModel = {
      getInformation: vi.fn(),
      updateProfile: vi.fn().mockRejectedValue({
        config: {},
        data: {
          message: '不要重复提示',
        },
        status: 400,
      }),
    }

    const { updateNickname } = useCurrentUserProfile({
      message,
      userModel,
      userStore,
    })

    await expect(updateNickname('失败昵称')).resolves.toBeNull()
    expect(message.error).not.toHaveBeenCalled()
    expect(message.success).not.toHaveBeenCalled()
  })
})
