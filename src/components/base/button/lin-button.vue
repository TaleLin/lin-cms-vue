<template>
  <button
    class="l-button"
    :class="{[`icon-${iconPosition}`]: true, [`l-button--${type}`]: true,clearMargin: !$slots.default, disabled, ripple, plain, circle}"
    @click="onClick()"
    @mouseover="mouseover()"
    @mouseout="mouseout()">
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
import LIcon from "../icon/lin-icon";
export default {
  name: "LinButton",
  components: {
    "l-icon": LIcon
  },
  props: {
    type: {
      type: String,
      default: "default"  // 按键背景色
    },
    plain: { 
      type: Boolean,
      default: false // 线宽按钮
    },
    circle: {
      type: Boolean,
      default: false // 圆形按钮
    },
    disabled: {
      type: Boolean,
      default: false // 禁用按钮
    },
    icon: {
      type: String,
      default: "" // 图标
    },
    loading: {
      type: Boolean,
      default: false // 加载效果
    },
    iconPosition: { // icon位置
      type: String,
      default: "left",
      validator(value) {
        return value === "left" || value === "right";
      }
    }
  },
  data() {
    return {
      ripple: true
    };
  },
  mounted() {
    this.disabled ? (this.ripple = false) : (this.ripple = true);
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return;
      } else {
        this.$emit("click");
      }
    },
    mouseover() {
      if (this.$refs.icon) {
        this.$refs.icon.mouseover();
      }
    },
    mouseout() {
      if (this.$refs.icon) {
        this.$refs.icon.mouseout();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./button.scss";

.l-button {
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

  &:focus {
    outline: none;
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

    &:hover:not(.disabled) {
      background: $button-primary-bg;
      color: #fff;
      border: 1px solid $button-primary-bg;
    }
  }

  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled) {
    background: #0037ad;
    border: 1px solid #0037ad;
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

    &:hover:not(.disabled) {
      background: $button-success-bg;
      color: #fff;
      border: 1px solid $button-success-bg;
    }
  }

  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled) {
    background: #009d72;
    border: 1px solid #009d72;
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

    &:hover:not(.disabled) {
      background: $button-danger-bg;
      color: #fff;
      border: 1px solid $button-danger-bg;
    }
  }
  
  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled) {
    background: #d62f40;
    border: 1px solid #d62f40;
  }
}

.l-button--info {
  background: $button-info-bg;
  color: #fff;
  border: 1px solid $button-info-bg;

  &.plain {
    color: $button-info-plain-color;
    background: #fff;
    border: 1px solid $button-info-plain-color;

    &:hover:not(.disabled) {
      background: $button-info-bg;
      color: #fff;
      border: 1px solid $button-info-bg;
    }
  }

  &.circle {
    border-radius: 50%;
    min-width: $button-height;
  }

  &:hover:not(.disabled) {
    background: #bfcbd7;
    border: 1px solid #bfcbd7;
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
