---
icon: iconfont icon-demo
name: Testindex
route: /test/SubView/index
order: null
inSideNav: true
title: 测试
permission: []
needLogin: true
---

<template>
  <div class="lin-container" v-loading="loading">
    <div class="lin-title">插件Test舞台页面</div>
    <lin-1px></lin-1px>
    <div class="lin-wrap">
      <p>{{text}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestSubView',
  components: {},
  data() {
    return {
      loading: true,
      text: '',
    }
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  mounted() {
    this.init()
  },
  // 当tab被激活时触发
  activited() {
  },
  // 当页面使用路由参数时, 参数部分变化触发的动作在本函数中操作
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.htmll#组件内的守卫
  // beforeRouteUpdate(to, from, next) {
  //   // this.name = to.params.name
  //   // this.init()
  //   // next()
  // },
  methods: {
    // 执行获取数据等初始化动作
    init() {
      this.loading = true
      setTimeout(() => {
        this.text = '三级舞台 TestSubView 初始化完成'
        this.loading = false
      }, 3000)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
