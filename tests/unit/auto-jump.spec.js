import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

async function loadAutoJump(configOverrides = {}) {
  vi.resetModules()
  vi.doMock('@/config', () => ({
    default: {
      openAutoJumpOut: true,
      stagnateTime: 1000,
      ...configOverrides,
    },
  }))
  vi.doMock('@/store', () => ({ default: {} }))

  const loginOut = vi.fn()

  vi.doMock('@/store/modules/user', () => ({
    useUserStore: () => ({ loginOut }),
  }))

  const module = await import('@/lin/util/auto-jump')

  return {
    scheduleAutoJump: module.scheduleAutoJump,
    loginOut,
  }
}

describe('auto-jump', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    window.location.hash = '#/about'
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('logs out and redirects to the login page after inactivity', async () => {
    const { scheduleAutoJump, loginOut } = await loadAutoJump()
    const replace = vi.fn().mockResolvedValue()
    const router = {
      currentRoute: {
        value: {
          path: '/about',
        },
      },
      replace,
    }

    scheduleAutoJump(router)
    await vi.advanceTimersByTimeAsync(1000)

    expect(loginOut).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/login')
    expect(window.location.hash).toBe('#/login')
  })

  it('does not start the timer on ignored routes', async () => {
    const { scheduleAutoJump, loginOut } = await loadAutoJump()
    const replace = vi.fn().mockResolvedValue()
    const router = {
      currentRoute: {
        value: {
          path: '/login',
        },
      },
      replace,
    }

    scheduleAutoJump(router)
    await vi.advanceTimersByTimeAsync(1000)

    expect(loginOut).not.toHaveBeenCalled()
    expect(replace).not.toHaveBeenCalled()
    expect(window.location.hash).toBe('#/about')
  })

  it('resets the timer when user activity happens', async () => {
    const { scheduleAutoJump, loginOut } = await loadAutoJump()
    const replace = vi.fn().mockResolvedValue()
    const router = {
      currentRoute: {
        value: {
          path: '/about',
        },
      },
      replace,
    }

    scheduleAutoJump(router)
    await vi.advanceTimersByTimeAsync(900)
    window.dispatchEvent(new Event('click'))
    await vi.advanceTimersByTimeAsync(900)

    expect(loginOut).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(100)

    expect(loginOut).toHaveBeenCalledTimes(1)
    expect(replace).toHaveBeenCalledWith('/login')
  })
})
