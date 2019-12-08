<template>
  <div class="lin-container">
    <div class="lin-title">Slider 滑块</div>
    <div class="lin-wrap-ui">
      <el-card class="box-card base-box-card" style="margin-bottom:50px;">
        <div slot="header"><span>基础用法</span></div>
        <el-row>
          <template>
            <div class="block demo-block">
              <span class="demonstration">默认</span>
              <el-slider v-model="value1"></el-slider>
            </div>
            <div class="block demo-block">
              <span class="demonstration">自定义初始值</span>
              <el-slider v-model="value2"></el-slider>
            </div>
            <div class="block demo-block">
              <span class="demonstration">隐藏 Tooltip</span>
              <el-slider v-model="value3" :show-tooltip="false"></el-slider>
            </div>
            <div class="block demo-block">
              <span class="demonstration">格式化 Tooltip</span>
              <el-slider v-model="value4" :format-tooltip="formatTooltip"></el-slider>
            </div>
            <div class="block demo-block">
              <span class="demonstration">禁用</span>
              <el-slider v-model="value5" disabled></el-slider>
            </div>
          </template>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>离散值</span></div>
        <el-row>
          <template>
            <div class="block demo-block">
              <span class="demonstration">不显示间断点</span>
              <el-slider v-model="value6" :step="10"> </el-slider>
            </div>
            <div class="block demo-block">
              <span class="demonstration">显示间断点</span>
              <el-slider v-model="value7" :step="10" show-stops> </el-slider>
            </div>
          </template>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ showStops }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>带有输入框</span></div>
        <el-row>
          <template>
            <div class="block"><el-slider v-model="value8" show-input> </el-slider></div>
          </template>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ showInput }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>范围选择</span></div>
        <el-row>
          <template>
            <div class="block"><el-slider v-model="value9" range show-stops :max="10"> </el-slider></div>
          </template>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ range }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>竖向模式</span></div>
        <el-row>
          <template>
            <div class="block"><el-slider v-model="value10" vertical height="200px"> </el-slider></div>
          </template>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ vertical }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card class="box-card" style="margin-bottom:50px;">
        <div slot="header"><span>展示标记</span></div>
        <el-row>
          <template>
            <div class="block"><el-slider v-model="value11" range :marks="marks"> </el-slider></div>
          </template>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ marksCode }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: '',
  components: {},
  data() {
    return {
      marksCode: `
<template>
  <div class="block">
    <el-slider
      v-model="value"
      range
      :marks="marks">
    </el-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: [30, 60],
        marks: {
          0: '0°C',
          8: '8°C',
          37: '37°C',
          50: {
            style: {
              color: '#1989FA'
            },
            label: this.$createElement('strong', '50%')
          }
        }
      }
    }
  }
<\/script>`,
      vertical: `
<template>
  <div class="block">
    <el-slider
      v-model="value"
      vertical
      height="200px">
    </el-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: 0
      }
    }
  }
<\/script>`,
      range: `
<template>
  <div class="block">
    <el-slider
      v-model="value"
      range
      show-stops
      :max="10">
    </el-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: [4, 8]
      }
    }
  }
<\/script>`,
      showInput: `
<template>
  <div class="block">
    <el-slider
      v-model="value"
      show-input>
    </el-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: 0
      }
    }
  }
<\/script>`,
      showStops: ``,
      base: `
<template>
  <div class="block">
    <span class="demonstration">默认</span>
    <el-slider v-model="value1"></el-slider>
  </div>
  <div class="block">
    <span class="demonstration">自定义初始值</span>
    <el-slider v-model="value2"></el-slider>
  </div>
  <div class="block">
    <span class="demonstration">隐藏 Tooltip</span>
    <el-slider v-model="value3" :show-tooltip="false"></el-slider>
  </div>
  <div class="block">
    <span class="demonstration">格式化 Tooltip</span>
    <el-slider v-model="value4" :format-tooltip="formatTooltip"></el-slider>
  </div>
  <div class="block">
    <span class="demonstration">禁用</span>
    <el-slider v-model="value5" disabled></el-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value1: 0,
        value2: 50,
        value3: 36,
        value4: 48,
        value5: 42
      }
    },
    methods: {
      formatTooltip(val) {
        return val / 100;
      }
    }
  }
<\/script>`,
      showStops: `
<template>
  <div class="block">
    <span class="demonstration">不显示间断点</span>
    <el-slider
      v-model="value1"
      :step="10">
    </el-slider>
  </div>
  <div class="block">
    <span class="demonstration">显示间断点</span>
    <el-slider
      v-model="value2"
      :step="10"
      show-stops>
    </el-slider>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value1: 0,
        value2: 0
      }
    }
  }
<\/script>`,
      value1: 0,
      value2: 50,
      value3: 36,
      value4: 48,
      value5: 42,
      value6: 0,
      value7: 0,
      value8: 0,
      value9: [4, 8],
      value10: 0,
      value11: [30, 60],
      marks: {
        0: '0°C',
        8: '8°C',
        37: '37°C',
        50: {
          style: {
            color: '#1989FA',
          },
          label: this.$createElement('strong', '50%'),
        },
      },
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
    formatTooltip(val) {
      return val / 100
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/style/container.scss';

.base-box-card /deep/ .el-card__body {
  padding-top: 0px;
  padding-bottom: 0px;
}

.demo-block {
  padding: 30px 24px;
  overflow: hidden;
  border-bottom: 1px solid #eff2f6;
}

.demo-block .el-slider {
  float: right;
  width: 70%;
  margin-right: 20px;
}

.demo-block .demonstration {
  font-size: 14px;
  color: #8492a6;
  line-height: 44px;
}
</style>
