/**
 * 定时自动登出功能, 启用后一段时间无用户操作, 则自动登出. 需在项目 config 中配置
 */
import { useEventListener } from '@vueuse/core'
import pinia from '@/store'
import { useUserStore } from '@/store/modules/user'
import Config from '@/config'
import { isAuthFreePath, logoutAndRedirectToLogin } from './session'

const ACTIVITY_EVENTS = ['click', 'keydown', 'mousedown', 'scroll', 'touchstart']

let timer = null
let activeRouter = null
let listenersBound = false
let stopActivityListeners = []

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function clearActivityListeners() {
  stopActivityListeners.forEach(stop => {
    stop()
  })
  stopActivityListeners = []
  listenersBound = false
}

function isIgnoredRoute(router) {
  const currentPath = router?.currentRoute?.value?.path
  return isAuthFreePath(currentPath)
}

async function logout(router) {
  const userStore = useUserStore(pinia)
  await logoutAndRedirectToLogin(userStore, router)
}

function resetTimer() {
  clearTimer()

  if (!Config.openAutoJumpOut || isIgnoredRoute(activeRouter)) {
    return
  }

  timer = setTimeout(() => {
    void logout(activeRouter)
  }, Config.stagnateTime)
}

function handleUserActivity() {
  resetTimer()
}

function bindActivityListeners() {
  if (listenersBound || typeof window === 'undefined') {
    return
  }

  stopActivityListeners = ACTIVITY_EVENTS.map(eventName =>
    useEventListener(window, eventName, handleUserActivity, { passive: true }),
  )
  stopActivityListeners.push(useEventListener(document, 'visibilitychange', handleUserActivity))
  listenersBound = true
}

export function scheduleAutoJump(router) {
  activeRouter = router

  if (!Config.openAutoJumpOut) {
    clearTimer()
    clearActivityListeners()
    return
  }

  bindActivityListeners()
  resetTimer()
}
