import { describe, expect, it, vi } from 'vitest'

import {
  createRequestError,
  getRequestErrorMessage,
  markRequestErrorAsNotified,
  notifyRequestError,
  shouldNotifyRequestError,
} from '@/lin/util/request-error'

describe('request error helpers', () => {
  it('normalizes response-like failures into a stable request error object', () => {
    const requestError = createRequestError({
      status: 401,
      data: {
        code: 10042,
        message: ['refresh token 失效'],
      },
      config: {
        handleError: true,
      },
    })

    expect(requestError).toMatchObject({
      name: 'RequestError',
      isRequestError: true,
      status: 401,
      data: {
        code: 10042,
        message: ['refresh token 失效'],
      },
      config: {
        handleError: true,
      },
      code: 10042,
      message: 'refresh token 失效',
    })
    expect(requestError.response).toMatchObject({
      status: 401,
      data: {
        code: 10042,
        message: ['refresh token 失效'],
      },
    })
    expect(requestError.isNotified).toBe(false)
  })

  it('extracts readable messages from different error payload shapes', () => {
    expect(getRequestErrorMessage(new Error('请求失败'), '兜底提示')).toBe('请求失败')
    expect(
      getRequestErrorMessage(
        {
          data: {
            message: ['列表加载失败', '忽略后续'],
          },
        },
        '兜底提示',
      ),
    ).toBe('列表加载失败')
    expect(
      getRequestErrorMessage(
        {
          response: {
            data: {
              message: {
                name: ['分组名称不能为空'],
              },
            },
          },
        },
        '兜底提示',
      ),
    ).toBe('分组名称不能为空')
    expect(getRequestErrorMessage(null, '兜底提示')).toBe('兜底提示')
  })

  it('only asks the page layer to notify when the interceptor has not already done so', () => {
    expect(
      shouldNotifyRequestError(
        markRequestErrorAsNotified(
          {
            config: { handleError: true },
            data: { message: '拦截器已提示' },
            status: 400,
          },
          '拦截器已提示',
        ),
      ),
    ).toBe(false)

    expect(
      shouldNotifyRequestError({
        config: {},
        data: { message: '已由拦截器处理' },
        status: 400,
      }),
    ).toBe(false)

    expect(
      shouldNotifyRequestError({
        config: { handleError: true },
        data: { message: '需要页面自行提示' },
        status: 400,
      }),
    ).toBe(true)

    expect(
      shouldNotifyRequestError({
        config: { handleError: true },
        message: 'Network Error',
      }),
    ).toBe(false)

    expect(shouldNotifyRequestError(new Error('unexpected'))).toBe(true)
  })

  it('notifies through the provided message api when needed', () => {
    const messageApi = {
      error: vi.fn(),
    }

    notifyRequestError(messageApi, new Error('本地执行失败'), '兜底提示')
    notifyRequestError(
      messageApi,
      {
        config: { handleError: true },
        data: { message: '后端显式失败' },
        status: 400,
      },
      '兜底提示',
    )
    notifyRequestError(
      messageApi,
      markRequestErrorAsNotified(
        {
          config: { handleError: true },
          data: { message: '不要重复提示' },
          status: 400,
        },
        '不要重复提示',
      ),
      '兜底提示',
    )
    notifyRequestError(
      messageApi,
      {
        config: {},
        data: { message: '不要重复提示' },
        status: 400,
      },
      '兜底提示',
    )

    expect(messageApi.error).toHaveBeenNthCalledWith(1, '本地执行失败')
    expect(messageApi.error).toHaveBeenNthCalledWith(2, '后端显式失败')
    expect(messageApi.error).toHaveBeenCalledTimes(2)
  })
})
