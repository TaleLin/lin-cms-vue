import { nextTick, reactive, ref } from 'vue'
import { describe, expect, it, beforeEach, vi } from 'vitest'

vi.mock('element-plus', () => ({
  ElMessage: {
    error: vi.fn(),
  },
}))

vi.mock('@/component/layout/use-current-user-profile', () => {
  const updateNickname = vi.fn()

  return {
    useCurrentUserProfile: () => ({
      updateNickname,
    }),
    __updateNickname: updateNickname,
  }
})

vi.mock('@/component/layout/use-avatar-selection', () => {
  const handleAvatarFileChange = vi.fn()
  let latestOnError = null

  return {
    useAvatarSelection: options => {
      latestOnError = options?.onError ?? null
      return {
        cropImg: ref(''),
        cropVisible: ref(false),
        handleAvatarFileChange,
      }
    },
    __handleAvatarFileChange: handleAvatarFileChange,
    __triggerAvatarError: error => latestOnError?.(error),
  }
})

vi.mock('@/component/layout/profile-helpers', () => {
  const shouldUpdateNickname = vi.fn()

  return {
    shouldUpdateNickname,
  }
})

vi.mock('@/component/layout/profile-menu-helpers', () => {
  const getNicknameLabel = vi.fn(nickname => nickname || '佚名')
  const getGroupDisplayName = vi.fn(groups => {
    const names = groups?.map(group => group?.name).filter(Boolean)
    return names.length ? names.join(',') : '默认组'
  })

  return {
    getNicknameLabel,
    getGroupDisplayName,
  }
})

import { __updateNickname as updateNickname } from '@/component/layout/use-current-user-profile'
import {
  __handleAvatarFileChange as handleAvatarFileChange,
  __triggerAvatarError as triggerAvatarError,
} from '@/component/layout/use-avatar-selection'
import { shouldUpdateNickname } from '@/component/layout/profile-helpers'
import { getNicknameLabel, getGroupDisplayName } from '@/component/layout/profile-menu-helpers'
import { useUserMenu } from '@/component/layout/use-user-menu'

let userStoreInstance
let navigateToCenterAction
let logoutAction

describe('use-user-menu', () => {
  beforeEach(() => {
    updateNickname.mockReset().mockResolvedValue({ nickname: '更新昵称' })
    handleAvatarFileChange.mockReset()
    shouldUpdateNickname.mockReset()
    getNicknameLabel.mockImplementation(nickname => nickname || '佚名')
    getGroupDisplayName.mockImplementation(groups => {
      const names = groups?.map(group => group?.name).filter(Boolean)
      return names.length ? names.join(',') : '默认组'
    })

    userStoreInstance = reactive({
      user: {
        nickname: '原昵称',
        groups: [{ name: '测试组' }],
      },
      loginOut: vi.fn(),
    })
    navigateToCenterAction = vi.fn()
    logoutAction = vi.fn()
  })

  it('provides derived names and avatar state', () => {
    const {
      avatarSrc,
      displayNickname,
      groupName,
      cropImg,
      cropVisible,
      handleAvatarFileChange: handleAvatar,
    } = useUserMenu({
      defaultAvatar: '/default-avatar.png',
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })

    expect(displayNickname.value).toBe('原昵称')
    expect(groupName.value).toBe('测试组')
    expect(avatarSrc.value).toBe('/default-avatar.png')
    expect(cropImg.value).toBe('')
    expect(cropVisible.value).toBe(false)
    expect(handleAvatar).toBe(handleAvatarFileChange)
  })

  it('reacts when user store nickname changes', async () => {
    const { avatarSrc, displayNickname } = useUserMenu({
      defaultAvatar: '/default-avatar.png',
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })
    userStoreInstance.user = { nickname: '新昵称', groups: [] }
    await nextTick()
    expect(displayNickname.value).toBe('新昵称')
    expect(avatarSrc.value).toBe('/default-avatar.png')
  })

  it('prefers the current user avatar when available', () => {
    userStoreInstance.user.avatar = '/avatar.png'
    const { avatarSrc } = useUserMenu({
      defaultAvatar: '/default-avatar.png',
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })

    expect(avatarSrc.value).toBe('/avatar.png')
  })

  it('focuses the input when editing the nickname', async () => {
    const nicknameInput = ref({ focus: vi.fn() })
    const { startNicknameEdit, isEditingNickname } = useUserMenu({
      nicknameInput,
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })

    await startNicknameEdit()

    expect(nicknameInput.value.focus).toHaveBeenCalled()
    expect(isEditingNickname.value).toBe(true)
  })

  it('skips nickname update when the value matches', async () => {
    const { submitNicknameEdit, editingNickname, isEditingNickname } = useUserMenu({
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })

    editingNickname.value = '保持值'
    shouldUpdateNickname.mockReturnValue(false)

    await submitNicknameEdit()

    expect(updateNickname).not.toHaveBeenCalled()
    expect(isEditingNickname.value).toBe(false)
  })

  it('updates nickname when allowed', async () => {
    const { submitNicknameEdit, editingNickname, isEditingNickname } = useUserMenu({
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })

    editingNickname.value = '允许更新'
    shouldUpdateNickname.mockReturnValue(true)
    updateNickname.mockResolvedValue({ nickname: '成功昵称' })

    await submitNicknameEdit()

    expect(updateNickname).toHaveBeenCalledWith('允许更新')
    expect(editingNickname.value).toBe('成功昵称')
    expect(isEditingNickname.value).toBe(false)
  })

  it('navigates to center page', () => {
    const { goToCenter } = useUserMenu({
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })

    goToCenter()

    expect(navigateToCenterAction).toHaveBeenCalledTimes(1)
  })

  it('forwards avatar selection errors to the message service', () => {
    const message = {
      error: vi.fn(),
    }

    useUserMenu({
      message,
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })
    triggerAvatarError(new Error('头像格式错误'))
    triggerAvatarError({})

    expect(message.error).toHaveBeenNthCalledWith(1, '头像格式错误')
    expect(message.error).toHaveBeenNthCalledWith(2, '头像处理失败')
  })

  it('logs out and redirects', () => {
    const { logout } = useUserMenu({
      logoutAction,
      navigateToCenterAction,
      userStore: userStoreInstance,
    })

    logout()

    expect(logoutAction).toHaveBeenCalledTimes(1)
  })
})
