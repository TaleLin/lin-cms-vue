import { describe, expect, it, vi } from 'vitest'

import {
  axiosConfig,
  createRequestClient,
  createRequestInterceptor,
  createRequestMethods,
  createResponseErrorHandler,
  createResponseSuccessHandler,
} from '@/lin/plugin/axios'

describe('axios plugin', () => {
  it('exposes the shared axios base config', () => {
    expect(axiosConfig).toMatchObject({
      timeout: 5000,
      crossOrigin: true,
    })
    expect(axiosConfig.validateStatus(200)).toBe(true)
    expect(axiosConfig.validateStatus(509)).toBe(true)
    expect(axiosConfig.validateStatus(510)).toBe(false)
  })

  it('creates a request interceptor that schedules auto jump and normalizes tokens', () => {
    const scheduleAutoJumpFn = vi.fn()
    const normalizeRequestConfig = vi.fn((config, tokens) => ({
      ...config,
      headers: tokens,
    }))
    const routerInstance = { currentRoute: { value: { path: '/about' } } }
    const interceptor = createRequestInterceptor({
      routerInstance,
      scheduleAutoJumpFn,
      normalizeRequestConfig,
      getAccessToken: () => 'Bearer access',
      getRefreshToken: () => 'Bearer refresh',
    })

    expect(
      interceptor({
        url: '/cms/user',
        method: 'get',
      }),
    ).toEqual({
      url: '/cms/user',
      method: 'get',
      headers: {
        accessToken: 'Bearer access',
        refreshToken: 'Bearer refresh',
      },
    })
    expect(scheduleAutoJumpFn).toHaveBeenCalledWith(routerInstance)
  })

  it('returns response data directly for successful responses', async () => {
    const handler = createResponseSuccessHandler()

    await expect(
      handler({
        status: 200,
        data: { id: 1 },
      }),
    ).resolves.toEqual({ id: 1 })
  })

  it('schedules logout and rejects a normalized request error when refresh token errors occur', async () => {
    const scheduleLogoutOnRefreshFailureFn = vi.fn(() => true)
    const handler = createResponseSuccessHandler({
      getUserStore: () => ({ id: 'store' }),
      routerInstance: { path: '/about' },
      logoutAndRedirectToLoginFn: vi.fn(),
      scheduleLogoutOnRefreshFailureFn,
      isAccessTokenExceptionFn: vi.fn(),
      retryAfterRefresh: vi.fn(),
      resolveResponseErrorMessageFn: vi.fn(),
      messageApi: { error: vi.fn() },
    })

    await expect(
      handler({
        status: 401,
        data: { code: 10042, message: 'refresh token 已失效' },
        config: {},
      }),
    ).rejects.toMatchObject({
      name: 'RequestError',
      isRequestError: true,
      status: 401,
      data: { code: 10042, message: 'refresh token 已失效' },
    })
    expect(scheduleLogoutOnRefreshFailureFn).toHaveBeenCalledWith(
      10042,
      expect.objectContaining({
        getUserStore: expect.any(Function),
        router: { path: '/about' },
      }),
    )
  })

  it('retries requests after access token refresh', async () => {
    const retryAfterRefresh = vi.fn().mockResolvedValue({ ok: true })
    const handler = createResponseSuccessHandler({
      scheduleLogoutOnRefreshFailureFn: vi.fn(() => false),
      isAccessTokenExceptionFn: code => code === 10041,
      retryAfterRefresh,
      resolveResponseErrorMessageFn: vi.fn(),
      messageApi: { error: vi.fn() },
    })

    await expect(
      handler({
        status: 401,
        data: { code: 10041 },
        config: {},
      }),
    ).resolves.toEqual({ ok: true })
    expect(retryAfterRefresh).toHaveBeenCalledTimes(1)
  })

  it('rejects handled responses without showing global messages', async () => {
    const messageApi = { error: vi.fn() }
    const handler = createResponseSuccessHandler({
      scheduleLogoutOnRefreshFailureFn: vi.fn(() => false),
      isAccessTokenExceptionFn: vi.fn(() => false),
      retryAfterRefresh: vi.fn(),
      resolveResponseErrorMessageFn: vi.fn(() => 'ignored'),
      messageApi,
    })
    const response = {
      status: 400,
      data: { code: 10030, message: '参数错误' },
      config: { handleError: true },
    }

    await expect(handler(response)).rejects.toMatchObject({
      name: 'RequestError',
      isRequestError: true,
      status: 400,
      data: { code: 10030, message: '参数错误' },
      config: { handleError: true },
    })
    expect(messageApi.error).not.toHaveBeenCalled()
  })

  it('shows global messages for standard backend errors and rejects the response', async () => {
    const messageApi = { error: vi.fn() }
    const resolveResponseErrorMessageFn = vi.fn(() => '字段重复')
    const handler = createResponseSuccessHandler({
      scheduleLogoutOnRefreshFailureFn: vi.fn(() => false),
      isAccessTokenExceptionFn: vi.fn(() => false),
      retryAfterRefresh: vi.fn(),
      resolveResponseErrorMessageFn,
      useFrontEndErrorMsg: true,
      errorCodeMap: { 10060: '字段重复' },
      messageApi,
    })
    const response = {
      status: 400,
      data: { code: 10060, message: null },
      config: { showBackend: false },
    }

    await expect(handler(response)).rejects.toMatchObject({
      name: 'RequestError',
      isRequestError: true,
      status: 400,
      data: { code: 10060, message: null },
      config: { showBackend: false },
    })
    expect(resolveResponseErrorMessageFn).toHaveBeenCalledWith({
      code: 10060,
      message: null,
      useFrontEndErrorMsg: true,
      showBackend: false,
      errorCodeMap: { 10060: '字段重复' },
    })
    expect(messageApi.error).toHaveBeenCalledWith('字段重复')
  })

  it('falls back to the normalized request error message when the resolver returns an empty message', async () => {
    const messageApi = { error: vi.fn() }
    const handler = createResponseSuccessHandler({
      scheduleLogoutOnRefreshFailureFn: vi.fn(() => false),
      isAccessTokenExceptionFn: vi.fn(() => false),
      retryAfterRefresh: vi.fn(),
      resolveResponseErrorMessageFn: vi.fn(() => ''),
      messageApi,
    })

    await expect(
      handler({
        status: 400,
        data: { code: 10030, message: null },
        config: { showBackend: true },
      }),
    ).rejects.toMatchObject({
      name: 'RequestError',
      isRequestError: true,
      isNotified: true,
      message: '操作失败，请稍后重试',
      notifiedMessage: '操作失败，请稍后重试',
    })

    expect(messageApi.error).toHaveBeenCalledWith('操作失败，请稍后重试')
  })

  it('delegates transport failures to the shared transport error handler', async () => {
    const messageApi = { error: vi.fn(), warning: vi.fn() }
    const handleAxiosTransportErrorFn = vi.fn(() => '请求超时')
    const handler = createResponseErrorHandler({
      handleAxiosTransportErrorFn,
      messageApi,
    })
    const error = new Error('network')

    await expect(handler(error)).rejects.toMatchObject({
      name: 'RequestError',
      isRequestError: true,
      message: 'network',
      isNotified: true,
      notifiedMessage: '请求超时',
    })
    expect(handleAxiosTransportErrorFn).toHaveBeenCalledWith(
      messageApi,
      expect.objectContaining({
        name: 'RequestError',
        isRequestError: true,
        message: 'network',
      }),
    )
  })

  it('creates a request client and wires both interceptors', () => {
    const requestUse = vi.fn()
    const responseUse = vi.fn()
    const client = {
      interceptors: {
        request: { use: requestUse },
        response: { use: responseUse },
      },
    }
    const axiosLib = {
      create: vi.fn(() => client),
    }

    expect(
      createRequestClient({
        axiosLib,
        createRefreshRetry: vi.fn(() => vi.fn()),
        scheduleLogoutOnRefreshFailureFn: vi.fn(() => false),
        isAccessTokenExceptionFn: vi.fn(() => false),
        resolveResponseErrorMessageFn: vi.fn(() => ''),
        handleAxiosTransportErrorFn: vi.fn(),
        messageApi: { error: vi.fn(), warning: vi.fn() },
        getAccessToken: vi.fn(() => ''),
        getRefreshToken: vi.fn(() => ''),
        getUserStore: vi.fn(() => ({})),
      }),
    ).toBe(client)

    expect(axiosLib.create).toHaveBeenCalledWith(axiosConfig)
    expect(requestUse).toHaveBeenCalledTimes(1)
    expect(responseUse).toHaveBeenCalledTimes(1)
  })

  it('creates thin request helpers from a single request function', async () => {
    const requestFn = vi.fn().mockResolvedValue({ ok: true })
    const methods = createRequestMethods(requestFn)

    await methods.request({ method: 'patch', url: '/ping' })
    await methods.post('/books', { title: 'Lin' }, { page: 1 })
    await methods.get('/books', { page: 2 })
    await methods.put('/books/1', { title: 'Vue' }, { page: 3 })
    await methods._delete('/books/1', { soft: true })

    expect(requestFn).toHaveBeenNthCalledWith(1, {
      method: 'patch',
      url: '/ping',
    })
    expect(requestFn).toHaveBeenNthCalledWith(2, {
      method: 'post',
      url: '/books',
      data: { title: 'Lin' },
      params: { page: 1 },
    })
    expect(requestFn).toHaveBeenNthCalledWith(3, {
      method: 'get',
      url: '/books',
      params: { page: 2 },
    })
    expect(requestFn).toHaveBeenNthCalledWith(4, {
      method: 'put',
      url: '/books/1',
      params: { page: 3 },
      data: { title: 'Vue' },
    })
    expect(requestFn).toHaveBeenNthCalledWith(5, {
      method: 'delete',
      url: '/books/1',
      params: { soft: true },
    })
  })
})
