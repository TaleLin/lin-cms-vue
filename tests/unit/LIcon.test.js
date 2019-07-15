import { mount } from '@vue/test-utils'
import LIcon from '@/components/base/icon/lin-icon.vue'

describe('LIcon', () => {
  const wrapper
  let vm
  beforeEach(() => {
    wrapper = mount(LIcon)
    vm = wrapper.vm
  })
  it('Icon.vue', () => {
    mount(LIcon)
    expect(LIcon).toBe.ok
  })
  it('可以设置 name', () => {
    wrapper.setProps({ name: 'loading' })
    const elements = vm.$el.querySelectorAll('use')
    expect(elements.length).toBe(1)
    expect(elements[0].getAttribute('xlink:href')).toBe('#icon-loading')
  })
  it('可以设置 color', () => {
    wrapper.setProps({ color: '#ccc' })
    const elements = vm.$el.querySelectorAll('use')
    expect(elements.length).toBe(1)
    expect(elements[0].getAttribute('fill')).toBe('#ccc')
  })
  it('可以设置 width', () => {
    wrapper.setProps({ width: '30px' })
    expect(wrapper.find('svg').element.style.width).toBe('30px')
  })
  it('可以设置 height', () => {
    wrapper.setProps({ height: '30px' })
    expect(wrapper.find('svg').element.style.height).toBe('30px')
  })
  it('综合测试', () => {
    wrapper.setProps({
      name: 'loading', color: '#ccc', width: '30px', height: '30px',
    })
    const elements = vm.$el.querySelectorAll('use')
    expect(elements.length).toBe(1)
    expect(elements[0].getAttribute('xlink:href')).toBe('#icon-loading')
    expect(elements[0].getAttribute('fill')).toBe('#ccc')
    expect(wrapper.find('svg').element.style.height).toBe('30px')
    expect(wrapper.find('svg').element.style.width).toBe('30px')
    vm.$destroy()
  })
})
