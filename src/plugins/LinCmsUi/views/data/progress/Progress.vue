<template>
  <div class="lin-container">
    <div class="lin-title">Progress 进度条</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>线形进度条 — 百分比外显</span></div>
        <el-row>
          <div>
            <el-progress :percentage="0"></el-progress>
            <el-progress :percentage="70"></el-progress>
            <el-progress :percentage="80" color="#8e71c7"></el-progress>
            <el-progress :percentage="100" status="success"></el-progress>
            <el-progress :percentage="50" status="exception"></el-progress>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>线形进度条 — 百分比内显</span></div>
        <el-row>
          <div>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="0"></el-progress>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
            <el-progress
              :text-inside="true"
              :stroke-width="18"
              :percentage="80"
              color="rgba(142, 113, 199, 0.7)"
            ></el-progress>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success"></el-progress>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="50" status="exception"></el-progress>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ textInside }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>环形进度条</span></div>
        <el-row>
          <div>
            <el-progress type="circle" :percentage="0"></el-progress>
            <el-progress type="circle" :percentage="25"></el-progress>
            <el-progress type="circle" :percentage="80" color="#8e71c7"></el-progress>
            <el-progress type="circle" :percentage="100" status="success"></el-progress>
            <el-progress type="circle" :percentage="50" status="exception"></el-progress>
            <el-progress type="circle" :percentage="100" status="text">Done</el-progress>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ type }}</div>
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
      <el-progress :percentage="0"></el-progress>
      <el-progress :percentage="70"></el-progress>
      <el-progress :percentage="80" color="#8e71c7"></el-progress>
      <el-progress :percentage="100" status="success"></el-progress>
      <el-progress :percentage="50" status="exception"></el-progress>`,
      textInside: `
      <el-progress :text-inside="true" :stroke-width="18" :percentage="0"></el-progress>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="80" color="rgba(142, 113, 199, 0.7)"></el-progress>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="100" status="success"></el-progress>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="50" status="exception"></el-progress>`,
      type: `
      <el-progress type="circle" :percentage="0"></el-progress>
      <el-progress type="circle" :percentage="25"></el-progress>
      <el-progress type="circle" :percentage="80" color="#8e71c7"></el-progress>
      <el-progress type="circle" :percentage="100" status="success"></el-progress>
      <el-progress type="circle" :percentage="50" status="exception"></el-progress>
      <el-progress type="circle" :percentage="100" status="text">Done</el-progress>`,
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
.el-progress {
  margin-top: 20px;
  margin-left: 20px;
}
</style>
