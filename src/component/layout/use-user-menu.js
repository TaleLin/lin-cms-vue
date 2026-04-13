import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'

import { useCurrentUserProfile } from './use-current-user-profile'
import { useAvatarSelection } from './use-avatar-selection'
import { shouldUpdateNickname } from './profile-helpers'
import { getGroupDisplayName, getNicknameLabel } from './profile-menu-helpers'

export function useUserMenu({
  avatarInput,
  defaultAvatar = '',
  nicknameInput,
  logoutAction,
  message = ElMessage,
  navigateToCenterAction,
  userStore,
} = {}) {
  const isEditingNickname = ref(false)
  const displayNickname = computed(() => getNicknameLabel(userStore.user?.nickname))
  const editingNickname = ref(displayNickname.value)
  const user = computed(() => userStore.user)
  const avatarSrc = computed(() => user.value?.avatar || defaultAvatar)
  const groupName = computed(() => getGroupDisplayName(user.value?.groups))
  const { updateNickname } = useCurrentUserProfile({ userStore })
  const { cropImg, cropVisible, handleAvatarFileChange } = useAvatarSelection({
    avatarInput,
    onError: error => {
      message.error(error?.message ?? '头像处理失败')
    },
  })

  async function startNicknameEdit() {
    isEditingNickname.value = true
    editingNickname.value = displayNickname.value
    await nextTick()
    nicknameInput?.value?.focus()
  }

  async function submitNicknameEdit() {
    if (!shouldUpdateNickname(editingNickname.value, userStore.user?.nickname)) {
      isEditingNickname.value = false
      return
    }

    const nextUser = await updateNickname(editingNickname.value)

    if (nextUser) {
      editingNickname.value = getNicknameLabel(nextUser.nickname)
    }

    isEditingNickname.value = false
  }

  function goToCenter() {
    navigateToCenterAction?.()
  }

  function logout() {
    logoutAction?.()
  }

  return {
    user,
    avatarSrc,
    displayNickname,
    editingNickname,
    isEditingNickname,
    groupName,
    cropImg,
    cropVisible,
    handleAvatarFileChange,
    startNicknameEdit,
    submitNicknameEdit,
    goToCenter,
    logout,
  }
}
