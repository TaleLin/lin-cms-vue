import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Util from '@/lin/util/util'
import appConfig from '@/config/index'
import stageConfig from '@/config/stage'

// Helper functions moved from getter.js
let stageMap = {}

function deepTravel(obj, fuc) {
  if (Array.isArray(obj)) {
    obj.forEach(item => deepTravel(item, fuc))
    return
  }
  if (obj && obj.children) {
    fuc(obj)
    deepTravel(obj.children, fuc)
    return
  }
  if (obj.name) {
    fuc(obj)
  }
}

function IterationDelateMenuChildren(arr) {
  if (arr.length) {
    for (const i in arr) {
      if (arr[i].children && !arr[i].children.length) {
        delete arr[i]
      } else if (arr[i].children && arr[i].children.length) {
        IterationDelateMenuChildren(arr[i].children)
      }
    }
  }
  return arr
}

function permissionShaking(stageConfig, permissions, currentUser) {
  const shookConfig = stageConfig.filter(route => {
    if (Util.hasPermission(permissions, route, currentUser)) {
      if (route.children && route.children.length) {
        route.children = permissionShaking(route.children, permissions, currentUser)
      }
      return true
    }
    return false
  })
  return IterationDelateMenuChildren(shookConfig)
}

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref({})
  const loggedIn = ref(false)
  const permissions = ref([])
  const unreadMessages = ref([])
  const alreadyReadMessages = ref([])
  const currentRoute = ref({ config: null, treePath: [] })
  const refreshOptions = ref(null)
  const sidebarLevel = ref(appConfig.sidebarLevel || 3)
  const defaultRoute = ref(appConfig.defaultRoute || '/about')

  // Getters
  const permissionStageConfig = computed(() => {
    const tempStageConfig = Util.deepClone(stageConfig)
    const shookConfig = permissionShaking(tempStageConfig, permissions.value, user.value)
    const list = {}
    deepTravel(shookConfig, item => { list[item.name] = item })
    stageMap = list
    return shookConfig
  })

  const sidebarList = computed(() => {
    function deepGetSidebar(target, level = sidebarLevel.value) {
      if (Array.isArray(target)) {
        return target.map(item => deepGetSidebar(item, level - 1)).filter(item => item !== null)
      }
      if (!target.inNav) return null
      if (target.type === 'folder' && level !== 0) {
        return {
          name: target.name, title: target.title, icon: target.icon,
          isElementIcon: target.isElementIcon,
          path: target.route || Util.getRandomStr(6),
          children: target.children.map(item => deepGetSidebar(item, level - 1)).filter(item => item !== null)
        }
      }
      if (target.type === 'view') {
        return { name: target.name, title: target.title, icon: target.icon, isElementIcon: target.isElementIcon, path: target.route }
      }
      if (target.type === 'tab') {
        const sideConfig = { name: target.name, title: target.title, icon: target.icon, isElementIcon: target.isElementIcon, path: target.route }
        if (!sideConfig.path && target.children?.[0]?.route) sideConfig.path = target.children[0].route
        return sideConfig
      }
      if (level <= 0) {
        const sideConfig = { name: target.name, title: target.title, icon: target.icon, isElementIcon: target.isElementIcon, path: Util.getRandomStr(6) }
        if (target.children?.[0]?.route) sideConfig.path = target.children[0].route
        return sideConfig
      }
      return null
    }
    return deepGetSidebar(permissionStageConfig.value)
  })

  const getStageByName = computed(() => name => stageMap[name])
  const getStageByRoute = computed(() => path => {
    const result = Object.getOwnPropertySymbols(stageMap).find(key => stageMap[key].route === path)
    return stageMap[result]
  })
  const stageList = computed(() => stageMap)

  const getStageInfo = computed(() => {
    const cache = {}
    const findStage = (stages, name) => {
      let result
      if (Array.isArray(stages)) {
        for (let i = 0; i < stages.length; i += 1) {
          result = findStage(stages[i], name)
          if (result) break
        }
        return result
      }
      if (stages.children?.length) {
        result = findStage(stages.children, name)
        if (result) result.unshift(stages)
        return result
      }
      if (stages.name === name) return [stages]
      return false
    }
    return name => {
      if (cache[name]) return cache[name]
      const stageInfo = findStage(stageConfig, name)
      if (stageInfo) cache[name] = stageInfo
      return stageInfo
    }
  })

  // Actions
  function setLoggedIn(value) { loggedIn.value = value }
  function removeLoggedIn() { loggedIn.value = false; user.value = null }
  function setUser(newUser) { user.value = newUser }
  function markReadMessage(message) { alreadyReadMessages.value.push(message) }
  function markUnreadMessage(message) { unreadMessages.value.push(message) }
  function removeUnreadMessage(id) {
    const index = unreadMessages.value.findIndex(el => el.id === id)
    unreadMessages.value.splice(index, 1)
  }
  function setUserPermissions(perms) {
    permissions.value = perms.map(p => Object.values(p)).flat(2).map(p => p.permission)
  }
  function setRefreshOption(option) { refreshOptions.value = option }
  function setUserAndState(newUser) { setUser(newUser); setLoggedIn(true) }
  function loginOut() { localStorage.clear(); removeLoggedIn() }
  function readMessage(message) { removeUnreadMessage(message.id); markReadMessage(message) }

  return {
    user, loggedIn, permissions, unreadMessages, alreadyReadMessages,
    currentRoute, refreshOptions, sidebarLevel, defaultRoute, stageConfig,
    permissionStageConfig, sidebarList, getStageByName, getStageByRoute, stageList, getStageInfo,
    setLoggedIn, removeLoggedIn, setUser, markReadMessage, markUnreadMessage,
    removeUnreadMessage, setUserPermissions, setRefreshOption, setUserAndState, loginOut, readMessage
  }
}, {
  persist: {
    pick: ['user', 'loggedIn', 'permissions']
  }
})
