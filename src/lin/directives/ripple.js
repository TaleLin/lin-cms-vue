import Vue from 'vue'

/* eslint-disable func-names */
Vue.directive('ripple', {
  inserted(el, binding) {
    const cl = Array.from(el.classList)
    if (cl.includes('disabled')) {
      return
    }

    let background = 'rgba(0,0,0,.3)'
    el.setAttribute('ripple', 'ripple')
    /* eslint no-param-reassign: 0 */
    el.style.position = 'relative'
    if (binding.value) {
      background = binding.value
    }

    const isMobile = window.navigator.userAgent.match(/Mobile/) && window.navigator.userAgent.match(/Mobile/)[0] === 'Mobile'
    const event = isMobile ? 'touchstart' : 'click'

    el.addEventListener(event, function (e) {
      // e.preventDefault()
      const button = el
      const rect = button.getBoundingClientRect()
      const btnWidth = rect.width
      let posMouseX = 0
      let posMouseY = 0

      if (isMobile) {
        posMouseX = e.changedTouches[0].pageX - rect.left
        posMouseY = e.changedTouches[0].pageY - rect.top
      } else {
        posMouseX = e.x - rect.left
        posMouseY = e.y - rect.top
      }

      const baseCSS = `
        position: absolute; width: ${btnWidth * 2}px; height: ${btnWidth * 2}px; transition: all linear 1000ms; 
        transition-timing-function:cubic-bezier(0.250, 0.460, 0.450, 0.940);border-radius: 50%; 
        background: ${background}; top:${posMouseY - btnWidth}px; left:${posMouseX - btnWidth}px; 
        pointer-events: none; transform:scale(0)`

      const rippleEffect = document.createElement('span')
      rippleEffect.style.cssText = baseCSS

      button.style.overflow = 'hidden'
      this.appendChild(rippleEffect)

      setTimeout(() => {
        rippleEffect.style.cssText = `${baseCSS}transform:scale(1); opacity: 0;`
      }, 10)

      setTimeout(() => {
        rippleEffect.remove()
      }, 1000)
    })
  },
})

export default Vue.directive('ripple')
