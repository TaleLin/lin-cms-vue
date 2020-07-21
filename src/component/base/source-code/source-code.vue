<template>
  <div class="wrapper" @click="showSourceCode">
    <i class="iconfont icon-daima1" style="font-size: 12px;margin-right:3px"></i>本页源码
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    link: {
      type: String,
      default: 'https://github.com/TaleLin/lin-cms-vue',
    },
  },
  methods: {
    showSourceCode() {
      window.open(this.link)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  user-select: none;
  cursor: pointer;
  opacity: 1;
  position: fixed;
  z-index: 9999;
  right: -11.5px;
  bottom: 145px;
  font-size: 12px;
  line-height: 12px;
  font-weight: 700;
  border-radius: 4px;
  padding: 7px 15px;
  padding-right: 19px;
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #000;
  color: #fff;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  &:hover {
    right: -4px;
    background-color: rgba(0, 0, 0, 0.9);
  }
}
</style>
