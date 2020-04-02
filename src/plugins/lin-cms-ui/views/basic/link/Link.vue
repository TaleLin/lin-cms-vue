<template>
  <div class="lin-container">
    <div class="lin-title">Link 文字链接</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <div>
            <el-link href="http://face.cms.7yue.pro/#/login" target="_blank">默认链接</el-link>
            <el-link type="primary">主要链接</el-link>
            <el-link type="success">成功链接</el-link>
            <el-link type="warning">警告链接</el-link>
            <el-link type="danger">危险链接</el-link>
            <el-link type="info">信息链接</el-link>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>禁用状态</span></div>
        <el-row>
          <div>
            <el-link disabled>默认链接</el-link>
            <el-link type="primary" disabled>主要链接</el-link>
            <el-link type="success" disabled>成功链接</el-link>
            <el-link type="warning" disabled>警告链接</el-link>
            <el-link type="danger" disabled>危险链接</el-link>
            <el-link type="info" disabled>信息链接</el-link>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ disabled }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>下划线</span></div>
        <el-row>
          <div>
            <el-link :underline="false">无下划线</el-link>
            <el-link>有下划线</el-link>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ underline }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>图标</span></div>
        <el-row>
          <div>
            <el-link icon="el-icon-share">分享</el-link>
            <el-link>添加<i class="el-icon-circle-plus-outline el-icon--right"></i></el-link>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ icon }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinCmsUiButton',
  components: {},
  data() {
    return {
      base: `     
          <el-link>默认链接</el-link>
          <el-link type="primary" disabled>主要链接</el-link>
          <el-link type="success" disabled>成功链接</el-link>
          <el-link type="warning" disabled>警告链接</el-link>
          <el-link type="danger" disabled>危险链接</el-link>
          <el-link type="info" disabled>信息链接</el-link>`,
      disabled: `
       <el-link disabled>默认链接</el-link>
       <el-link type="primary" disabled>主要链接</el-link>
       <el-link type="success" disabled>成功链接</el-link>
       <el-link type="warning" disabled>警告链接</el-link>
       <el-link type="danger" disabled>危险链接</el-link>
       <el-link type="info" disabled>信息链接</el-link>`,
      underline: `
           <el-link :underline="false">无下划线</el-link>
           <el-link>有下划线</el-link>`,
      icon: `
            <el-link icon="el-icon-share">分享</el-link>
            <el-link>添加<i class="el-icon-circle-plus-outline el-icon--right"></i></el-link>
            `,
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
@import '../../../assets/style/container';
.el-link + .el-link {
  margin-left: 30px;
}
</style>
