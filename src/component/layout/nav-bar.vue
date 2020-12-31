<template>
  <div class="app-nav-bar">
    <div class="nav-content">
      <breadcrumb />
      <!-- 暂时放这里 -->
      <div class="right-info">
        <lin-notify
          height="370"
          @readMessages="readMessages"
          :trigger="'click'"
          :messages="messages"
          @readAll="readAll"
          @viewAll="viewAll"
          class="lin-notify"
          :value="value"
          :hidden="hidden"
        >
        </lin-notify>
        <clear-tab></clear-tab>
        <screenfull /> <user></user>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './breadcrumb'
import Screenfull from './screen-full'
import User from './user'
import ClearTab from './clear-tab'
// import { getToken } from '@/lin/util/token'
// import store from '@/store'

export default {
  name: 'NavBar',
  created() {
    // this.$connect(this.path, { format: 'json' })
    // this.$options.sockets.onmessage = data => {
    //   console.log(JSON.parse(data.data))
    //   this.messages.push(JSON.parse(data.data))
    // }
    // this.$options.sockets.onerror = err => {
    //   console.log(err)
    //   this.$message.error('token已过期,请重新登录')
    //   store.dispatch('loginOut')
    //   const { origin } = window.location
    //   window.location.href = origin
    // }
  },
  watch: {
    messages: {
      handler() {
        this.value = this.messages.filter(msg => msg.is_read === false).length
        if (this.value === 0) {
          this.hidden = true
        } else {
          this.hidden = false
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      value: 0,
      hidden: true,
      messages: [],
      // path: `//api.s.colorful3.com/ws/message?token=${getToken('access_token').split(' ')[1]}`,
    }
  },
  methods: {
    readAll() {
      console.log('点击了readAll')
    },
    viewAll() {
      console.log('点击了viewAll')
    },
    readMessages(msg, index) {
      this.messages[index].is_read = true
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
.lin-notify {
  margin-right: 20px;
}
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
