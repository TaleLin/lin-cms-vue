<template>
  <div class="container">
    <div class="num-box">
      <div class="num"><i class="iconfont icon-clock"></i>&nbsp; <span class="label">时长</span> {{ time }}</div>
      <div class="num">
        <i class="iconfont icon-huiyuan"></i>&nbsp; <span class="label">学习人数</span> {{ people }}
      </div>
    </div>
    <a :href="link" target="_blank">
      <div class="link">
        <i class="iconfont icon-xiangyoujiantou"></i>
      </div>
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    time: {
      type: String,
      default: '18小时20分钟',
    },
    people: {
      type: String,
      default: '1821',
    },
    link: {
      type: String,
      default: 'https://www.imooc.com/t/4294850',
    },
  },

}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 32px;
  display: flex;
  justify-content: space-between;
  .num-box {
    display: flex;
    justify-content: flex-start;
    .num {
      padding: 0 10px;
      height: 32px;
      background: rgba(243, 246, 255, 1);
      border-radius: 6px;
      color: #3963bc;
      line-height: 32px;
      font-size: 12px;
      margin-right: 10px;
      i {
        height: 12px;
        width: 12px;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
  .link {
    cursor: pointer;
    width: 70px;
    height: 32px;
    background: rgba(57, 99, 188, 1);
    box-shadow: 0px 2px 8px 0px rgba(80, 100, 142, 0.5);
    border-radius: 57px 0px 0px 57px;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-weight: bold;
      color: #ffffff;
    }
  }
}
</style>
