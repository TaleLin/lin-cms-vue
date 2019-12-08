<template>
  <div title="关闭全部历史记录" class="tab" @click="closeReuseTab"><i class="iconfont icon-moshubang"></i></div>
</template>

<script>
export default {
  name: 'CloseTab',
  inject: ['eventBus'],
  methods: {
    closeReuseTab() {
      this.eventBus.$emit('clearTap')
    },
  },
}
</script>

<style lang="scss" scoped>
.tab {
  cursor: pointer;
  margin-right: 10px;
  i {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>
