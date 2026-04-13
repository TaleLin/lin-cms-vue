import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockUserStore = {
  user: {},
  permissions: [],
}

vi.mock('@/store/modules/user', () => ({
  useUserStore: () => mockUserStore,
}))

import permissionDirective from '@/lin/directive/authorize'

function createElement() {
  return {
    disabled: false,
    style: {},
  }
}

describe('permission directive', () => {
  beforeEach(() => {
    mockUserStore.user = {}
    mockUserStore.permissions = []
  })

  it('hides elements when the user lacks the required permission', () => {
    const element = createElement()

    permissionDirective.beforeMount(element, {
      value: '删除图书',
    })

    expect(element.style.display).toBe('none')
    expect(element.disabled).toBe(false)
  })

  it('applies a disabled state when deny mode is requested', () => {
    const element = createElement()

    permissionDirective.beforeMount(element, {
      value: {
        permission: '编辑图书',
        type: 'disable',
      },
    })

    expect(element.disabled).toBe(true)
    expect(element.style.opacity).toBe(0.4)
    expect(element.style.cursor).toBe('not-allowed')
  })

  it('keeps the element available for admins and matched permission arrays', () => {
    const adminElement = createElement()
    mockUserStore.user = { admin: true }

    permissionDirective.beforeMount(adminElement, {
      value: '任意权限',
    })

    expect(adminElement.style.display).toBeUndefined()
    expect(adminElement.disabled).toBe(false)

    const memberElement = createElement()
    mockUserStore.user = { admin: false }
    mockUserStore.permissions = ['查询日志']

    permissionDirective.beforeMount(memberElement, {
      value: ['查询图书', '查询日志'],
    })

    expect(memberElement.style.display).toBeUndefined()
    expect(memberElement.disabled).toBe(false)
  })
})
