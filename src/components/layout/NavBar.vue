
<template>
  <div class="app-nav-bar">

    <div class="nav-content">
      <breadcrumb />
      <!-- 暂时放这里 -->
      <div class="right-info">
        <notify v-auth="'消息推送'" v-show="false" />
        <screenfull />
        <user></user>
      </div>
    </div>
  </div>
</template>

<script>
import Notify from '@/components/notify/notify'
import Breadcrumb from './Breadcrumb'
import Screenfull from './Screenfull'
import User from './User'

export default {
  name: 'NavBar',
  created() {},
  components: {
    Breadcrumb,
    User,
    Notify,
    Screenfull,
  },
}
</script>

<style lang="scss" scoped>
.app-nav-bar {
  width: 100%;
  height: $navbar-height;
  display: flex;
  align-items: center;
  .logo.js-min-logo {
    width: 64px;
    font-size: 16px;
    color: #fff;
  }
  .nav-content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: $navbar-padding;
    .right-info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
