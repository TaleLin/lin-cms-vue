<template>
  <svg class="l-icon" :style="{ width, height }" @click="$emit('click', $event)">
    <use :xlink:href="`#${name}`" :fill="color || buttonColor"></use>
  </svg>
</template>

<script>
import './iconfont.js'

export default {
  name: 'LIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '1.2em',
    },
    height: {
      type: String,
      default: '1.2em',
    },
  },
  data() {
    return {
      buttonColor: '#fff',
    }
  },
  mounted() {
    this.setIconButtonColor()
  },
  methods: {
    setIconButtonColor() {
      const { type } = this.$parent
      if (this.$parent.plain) {
        console.log(type)
        switch (type) {
          case 'primary':
            this.buttonColor = '#3963BC'
            break
          case 'success':
            this.buttonColor = '#34BFA3'
            break
          case 'danger':
            this.buttonColor = '#F4516C'
            break
          case 'info':
            this.buttonColor = '#C4C5D6'
            break
          default:
            this.buttonColor = '#3963BC'
        }
      } else if (type === 'default') {
        this.buttonColor = '#3963BC'
      }
    },
    mouseover() {
      if (this.$parent.plain) {
        this.buttonColor = '#fff'
      }
    },
    mouseout() {
      this.setIconButtonColor()
    },
  },
}
</script>

<style lang="scss" scoped>
.l-icon {
  &:hover {
    color: #fff;
  }
}
</style>
