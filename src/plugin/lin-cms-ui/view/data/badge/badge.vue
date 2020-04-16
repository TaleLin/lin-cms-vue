<template>
  <div class="lin-container">
    <div class="lin-title">Badge 标记</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;" class="demo">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <el-badge :value="12" class="item"> <el-button size="small">评论</el-button> </el-badge>
          <el-badge :value="3" class="item"> <el-button size="small">回复</el-button> </el-badge>
          <el-badge :value="1" class="item" type="primary"> <el-button size="small">评论</el-button> </el-badge>
          <el-badge :value="2" class="item" type="warning"> <el-button size="small">回复</el-button> </el-badge>

          <el-dropdown trigger="click">
            <span class="el-dropdown-link"> 点我查看<i class="el-icon-caret-bottom el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item class="clearfix">
                评论
                <el-badge class="mark" :value="12" />
              </el-dropdown-item>
              <el-dropdown-item class="clearfix">
                回复
                <el-badge class="mark" :value="3" />
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>最大值</span></div>
        <el-row>
          <div>
            <el-badge :value="200" :max="99" class="item"> <el-button size="small">评论</el-button> </el-badge>
            <el-badge :value="100" :max="10" class="item"> <el-button size="small">回复</el-button> </el-badge>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ max }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>自定义内容</span></div>
        <el-row>
          <div>
            <el-badge value="new" class="item"> <el-button size="small">评论</el-button> </el-badge>
            <el-badge value="hot" class="item"> <el-button size="small">回复</el-button> </el-badge>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ customize }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>小红点</span></div>
        <el-row>
          <div>
            <el-badge is-dot class="item">数据查询</el-badge>
            <el-badge is-dot class="item">
              <el-button class="share-button" icon="el-icon-share" type="primary"></el-button>
            </el-badge>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ isDot }}</div>
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
      text: '',
      base: `     
        <el-badge :value="12" class="item">
          <el-button size="small">评论</el-button>
        </el-badge>
        <el-badge :value="3" class="item">
          <el-button size="small">回复</el-button>
        </el-badge>
        <el-badge :value="1" class="item" type="primary">
          <el-button size="small">评论</el-button>
        </el-badge>
        <el-badge :value="2" class="item" type="warning">
          <el-button size="small">回复</el-button>
        </el-badge>

        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            点我查看<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="clearfix">
              评论
              <el-badge class="mark" :value="12" />
            </el-dropdown-item>
            <el-dropdown-item class="clearfix">
              回复
              <el-badge class="mark" :value="3" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>`,
      max: `
        <el-badge :value="200" :max="99" class="item">
          <el-button size="small">评论</el-button>
        </el-badge>
        <el-badge :value="100" :max="10" class="item">
          <el-button size="small">回复</el-button>
        </el-badge>`,
      customize: `
        <el-badge value="new" class="item">
          <el-button size="small">评论</el-button>
        </el-badge>
        <el-badge value="hot" class="item">
          <el-button size="small">回复</el-button>
        </el-badge>`,
      isDot: `
        <el-badge is-dot class="item">数据查询</el-badge>
        <el-badge is-dot class="item">
          <el-button class="share-button" icon="el-icon-share" type="primary"></el-button>
        </el-badge>
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
@import '../../../assets/style/container.scss';
.item {
  margin-right: 40px;
}
</style>
