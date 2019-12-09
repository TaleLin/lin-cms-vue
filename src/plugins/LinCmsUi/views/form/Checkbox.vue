<template>
  <div class="lin-container">
    <div class="lin-title">Radio 单选框</div>
    <div class="lin-wrap-ui">
      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <el-col :span="12"> <el-checkbox v-model="checked">备选项</el-checkbox> </el-col>
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
          <el-col :span="12">
            <el-checkbox v-model="checked1" disabled>备选项1</el-checkbox>
            <el-checkbox v-model="checked2" disabled>备选项</el-checkbox>
          </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ disabled }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>多选框组</span></div>
        <el-row>
          <el-col>
            <el-checkbox-group v-model="checkList1">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="禁用" disabled></el-checkbox>
              <el-checkbox label="选中且禁用" disabled></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ group }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>按钮样式</span></div>
        <el-row>
          <el-col :span="12">
            <div>
              <el-checkbox-group v-model="checkboxGroup1">
                <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox-group v-model="checkboxGroup2" size="medium">
                <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox-group v-model="checkboxGroup3" size="small">
                <el-checkbox-button v-for="city in cities" :label="city" :disabled="city === '北京'" :key="city">{{
                  city
                }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox-group v-model="checkboxGroup4" size="mini" disabled>
                <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox-button>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>

        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ button }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>尺寸</span></div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-checkbox v-model="checked1" label="备选项1" border></el-checkbox>
              <el-checkbox v-model="checked2" label="备选项2" border></el-checkbox>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox v-model="checked3" label="备选项1" border size="medium"></el-checkbox>
              <el-checkbox v-model="checked4" label="备选项2" border size="medium"></el-checkbox>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox-group v-model="checkboxGroup5" size="small">
                <el-checkbox label="备选项1" border></el-checkbox>
                <el-checkbox label="备选项2" border disabled></el-checkbox>
              </el-checkbox-group>
            </div>
            <div style="margin-top: 20px">
              <el-checkbox-group v-model="checkboxGroup6" size="mini" disabled>
                <el-checkbox label="备选项1" border></el-checkbox>
                <el-checkbox label="备选项2" border></el-checkbox>
              </el-checkbox-group>
            </div>
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
const cityOptions = ['上海', '北京', '广州', '深圳']
export default {
  name: '',
  components: {},
  data() {
    return {
      text: '',
      checked: true,
      checked1: true,
      checked2: false,
      checkList1: ['选中且禁用', '复选框 A'],
      checkboxGroup1: ['上海'],
      checkboxGroup2: ['上海'],
      checkboxGroup3: ['上海'],
      checkboxGroup4: ['上海'],
      cities: cityOptions,
      checked3: false,
      checked4: true,
      checkboxGroup5: [],
      checkboxGroup6: [],
      base: `
          <el-checkbox v-model="checked">备选项</el-checkbox>`,
      disabled: `
          <el-checkbox v-model="checked1" disabled>备选项1</el-checkbox>
          <el-checkbox v-model="checked2" disabled>备选项</el-checkbox>`,
      group: `
          <el-checkbox-group v-model="checkList1">
              <el-checkbox label="复选框 A"></el-checkbox>
              <el-checkbox label="复选框 B"></el-checkbox>
              <el-checkbox label="复选框 C"></el-checkbox>
              <el-checkbox label="禁用" disabled></el-checkbox>
              <el-checkbox label="选中且禁用" disabled></el-checkbox>
          </el-checkbox-group>`,
      button: `
          <el-checkbox-group v-model="checkboxGroup1">
              <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
          </el-checkbox-group>

          <el-checkbox-group v-model="checkboxGroup2" size="medium">
              <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
          </el-checkbox-group>

          <el-checkbox-group v-model="checkboxGroup3" size="small">
              <el-checkbox-button
                  v-for="city in cities"
                  :label="city"
                  :disabled="city === '北京'"
                  :key="city">{{city}}
              </el-checkbox-button>
          </el-checkbox-group>

          <el-checkbox-group v-model="checkboxGroup4" size="mini" disabled>
              <el-checkbox-button v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox-button>
          </el-checkbox-group>`,
      size: `
          <el-checkbox v-model="checked1" label="备选项1" border></el-checkbox>
          <el-checkbox v-model="checked2" label="备选项2" border></el-checkbox>
  
          <el-checkbox v-model="checked3" label="备选项1" border size="medium"></el-checkbox>
          <el-checkbox v-model="checked4" label="备选项2" border size="medium"></el-checkbox>

          <el-checkbox-group v-model="checkboxGroup5" size="small">
          <el-checkbox label="备选项1" border></el-checkbox>
          <el-checkbox label="备选项2" border disabled></el-checkbox>
          </el-checkbox-group>

          <el-checkbox-group v-model="checkboxGroup6" size="mini" disabled>
            <el-checkbox label="备选项1" border></el-checkbox>
            <el-checkbox label="备选项2" border></el-checkbox>
          </el-checkbox-group>`,
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
</style>
