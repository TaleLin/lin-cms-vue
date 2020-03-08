<template>
  <div class="app-nav-bar">
    <div class="nav-content">
      <breadcrumb />
      <!-- 暂时放这里 -->
      <div class="right-info">
        <lin-notify @readMessages="readMessages" :messages="messages" :props="props"> </lin-notify>
        <clear-tab></clear-tab>
        <screenfull /> <user></user>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'
import Screenfull from './Screenfull'
import User from './User'
import ClearTab from './ClearTab'
import { getToken } from '@/lin/utils/token'

export default {
  name: 'NavBar',
  created() {
    this.$connect(this.path, { format: 'json' })
    this.$options.sockets.onmessage = data => {
      console.log(JSON.parse(data.data))
      this.messages.push(JSON.parse(data.data))
    }
  },
  data() {
    return {
      props: {
        id: 'key',
        content: 'detail',
        readed: 'readed',
        time: 'time',
        user: 'user',
      },
      messages: [
        { id: 1, detail: '哈哈哈家乐', readed: false, time: '08-16 13:22:07', user: '流乔' },
        { id: 2, detail: '新收款2459元', readed: true, time: '08-16 13:22:07', user: '流乔' },
        { id: 3, detail: '您的套餐普洱森泉天然水已售完', readed: true, time: '08-16 13:22:07', user: '流乔' },
      ],
      path: `//api.s.colorful3.com/ws/message?token=${getToken('access_token').split(' ')[1]}`,
    }
  },
  methods: {
    readMessages(msg) {
      console.log(msg)
    },
  },
  components: {
    Breadcrumb,
    User,
    Screenfull,
    ClearTab,
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
