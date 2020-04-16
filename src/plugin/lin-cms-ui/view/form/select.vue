<template>
  <div class="lin-container">
    <div class="lin-title">Select 选择器</div>
    <div class="lin-wrap-ui">
      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <el-select size="medium" v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>有禁用选项</span></div>
        <el-row>
          <el-select size="medium" v-model="value2" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ disabled }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>可清空单选</span></div>
        <el-row>
          <el-select size="medium" clearable v-model="value3" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ clearable }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>基础多选</span></div>
        <el-row>
          <el-select size="medium" multiple v-model="value4" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ multiple }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>自定义模板</span></div>
        <el-row>
          <el-select v-model="value5" placeholder="请选择">
            <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.value">
              <span style="float: left">{{ item.label }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
            </el-option>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ template }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>分组</span></div>
        <el-row>
          <el-select v-model="value6" placeholder="请选择">
            <el-option-group v-for="group in options3" :key="group.label" :label="group.label">
              <el-option v-for="item in group.options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ group }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>可搜索</span></div>
        <el-row>
          <el-select v-model="value7" filterable placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ filterable }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>创建条目</span></div>
        <el-row>
          <el-select v-model="value8" multiple filterable allow-create default-first-option placeholder="请选择标签">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ create }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LinCmsUiSelect',
  components: {},
  data() {
    return {
      options: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      options2: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
          disabled: true,
        },
        {
          value: '选项3',
          label: '蚵仔煎',
        },
        {
          value: '选项4',
          label: '龙须面',
        },
        {
          value: '选项5',
          label: '北京烤鸭',
        },
      ],
      cities: [
        {
          value: 'Beijing',
          label: '北京',
        },
        {
          value: 'Shanghai',
          label: '上海',
        },
        {
          value: 'Nanjing',
          label: '南京',
        },
        {
          value: 'Chengdu',
          label: '成都',
        },
        {
          value: 'Shenzhen',
          label: '深圳',
        },
        {
          value: 'Guangzhou',
          label: '广州',
        },
      ],
      options3: [
        {
          label: '热门城市',
          options: [
            {
              value: 'Shanghai',
              label: '上海',
            },
            {
              value: 'Beijing',
              label: '北京',
            },
          ],
        },
        {
          label: '城市名',
          options: [
            {
              value: 'Chengdu',
              label: '成都',
            },
            {
              value: 'Shenzhen',
              label: '深圳',
            },
            {
              value: 'Guangzhou',
              label: '广州',
            },
            {
              value: 'Dalian',
              label: '大连',
            },
          ],
        },
      ],
      value: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      value8: '',

      base: `
          <el-select  size="medium"  v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>`,
      disabled: `
          <el-select  size="medium" v-model="value2" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>`,
      clearable: `
          <el-select  size="medium" clearable v-model="value3" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>`,
      multiple: `
          <el-select  size="medium" multiple v-model="value4" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>`,
      template: `
            <el-select v-model="value5" placeholder="请选择">
              <el-option
                v-for="item in cities"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
              </el-option>
            </el-select>`,
      group: `
          <el-select v-model="value6" placeholder="请选择">
            <el-option-group v-for="group in options" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>`,
      filterable: `
          <el-select  size="medium" filterable v-model="value7" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>`,
      create: `
          <el-select
            v-model="value8"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择标签">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>`,
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
