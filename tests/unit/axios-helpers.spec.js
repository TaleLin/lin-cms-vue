import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  handleAxiosTransportError,
  hasBinaryPayload,
  isTimeoutError,
  normalizeAxiosRequestConfig,
} from '@/lin/plugin/axios-helpers'

describe('axios helpers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects request configs without a url and normalizes refresh requests', () => {
    expect(() => normalizeAxiosRequestConfig({ headers: {} })).toThrow('request need url')

    expect(
      normalizeAxiosRequestConfig(
        {
          url: '/cms/user/refresh',
          method: 'GET',
          headers: {},
          data: {
            page: 1,
          },
        },
        {
          accessToken: 'Bearer access-token',
          refreshToken: 'Bearer refresh-token',
        },
      ),
    ).toMatchObject({
      url: '/cms/user/refresh',
      method: 'get',
      params: {
        page: 1,
      },
      headers: {
        Authorization: 'Bearer refresh-token',
      },
    })
  })

  it('detects binary form payloads and wraps them in FormData for post requests', () => {
    expect(
      hasBinaryPayload({
        file: new File(['demo'], 'demo.png', { type: 'image/png' }),
      }),
    ).toBe(true)

    const config = normalizeAxiosRequestConfig(
      {
        url: 'cms/file',
        method: 'POST',
        headers: {},
        data: {
          file: new File(['demo'], 'demo.png', { type: 'image/png' }),
        },
      },
      {
        accessToken: 'Bearer access-token',
      },
    )

    expect(config.data).toBeInstanceOf(FormData)
    expect(config.headers.Authorization).toBe('Bearer access-token')
  })

  it('classifies timeout transport failures and avoids duplicate generic notifications', () => {
    const messageApi = {
      error: vi.fn(),
      warning: vi.fn(),
    }
    const timeoutError = {
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded',
    }

    expect(isTimeoutError(timeoutError)).toBe(true)
    expect(handleAxiosTransportError(messageApi, timeoutError)).toBe('请求超时')

    expect(messageApi.warning).toHaveBeenCalledWith('请求超时')
    expect(messageApi.error).not.toHaveBeenCalled()
  })

  it('shows the generic transport notification when no response is available', () => {
    const messageApi = {
      error: vi.fn(),
      warning: vi.fn(),
    }

    expect(
      handleAxiosTransportError(messageApi, {
        code: 'ERR_NETWORK',
        message: 'Network Error',
      }),
    ).toBe('请检查 API 是否异常')

    expect(messageApi.error).toHaveBeenCalledWith('请检查 API 是否异常')
    expect(messageApi.warning).not.toHaveBeenCalled()
  })

  it('does not report handled transport messages when the server already returned a response', () => {
    const messageApi = {
      error: vi.fn(),
      warning: vi.fn(),
    }

    expect(
      handleAxiosTransportError(messageApi, {
        response: {
          status: 500,
        },
        message: 'Internal Server Error',
      }),
    ).toBe('')

    expect(messageApi.error).not.toHaveBeenCalled()
    expect(messageApi.warning).not.toHaveBeenCalled()
  })
})
