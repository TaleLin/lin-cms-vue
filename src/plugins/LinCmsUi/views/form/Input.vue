<template>
  <div class="lin-container">
    <div class="lin-title">Input 输入框</div>
    <div class="lin-wrap-ui">
      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <el-col :span="12"> <el-input placeholder="请输入内容" size="medium" v-model="input1"></el-input> </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>禁用状态</span></div>
        <el-row>
          <el-col :span="12"> <el-input placeholder="禁止输入" size="medium" disabled></el-input> </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ disabled }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>带icon的输入框</span></div>
        <el-row>
          <el-col :span="12">
            <el-input placeholder="请输入内容" size="medium" suffix-icon="el-icon-edit" v-model="input2"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px">
          <el-col :span="12">
            <el-input placeholder="请输入内容" size="medium" prefix-icon="el-icon-search" v-model="input3"></el-input>
          </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ icon }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>复合型输入框</span></div>
        <el-row>
          <el-col :span="12">
            <el-input placeholder="请输入内容" size="medium" v-model="input4">
              <template slot="prepend"
                >Http://</template
              >
            </el-input>
          </el-col>
        </el-row>
        <el-row style="margin-top:20px;margin-bottom:20px;">
          <el-col :span="12">
            <el-input placeholder="请输入内容" size="medium" v-model="input5">
              <template slot="append"
                >.com</template
              >
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-col :span="12">
              <el-input v-model="input" placeholder="请输入内容" size="medium" class="input-with-select">
                <el-select v-model="select" slot="prepend" placeholder="请选择">
                  <el-option label="餐厅名" value="1"></el-option>
                  <el-option label="订单号" value="2"></el-option>
                  <el-option label="用户电话" value="3"></el-option>
                </el-select>
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-col>
          </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ complex }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>尺寸</span></div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input6"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input size="medium" placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input7"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input size="small" placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input8"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input size="mini" placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input9"></el-input>
          </el-col>
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
      input: '',
      input1: '',
      input2: '',
      input3: '',
      input4: '',
      input5: '',
      input6: '',
      input7: '',
      input8: '',
      input9: '',
      select: '',
      base: `
        <el-input placeholder="请输入内容" size="medium" v-model="input"></el-input>`,
      disabled: `
        <el-input placeholder="禁止输入" size="medium" disabled></el-input>`,
      icon: `
        <el-input placeholder="请选择日期" size="medium" suffix-icon="el-icon-date" v-model="input"></el-input>
        <el-input placeholder="请输入内容" size="medium" prefix-icon="el-icon-search" v-model="input"></el-input>`,
      complex: `
        <el-input placeholder="请输入内容" size="medium" v-model="input">
            <template slot="prepend">Http://</template>
        </el-input>
       
        <el-input placeholder="请输入内容" size="medium" v-model="input">
            <template slot="append">.com</template>
        </el-input>
        
        <el-input placeholder="请输入内容" size="medium" class="input-with-select" v-model="input">
            <el-select size="medium" slot="prepend" placeholder="请选择">
                <el-option label="餐厅名" value="1"></el-option>
                <el-option label="订单号" value="2"></el-option>
                <el-option label="用户电话" value="3"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        
        .input-with-select .el-input-group__prepend {
            background-color: #fff;
            width: 100px;
            border-top: 1px solid #dcdfe6;
            border-left: 1px solid #dcdfe6;
            border-bottom: 1px solid #dcdfe6;
            border-right: none;
        }`,
      size: `
        <el-input placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input"></el-input>
        <el-input size="medium" placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input"></el-input>
        <el-input size="small" placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input"></el-input>
        <el-input size="mini" placeholder="请输入内容" suffix-icon="el-icon-date" v-model="input"></el-input>`,
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
@import '../../assets/style/container.scss';

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
  width: 100px;
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  border-right: none;
}
</style>
