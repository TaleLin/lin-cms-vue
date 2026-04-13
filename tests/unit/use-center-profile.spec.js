import { defineComponent, nextTick, reactive, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_NICKNAME } from '@/component/layout/profile-helpers'

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
        cropImg: ref('blob:avatar'),
        cropVisible: ref(true),
        handleAvatarFileChange,
      }
    },
    __handleAvatarFileChange: handleAvatarFileChange,
    __triggerAvatarError: error => latestOnError?.(error),
  }
})

import { __updateNickname as updateNickname } from '@/component/layout/use-current-user-profile'
import {
  __handleAvatarFileChange as handleAvatarFileChange,
  __triggerAvatarError as triggerAvatarError,
} from '@/component/layout/use-avatar-selection'
import { useCenterProfile } from '@/view/center/use-center-profile'

const createHost = options =>
  defineComponent({
    name: 'UseCenterProfileHost',
    setup(_, { expose }) {
      const state = useCenterProfile(options)
      expose(state)
      return () => null
    },
  })

describe('use-center-profile', () => {
  beforeEach(() => {
    updateNickname.mockReset()
    handleAvatarFileChange.mockReset()
  })

  it('syncs the nickname from the current user and persists successful edits', async () => {
    const userStore = reactive({
      user: {
        nickname: '七月',
        avatar: '/avatar.png',
      },
    })
    const Host = createHost({
      avatarInput: ref(null),
      defaultAvatar: '/default-avatar.png',
      userStore,
    })
    const wrapper = mount(Host)

    updateNickname.mockResolvedValueOnce({
      nickname: '新昵称',
      avatar: '/avatar.png',
    })

    expect(wrapper.vm.displayNickname).toBe('七月')
    expect(wrapper.vm.user.nickname).toBe('七月')
    expect(wrapper.vm.avatarSrc).toBe('/avatar.png')
    expect(wrapper.vm.handleAvatarFileChange).toBe(handleAvatarFileChange)

    wrapper.vm.editingNickname = '新昵称'
    await wrapper.vm.submitNicknameEdit()

    expect(updateNickname).toHaveBeenCalledWith('新昵称')
    expect(wrapper.vm.editingNickname).toBe('新昵称')
  })

  it('falls back to the stored nickname when the edit is unchanged or rejected', async () => {
    const userStore = reactive({
      user: {
        nickname: '默认昵称',
      },
    })
    const shouldUpdate = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true)
    const Host = createHost({
      avatarInput: ref(null),
      shouldUpdate,
      userStore,
    })
    const wrapper = mount(Host)

    updateNickname.mockResolvedValueOnce(null)

    wrapper.vm.editingNickname = '默认昵称'
    await expect(wrapper.vm.submitNicknameEdit()).resolves.toBeNull()
    expect(updateNickname).not.toHaveBeenCalled()
    expect(wrapper.vm.editingNickname).toBe('默认昵称')

    wrapper.vm.editingNickname = '失败昵称'
    await expect(wrapper.vm.submitNicknameEdit()).resolves.toBeNull()
    expect(updateNickname).toHaveBeenCalledWith('失败昵称')
    expect(wrapper.vm.editingNickname).toBe('默认昵称')
  })

  it('exposes an explicit avatar src contract and reacts to store updates', async () => {
    const userStore = reactive({
      user: {
        nickname: '默认昵称',
        avatar: '',
      },
    })
    const Host = createHost({
      avatarInput: ref(null),
      defaultAvatar: '/default-avatar.png',
      userStore,
    })
    const wrapper = mount(Host)

    expect(wrapper.vm.avatarSrc).toBe('/default-avatar.png')

    userStore.user.avatar = '/next-avatar.png'
    await nextTick()

    expect(wrapper.vm.avatarSrc).toBe('/next-avatar.png')
  })

  it('forwards avatar selection errors through the provided message api and reacts to store updates', async () => {
    const userStore = reactive({
      user: {
        nickname: '',
      },
    })
    const message = {
      error: vi.fn(),
    }
    const Host = createHost({
      avatarInput: ref(null),
      defaultAvatar: '/default-avatar.png',
      message,
      userStore,
    })
    const wrapper = mount(Host)

    expect(wrapper.vm.displayNickname).toBe(DEFAULT_NICKNAME)

    triggerAvatarError(new Error('头像加载失败'))
    triggerAvatarError({})
    expect(message.error).toHaveBeenNthCalledWith(1, '头像加载失败')
    expect(message.error).toHaveBeenNthCalledWith(2, '头像处理失败')

    userStore.user.nickname = '更新后昵称'
    await nextTick()

    expect(wrapper.vm.displayNickname).toBe('更新后昵称')
  })
})
