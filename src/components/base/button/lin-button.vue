<template>
  <button :class="classes" @click="onClick()">
    <l-icon
      ref="icon"
      class="icon"
      v-if="icon && !loading"
      :name="icon" />
    <l-icon
      ref="icon"
      class="loading icon"
      v-if="loading"
      name="icon-sync" />
    <div class="l-button-content">
      <slot />
    </div>
  </button>
</template>

<script>
import LIcon from '../icon/lin-icon'

export default {
  name: 'LinButton',
  components: {
    'l-icon': LIcon,
  },
  props: {
    type: {
      type: String,
      default: 'default',
    },
    plain: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ripple: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    iconPosition: {
      type: String,
      default: 'left',
      validator(value) {
        return value === 'left' || value === 'right'
      },
    },
  },
  computed: {
    classes() {
      const {
        iconPosition,
        type,
        disabled,
        ripple,
        plain,
        circle,
        $slots,
      } = this
      return {
        'l-button': true,
        [`icon-${iconPosition}`]: true,
        [`l-button--${type}`]: true,
        disabled,
        ripple: !disabled && ripple,
        plain,
        circle,
        clearMargin: !$slots.default,
      }
    },
  },
  methods: {
    onClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import "./button.scss";

.l-button,
.l-button--default {
  font-size: $font-size;
  height: $button-height;
  padding: 0 1.15em;
  border-radius: $border-radius;
  border: 1px solid $border-color;
  background: $button-bg;
  color: $button-color;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  min-width: $button-height;
  cursor: pointer;

  &:focus,
  &:hover {
    outline: none;
  }

  &:focus:not(.disabled),
  &:hover:not(.disabled) {
    outline: none;
    color: $button-primary-plain-color;
    border: 1px solid $button-primary-plain-color;
  }

  >.l-button-content {
    order: 2;
  }

  >.icon {
    order: 1;
    margin-right: 0.4em;
  }

  &.icon-right {
    >.l-button-content {
      order: 1;
    }

    >.icon {
      order: 2;
      margin-right: 0;
      margin-left: 0.4em;
    }
  }

  &.clearMargin {
    padding: 0;

    >.icon {
      margin-right: 0;
      margin-left: 0;
    }
  }

  &.circle {
    border-radius: 50%;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading {
    opacity: 0.5;
    @include spin;
  }

  svg {
    fill: #fff;
  }
}

.l-button+.l-button {
  margin-left: 10px;
}

.l-button--primary {
  background: $button-primary-bg;
  color: #fff;
  border: 1px solid $button-primary-bg;

  &.plain {
    color: $button-primary-plain-color;
    background: #fff;
    border: 1px solid $button-primary-plain-color;

    svg {
      fill: $button-primary-plain-color;
    }

    &:hover:not(.disabled),
    &:focus:not(.disabled) {
      background: $button-primary-bg;
      color: #fff;
      border: 1px solid $button-primary-bg;

      svg {
        fill: #fff;
      }
    }
  }

  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled),
  &:focus:not(.disabled) {
    color: #fff;
    background: #0037ad;
    border: 1px solid #0037ad;

    svg {
      fill: #fff;
    }
  }
}

.l-button--success {
  background: $button-success-bg;
  color: #fff;
  border: 1px solid $button-success-bg;

  &.plain {
    color: $button-success-plain-color;
    background: #fff;
    border: 1px solid $button-success-plain-color;

    svg {
      fill: $button-success-plain-color;
    }

    &:hover:not(.disabled),
    &:focus:not(.disabled) {
      background: $button-success-bg;
      color: #fff;
      border: 1px solid $button-success-bg;

      svg {
        fill: #fff;
      }
    }
  }

  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled),
  &:focus:not(.disabled) {
    color: #fff;
    background: #009d72;
    border: 1px solid #009d72;

    svg {
      fill: #fff;
    }
  }
}

.l-button--danger {
  background: $button-danger-bg;
  color: #fff;
  border: 1px solid $button-danger-bg;

  &.plain {
    color: $button-danger-plain-color;
    background: #fff;
    border: 1px solid $button-danger-plain-color;

    svg {
      fill: $button-danger-plain-color;
    }

    &:hover:not(.disabled),
    &:focus:not(.disabled) {
      background: $button-danger-bg;
      color: #fff;
      border: 1px solid $button-danger-bg;

      svg {
        fill: #fff;
      }
    }
  }

  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled),
  &:focus:not(.disabled) {
    color: #fff;
    background: #d62f40;
    border: 1px solid #d62f40;

    svg {
      fill: #fff;
    }
  }
}

.l-button--reverse {
  background: $button-reverse-bg;
  color: #8C98AE;
  border: 1px solid $button-reverse-bg;

  svg {
    fill: #8C98AE;
  }

  &.plain {
    color: $button-reverse-plain-color;
    background: #fff;
    border: 1px solid $button-reverse-plain-color;

    svg {
      fill: $button-reverse-plain-color;
    }

    &:hover:not(.disabled),
    &:focus:not(.disabled) {
      background: #8C98AE;
      color: #fff;
      border: 1px solid #8C98AE;

      svg {
        fill: #fff;
      }
    }
  }

  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled),
  &:focus:not(.disabled) {
    color: #8C98AE;
    background: #bfcbd7;
    border: 1px solid #BFCBD7;

    svg {
      fill: #8C98AE;
    }
  }
}

.ripple {
  position: relative;
  overflow: hidden;
}

/*button 水波纹点击效果*/
.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #000 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.5s, opacity 1s;
}

.ripple:active:after {
  transform: scale(0, 0);
  opacity: 0.2;
  transition: 0s;
}
</style>
