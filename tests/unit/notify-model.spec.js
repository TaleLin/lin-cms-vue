import { beforeEach, describe, expect, it, vi } from 'vitest'

const axiosMocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}))

vi.mock('@/lin/plugin/axios', () => ({
  get: axiosMocks.get,
  post: axiosMocks.post,
  put: axiosMocks.put,
}))

import { createNotifyModel, notifyModel } from '@/model/notify'

describe('notify model', () => {
  beforeEach(() => {
    axiosMocks.get.mockReset()
    axiosMocks.post.mockReset()
    axiosMocks.put.mockReset()
  })

  it('loads notify events and caches them on the model', async () => {
    axiosMocks.get.mockResolvedValue({
      events: ['new_message', 'new_log'],
    })

    const model = createNotifyModel('/notify')
    const events = await model.getEvents()

    expect(events).toEqual(['new_message', 'new_log'])
    expect(model.events).toEqual(['new_message', 'new_log'])
    expect(axiosMocks.get).toHaveBeenCalledWith('cms/notify/events')
  })

  it('initializes sse connections from the configured base url and loaded events', async () => {
    axiosMocks.get.mockResolvedValue({
      events: ['new_message'],
    })
    const sse = { disconnect: vi.fn() }
    const sseFactory = vi.fn(() => sse)

    const model = createNotifyModel('/notify', {
      baseURL: 'https://api.example.test',
      sseFactory,
    })
    const connection = await model.initSse()

    expect(connection).toBe(sse)
    expect(model.sse).toBe(sse)
    expect(model.events).toEqual(['new_message'])
    expect(sseFactory).toHaveBeenCalledWith('https://api.example.test/notify', ['new_message'])
  })

  it('creates and updates event subscriptions with the backend payload contract', async () => {
    axiosMocks.post.mockResolvedValue({ code: 200 })
    axiosMocks.put.mockResolvedValue({ code: 200 })

    await notifyModel.createEvents(7, ['new_message'])
    await notifyModel.updateEvents(7, ['new_log'])

    expect(axiosMocks.post).toHaveBeenCalledWith('cms/notify/events', {
      group_id: 7,
      events: ['new_message'],
    })
    expect(axiosMocks.put).toHaveBeenCalledWith('cms/notify/events', {
      group_id: 7,
      events: ['new_log'],
    })
  })
})
