<template>
  <div class="lin-container">
    <div class="lin-title">Breadcrumb 面包屑</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header">
          <span>基础用法</span>
        </div>
        <el-row>
          <div>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{base}}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
       <el-card style="margin-bottom:50px;">
        <div slot="header">
          <span>图标分隔符</span>
        </div>
        <el-row>
          <div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>活动管理</el-breadcrumb-item>
              <el-breadcrumb-item>活动列表</el-breadcrumb-item>
              <el-breadcrumb-item>活动详情</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{separatorClass}}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      base: `     
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>`,
      separatorClass: `
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
          <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb`,
    }
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    // 执行获取数据等初始化动作
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/container';
.el-link+.el-link {
  margin-left: 30px;
}
</style>
