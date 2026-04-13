import { computed, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const useGroupPermissions = vi.fn()

vi.mock('@/view/admin/group/use-group-permissions', () => ({
  useGroupPermissions,
}))

const globalOptions = {
  directives: {
    loading: {},
  },
  stubs: {
    ElCheckbox: true,
    ElCheckboxGroup: true,
  },
}

describe('group permission component', () => {
  beforeEach(() => {
    useGroupPermissions.mockReset()
  })

  it('renders the title label only when the title prop is provided', async () => {
    const getGroupPermissions = vi.fn()

    useGroupPermissions.mockImplementation((_getId, options) => {
      options.onLoaded?.({ selectedIds: [1] })
      options.syncSelectedIds?.([1])

      return {
        allPermissions: computed(() => ({})),
        checkedPermissionNames: ref([]),
        getGroupPermissions,
        halfPermissions: ref([]),
        loading: ref(false),
        moduleCheck: vi.fn(),
        permissionModuleNames: ref([]),
        singleCheck: vi.fn(),
      }
    })

    const component = (await import('@/view/admin/group/group-permission.vue')).default
    const titledWrapper = mount(component, {
      props: {
        title: '分配权限',
      },
      global: globalOptions,
    })
    const plainWrapper = mount(component, {
      global: globalOptions,
    })

    expect(titledWrapper.find('.label').text()).toContain('分配权限')
    expect(plainWrapper.find('.label').exists()).toBe(false)
    expect(plainWrapper.find('.group').classes()).toContain('group--without-label')

    plainWrapper.vm.getGroupPermissions()
    expect(getGroupPermissions).toHaveBeenCalledTimes(1)
  })
})
