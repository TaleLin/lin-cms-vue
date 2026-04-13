import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

import { shouldUpdateNickname } from '@/component/layout/profile-helpers'
import { useCurrentUserProfile } from '@/component/layout/use-current-user-profile'
import { useAvatarSelection } from '@/component/layout/use-avatar-selection'

import { getDisplayNickname } from './center-helpers'

export function useCenterProfile({
  userStore,
  avatarInput,
  defaultAvatar = '',
  message = ElMessage,
  shouldUpdate = shouldUpdateNickname,
} = {}) {
  const displayNickname = computed(() => getDisplayNickname(userStore?.user))
  const editingNickname = ref(displayNickname.value)
  const user = computed(() => userStore?.user)
  const avatarSrc = computed(() => user.value?.avatar || defaultAvatar)
  const { updateNickname } = useCurrentUserProfile({ userStore })
  const { cropImg, cropVisible, handleAvatarFileChange } = useAvatarSelection({
    avatarInput,
    onError: error => {
      message.error(error?.message ?? '头像处理失败')
    },
  })

  async function submitNicknameEdit() {
    if (shouldUpdate(editingNickname.value, userStore?.user?.nickname)) {
      const nextUser = await updateNickname(editingNickname.value)

      if (nextUser) {
        editingNickname.value = getDisplayNickname(nextUser)
        return nextUser
      }
    }

    editingNickname.value = getDisplayNickname(userStore?.user)
    return null
  }

  return {
    cropImg,
    cropVisible,
    handleAvatarFileChange,
    avatarSrc,
    displayNickname,
    editingNickname,
    submitNicknameEdit,
    user,
  }
}
