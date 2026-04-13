import { describe, expect, it, vi } from 'vitest'

vi.mock('@/component/notify/observer', () => ({
  createSocketObserver: vi.fn(),
}))

import { createSocketObserver } from '@/component/notify/observer'
import { createNotifyController } from '@/component/notify/controller'

describe('notify controller', () => {
  it('disconnects the previous observer before reconnecting with merged options', () => {
    const firstObserver = {
      WebSocket: { id: 'first' },
      disconnect: vi.fn(),
      reconnection: true,
    }
    const secondObserver = {
      WebSocket: { id: 'second' },
      disconnect: vi.fn(),
      reconnection: true,
    }

    createSocketObserver.mockReturnValueOnce(firstObserver).mockReturnValueOnce(secondObserver)

    const controller = createNotifyController('ws://default.example.test', {
      reconnection: true,
      format: 'json',
    })

    const firstSocket = controller.connect()
    const secondSocket = controller.connect('ws://custom.example.test', {
      reconnectionDelay: 3000,
    })

    expect(firstSocket).toEqual({ id: 'first' })
    expect(secondSocket).toEqual({ id: 'second' })
    expect(firstObserver.reconnection).toBe(false)
    expect(firstObserver.disconnect).toHaveBeenCalledTimes(1)
    expect(createSocketObserver).toHaveBeenNthCalledWith(1, 'ws://default.example.test', {
      reconnection: true,
      format: 'json',
    })
    expect(createSocketObserver).toHaveBeenNthCalledWith(2, 'ws://custom.example.test', {
      reconnection: true,
      format: 'json',
      reconnectionDelay: 3000,
    })
  })

  it('ignores disconnect calls when no observer is active', () => {
    const controller = createNotifyController('ws://default.example.test')

    expect(() => controller.disconnect()).not.toThrow()
  })
})
