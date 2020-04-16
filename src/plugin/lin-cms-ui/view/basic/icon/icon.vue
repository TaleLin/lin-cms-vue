<template>
  <div class="lin-container">
    <div class="lin-title">Icon 图标</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>方向性图标</span></div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="4" v-for="item in iconList1" :key="item" style="margin-bottom:20px;text-align:center;">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color:#2f4e8c;margin-top:5px;">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>提示建议性图标</span></div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="4" v-for="item in iconList2" :key="item" style="margin-bottom:20px;text-align:center;">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color:#2f4e8c;margin-top:5px;">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>编辑类图标</span></div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="4" v-for="item in iconList3" :key="item" style="margin-bottom:20px;text-align:center;">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color:#2f4e8c;margin-top:5px;">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>网站通用图标</span></div>
        <el-row style="margin-bottom:10px;">
          <el-col :span="4" v-for="item in iconList4" :key="item" style="margin-bottom:20px;text-align:center;">
            <l-icon :name="item" :color="color" :width="width" :height="height"></l-icon>
            <div style="color:#2f4e8c;margin-top:5px;">{{ item }}</div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <source-code
      :link="`http://doc.cms.7yue.pro/lin/client/component/icon.html#%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95`"
    ></source-code>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  data() {
    return {
      color: '#3963bc',
      width: '30px',
      height: '30px',
      iconList1: [
        'step-backward',
        'step-forward',
        'fast-backward',
        'fast-forward',
        'shrink',
        'arrawsalt',
        'down',
        'up',
        'left',
        'right',
        'caret-up',
        'caret-down',
        'caret-left',
        'caret-right',
        'up-circle',
        'down-circle',
        'left-circle',
        'right-circle',
      ],
      iconList2: [
        'question',
        'question-circle',
        'plus',
        'plus-circle',
        'minus',
        'minus-circle',
        'plus-square',
        'minus-square',
        'info-circle',
        'close',
        'close-circle',
        'close-square',
      ],
      iconList3: [
        'edit',
        'ellipsis',
        'file',
        'file-text',
        'file-unknown',
        'file-pdf',
        'file-word',
        'file-excel',
        'file-ppt',
        'file-markdown',
        'file-add',
        'folder',
        'folder-open',
        'folder-add',
        'frown',
        'meh',
        'smile',
      ],
      iconList4: [
        'shake',
        'api',
        'fork',
        'dashboard',
        'table',
        'android',
        'apple',
        'windows',
        'chrome',
        'aliwangwang',
        'weibo',
        'twitter',
        'taobao',
        'skype',
        'medium',
        'linkedin',
        'dropbox',
        'facebook',
        'codepen',
        'amazon',
        'google',
        'alipay',
        'zhihu',
        'slack',
        'behance',
      ],
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
