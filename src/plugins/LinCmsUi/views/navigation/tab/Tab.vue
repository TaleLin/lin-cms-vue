<template>
  <div class="lin-container">
    <div class="lin-title">Tabs 标签页</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>选项卡样式</span></div>
        <el-row>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ tabs }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>卡片化</span></div>
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="用户管理">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ card }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>位置</span></div>
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
          <el-radio-button label="top">top</el-radio-button>
          <el-radio-button label="right">right</el-radio-button>
          <el-radio-button label="bottom">bottom</el-radio-button>
          <el-radio-button label="left">left</el-radio-button>
        </el-radio-group>

        <el-tabs :tab-position="tabPosition" style="height: 200px;">
          <el-tab-pane label="用户管理">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ position }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>自定义</span></div>
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"> <i class="el-icon-date"></i> 我的行程 </span> 我的行程
          </el-tab-pane>
          <el-tab-pane label="消息中心">消息中心</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ define }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'second',
      tabPosition: 'left',
      base: `     
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>`,
      tabs: `
           <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>`,
      card: `
          <el-tabs type="border-card">
            <el-tab-pane label="用户管理">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>`,
      position: `
          <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
            <el-radio-button label="top">top</el-radio-button>
            <el-radio-button label="right">right</el-radio-button>
            <el-radio-button label="bottom">bottom</el-radio-button>
            <el-radio-button label="left">left</el-radio-button>
          </el-radio-group>

          <el-tabs :tab-position="tabPosition" style="height: 200px;">
            <el-tab-pane label="用户管理">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>`,
      define: `
          <el-tabs type="border-card">
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 我的行程</span>
              我的行程
            </el-tab-pane>
            <el-tab-pane label="消息中心">消息中心</el-tab-pane>
            <el-tab-pane label="角色管理">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
          </el-tabs>
      `,
    }
  },
  components: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/style/container.scss';
</style>
