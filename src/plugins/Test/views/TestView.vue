---
icon: iconfont icon-demo
name: TestTestView
route: /test/TestView
order: null
inSideNav: true
title: 阿斯达
permission: []
needLogin: true
---


<template>
  <div class="lin-container">
    <div class="lin-title">插件Test舞台页面</div>
    <lin-1px></lin-1px>
    <div class="lin-wrap">
      <test />
    </div>
  </div>
</template>

<script>
import Test from '../components/Test'

export default {
  name: 'TestTestView',
  components: {
    Test,
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},
  // 当页面使用路由参数时, 参数部分变化触发的动作在本函数中操作
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.htmll#组件内的守卫
  // beforeRouteUpdate(to, from, next) {
  //   // this.name = to.params.name
  //   // this.init()
  //   // next()
  // },
  methods: {},
}
</script>

<style scoped lang="scss">
</style>
