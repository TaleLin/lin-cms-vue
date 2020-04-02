<template>
  <div class="lin-container">
    <div class="lin-title">Button 按钮</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>基础按钮</span></div>
        <el-row>
          <el-button>默认按钮</el-button>
          <el-button type="primary">主要按钮</el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ primary }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>朴素按钮</span></div>
        <el-row>
          <el-button plain>朴素按钮</el-button>
          <el-button type="primary" plain>主要按钮</el-button>
          <el-button type="success" plain>成功按钮</el-button>
          <el-button type="warning" plain>警告按钮</el-button>
          <el-button type="danger" plain>危险按钮</el-button>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ plain }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>圆形按钮</span></div>
        <el-row>
          <el-button icon="el-icon-search" circle></el-button>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="success" icon="el-icon-check" circle></el-button>
          <el-button type="warning" icon="el-icon-star-off" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
          <el-button icon="el-icon-search" plain circle></el-button>
          <el-button type="primary" icon="el-icon-edit" plain circle></el-button>
          <el-button type="success" icon="el-icon-check" plain circle></el-button>
          <el-button type="warning" icon="el-icon-star-off" plain circle></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle></el-button>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ circle }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>禁用状态</span></div>
        <el-row style="margin-bottom:10px;">
          <el-button disabled>默认按钮</el-button>
          <el-button type="primary" disabled>主要按钮</el-button>
          <el-button type="success" disabled>成功按钮</el-button>
          <el-button type="warning" disabled>警告按钮</el-button>
          <el-button type="danger" disabled>危险按钮</el-button>
        </el-row>

        <el-row>
          <el-button plain disabled>朴素按钮</el-button>
          <el-button type="primary" plain disabled>主要按钮</el-button>
          <el-button type="success" plain disabled>成功按钮</el-button>
          <el-button type="warning" plain disabled>警告按钮</el-button>
          <el-button type="danger" plain disabled>危险按钮</el-button>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ disabled }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>图标按钮</span></div>
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button type="primary"> 上传 <i class="el-icon-upload el-icon--right"></i> </el-button>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ icon }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>加载中</span></div>
        <el-button type="primary" :loading="true">加载中</el-button>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ loade }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>按钮组</span></div>
        <el-button-group style="margin-right:10px;">
          <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
          <el-button type="primary"> 下一页 <i class="el-icon-arrow-right el-icon--right"></i> </el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="primary" icon="el-icon-edit"></el-button>
          <el-button type="primary" icon="el-icon-share"></el-button>
          <el-button type="primary" icon="el-icon-delete"></el-button>
        </el-button-group>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ group }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>不同尺寸</span></div>
        <el-row>
          <el-button>默认按钮</el-button>
          <el-button size="medium">中等按钮</el-button>
          <el-button size="small">小型按钮</el-button>
          <el-button size="mini">超小按钮</el-button>
        </el-row>
        <el-row style="margin-top:10px;">
          <el-button round>默认按钮</el-button>
          <el-button size="medium" round>中等按钮</el-button>
          <el-button size="small" round>小型按钮</el-button>
          <el-button size="mini" round>超小按钮</el-button>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ size }}</div>
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
      text: '',
      primary: `     
          <el-button>默认按钮</el-button>
          <el-button type="primary">主要按钮</el-button>
          <el-button type="success">成功按钮</el-button>
          <el-button type="warning">警告按钮</el-button>
          <el-button type="danger">危险按钮</el-button>`,
      plain: `
          <el-button plain disabled>朴素按钮</el-button>
          <el-button type="primary" plain disabled>主要按钮</el-button>
          <el-button type="success" plain disabled>成功按钮</el-button>
          <el-button type="warning" plain disabled>警告按钮</el-button>
          <el-button type="danger" plain disabled>危险按钮</el-button>`,
      circle: `
          <el-button icon="el-icon-search" circle></el-button>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="success" icon="el-icon-check" circle></el-button>
          <el-button type="warning" icon="el-icon-star-off" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
          
          <el-button icon="el-icon-search" plain circle></el-button>
          <el-button type="primary" icon="el-icon-edit" plain circle></el-button>
          <el-button type="success" icon="el-icon-check" plain circle></el-button>
          <el-button type="warning" icon="el-icon-star-off" plain circle></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle></el-button>`,
      disabled: `
          <el-button disabled>默认按钮</el-button>
          <el-button type="primary" disabled>主要按钮</el-button>
          <el-button type="success" disabled>成功按钮</el-button>
          <el-button type="warning" disabled>警告按钮</el-button>
          <el-button type="danger" disabled>危险按钮</el-button>

          <el-button plain disabled>朴素按钮</el-button>
          <el-button type="primary" plain disabled>主要按钮</el-button>
          <el-button type="success" plain disabled>成功按钮</el-button>
          <el-button type="warning" plain disabled>警告按钮</el-button>
          <el-button type="danger" plain disabled>危险按钮</el-button>`,
      icon: `
         <el-button type="primary" icon="el-icon-edit"></el-button>
         <el-button type="primary" icon="el-icon-share"></el-button>
         <el-button type="primary" icon="el-icon-delete"></el-button>
         <el-button type="primary" icon="el-icon-search">搜索</el-button>
         <el-button type="primary"> 上传  <i class="el-icon-upload el-icon--right"></i> </el-button>`,
      loade: `
          <el-button type="primary" :loading="true">加载中</el-button>`,
      group: `
        <el-button-group">
          <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
          <el-button type="primary"> 下一页 <i class="el-icon-arrow-right el-icon--right"></i></el-button>
        </el-button-group>

        <el-button-group>
          <el-button type="primary" icon="el-icon-edit"></el-button>
          <el-button type="primary" icon="el-icon-share"></el-button>
          <el-button type="primary" icon="el-icon-delete"></el-button>
        </el-button-group>`,
      size: `
        <el-button>默认按钮</el-button>
        <el-button size="medium">中等按钮</el-button>
        <el-button size="small">小型按钮</el-button>
        <el-button size="mini">超小按钮</el-button>

        <el-button round>默认按钮</el-button>
        <el-button size="medium" round>中等按钮</el-button>
        <el-button size="small" round>小型按钮</el-button>
        <el-button size="mini" round>超小按钮</el-button>`,
    }
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  mounted() {
    this.init()
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
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/style/container';
</style>
