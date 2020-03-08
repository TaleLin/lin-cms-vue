<template>
  <el-dropdown>
    <div class="notify">
      <el-badge :value="value" class="item" :hidden="hidden" :max="max" :is-dot="isDot">
        <i :class="icon"></i>
      </el-badge>
    </div>
    <el-dropdown-menu slot="dropdown" style="position:relative;">
      <div class="notify-title">
        <p>消息提醒</p>
        <p class="button" @click="readAll">全部已读</p>
      </div>
      <el-dropdown-item v-for="(msg, index) in messages" :key="index" @click.native="readMessages(msg, index)">
        <slot :row="msg">
          <p :class="msg[props.is_read] ? 'read-messages' : 'unread-messages'">{{ msg[props.content] }}</p>
          <div class="sketchynformation">
            <p class="user">{{ msg[props.user] }}</p>
            <p class="date-time">{{ msg[props.time] }}</p>
          </div>
        </slot>
      </el-dropdown-item>
      <p class="nomessages" v-if="messages.length === 0">暂无新消息</p>
      <div class="notify-footer">
        <p class="viewAll" @click="viewAll">查看全部 &gt;</p>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    max: {
      type: Number,
    },
    isDot: Boolean,
    hidden: {
      type: Boolean,
    },
    value: {
      type: [String, Number],
    },
    icon: {
      type: String,
      default: 'el-icon-bell',
    },
    props: {
      default() {
        return {
          user: 'user',
          is_read: 'is_read',
          content: 'content',
          time: 'time',
        }
      },
    },
    messages: {
      type: Array,
      default() {
        return []
      },
    },
    // unreadMessages: {
    //   type: Array,
    //   default: () => []
    // },
    // readedMessages: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {}
  },
  methods: {
    readMessages(msg, index) {
      this.$emit('readMessages', msg, index)
    },
    readAll() {
      this.$emit('readAll')
    },
    viewAll() {
      this.$emit('viewAll')
    },
  },
}
</script>

<style lang="scss" scoped>
.notify {
  font-size: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
}
.nomessages {
  padding: 20px 0px;
  text-align: center;
}
.sketchynformation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}
.unread-messages {
  position: relative;
  &:before {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    top: 50%;
    left: -15px;
    transform: translateY(-50%);
    background: #f4516c;
  }
}
.read-messages {
  position: relative;

  &:before {
    content: '';
    position: absolute;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    top: 50%;
    left: -15px;
    transform: translateY(-50%);
    background: #ebedf2;
  }
}

.notify-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #45526b;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 8px;
  height: 50px;
  font-weight: 500;
  min-width: 386px;
  border-bottom: 1px solid #dee2e6;

  .button {
    font-size: 12px;
    border: 1px solid #596c8e;
    border-radius: 2px;
    cursor: pointer;
    height: 20px;
    line-height: 20px;
    padding-left: 5px;
    padding-right: 5px;
  }
}
.notify-footer {
  padding: 19px 0px;
  border-top: solid 1px #dee2e6;
  .viewAll {
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    font-size: #45526b;
  }
}
.el-dropdown-menu__item {
  padding: 0 35px;
}
</style>
