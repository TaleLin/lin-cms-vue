<template>
  <div class="wrap">
    <button class="lin-button"
            :class="buttonType">
      <i :class="['iconfont', icon]"></i>
      {{text}}
    </button>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    text: {
      type: String,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      buttonType: '',
    }
  },
  components: {

  },
  created() {
    this.buttonType = `lin-button-${this.type}`
  },
}
</script>

<style scoped lang="scss">
@import '~assets/styles/variable.scss';
.wrap {
  display: inline-block;
  .lin-button {
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 400;
    height: 24px;
    font-size: 12px;
    color: #606266;
    border: 1px solid;
    margin-right: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 2px;
    cursor: pointer;
  }
  .lin-button-edit {
    background: $button-background;
    color: $theme;
    &:hover {
      color: #ffffff;
      background: $theme;
      border:1px solid $theme;
    }
  }
  .lin-button-del {
    background: #fff5f6;
    color: #f4516c;
    &:hover {
      color: #ffffff;
      background: #f4516c;
      border:1px solid #f4516c;
    }
  }
}
</style>
