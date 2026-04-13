import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import appConfig from '@/config/index'
import stageConfig from '@/config/stage'
import { clearAuthStorage } from '@/lin/util/token'
import {
  createSidebarList,
  createStageMap,
  filterAuthorizedStages,
  findStageBranch,
  findStageByRoutePath,
  mapPermissionIdentifiers,
  markMessageAsRead,
  markMessageAsUnread,
} from './user-helpers'

export const useUserStore = defineStore(
  'user',
  () => {
    const sidebarLevel = appConfig.sidebarLevel || 3
    const defaultRoute = appConfig.defaultRoute || '/about'

    // State
    const user = ref({})
    const loggedIn = ref(false)
    const permissions = ref([])
    const unreadMessages = ref([])
    const alreadyReadMessages = ref([])

    // Getters
    const permissionStageConfig = computed(() => filterAuthorizedStages(stageConfig, permissions.value, user.value))

    const stageMap = computed(() => createStageMap(permissionStageConfig.value))
    const sidebarList = computed(() => createSidebarList(permissionStageConfig.value, sidebarLevel))
    const unreadMessageCount = computed(() => unreadMessages.value.length)
    const stageInfoCache = new Map()

    function getStageByName(name) {
      return stageMap.value[name]
    }

    function getStageByRoute(path) {
      return findStageByRoutePath(stageMap.value, path)
    }

    function getStageInfo(name) {
      if (stageInfoCache.has(name)) {
        return stageInfoCache.get(name)
      }

      const stageInfo = findStageBranch(stageConfig, name)
      stageInfoCache.set(name, stageInfo)

      return stageInfo
    }

    // Actions
    function setLoggedIn(value) {
      loggedIn.value = value
    }
    function removeLoggedIn() {
      loggedIn.value = false
      user.value = {}
    }
    function setUser(newUser) {
      user.value = newUser
    }
    function markReadMessage(message) {
      alreadyReadMessages.value.push(markMessageAsRead(message))
    }
    function markUnreadMessage(message) {
      unreadMessages.value.push(markMessageAsUnread(message))
    }
    function removeUnreadMessage(id) {
      const index = unreadMessages.value.findIndex(el => el.id === id)
      if (index >= 0) {
        unreadMessages.value.splice(index, 1)
      }
    }
    function setUserPermissions(perms) {
      permissions.value = mapPermissionIdentifiers(perms)
    }
    function setUserAndState(newUser) {
      setUser(newUser)

      if (Array.isArray(newUser?.permissions)) {
        setUserPermissions(newUser.permissions)
      }

      setLoggedIn(true)
    }
    function loginOut() {
      clearAuthStorage(['user'])
      permissions.value = []
      unreadMessages.value = []
      alreadyReadMessages.value = []
      removeLoggedIn()
    }
    function readAllMessages() {
      if (!unreadMessages.value.length) {
        return
      }

      alreadyReadMessages.value = [...alreadyReadMessages.value, ...unreadMessages.value.map(markMessageAsRead)]
      unreadMessages.value = []
    }
    function readMessage(message) {
      const unreadMessage = unreadMessages.value.find(item => item.id === message?.id)
      if (!unreadMessage) {
        return
      }

      removeUnreadMessage(unreadMessage.id)
      markReadMessage(unreadMessage)
    }

    return {
      user,
      loggedIn,
      permissions,
      unreadMessages,
      alreadyReadMessages,
      sidebarLevel,
      defaultRoute,
      permissionStageConfig,
      sidebarList,
      unreadMessageCount,
      getStageByName,
      getStageByRoute,
      getStageInfo,
      setLoggedIn,
      removeLoggedIn,
      setUser,
      markReadMessage,
      markUnreadMessage,
      removeUnreadMessage,
      setUserPermissions,
      setUserAndState,
      loginOut,
      readAllMessages,
      readMessage,
    }
  },
  {
    persist: {
      key: 'lin-cms:user',
      pick: ['user', 'loggedIn', 'permissions'],
    },
  },
)
