<template>
  <div>
    <!-- 列表页面 -->
    <div class="container" >
      <div class="header">
        <div class="title">单例超出隐藏</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {

    }
  },
  components: {

  },
}
</script>

<style scoped lang="scss">
@import "~assets/styles/variable.scss";
.container {
  padding: 0 30px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
    }
  }
}
</style>
