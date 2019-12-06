<template>
  <div class="lin-container">
    <div class="lin-title">DateTimePicker 日期时间选择器</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>日期和时间点</span></div>
        <el-row>
          <template>
            <div class="block">
              <span class="demonstration">默认</span>
              <el-date-picker v-model="value1" type="datetime" placeholder="选择日期时间"> </el-date-picker>
            </div>
            <div class="block">
              <span class="demonstration">带快捷选项</span>
              <el-date-picker
                v-model="value2"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </div>
            <div class="block">
              <span class="demonstration">设置默认时间</span>
              <el-date-picker v-model="value3" type="datetime" placeholder="选择日期时间" default-time="12:00:00">
              </el-date-picker>
            </div>
          </template>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>日期和时间范围</span></div>
        <el-row>
          <div>
            <template>
              <div class="block">
                <span class="demonstration">默认</span>
                <el-date-picker
                  v-model="value4"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </div>
              <div class="block">
                <span class="demonstration">带快捷选项</span>
                <el-date-picker
                  v-model="value5"
                  type="datetimerange"
                  :picker-options="pickerOptions1"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  align="right"
                >
                </el-date-picker>
              </div>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ datetimerange }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>默认的起始与结束时刻</span></div>
        <el-row>
          <div>
            <template>
              <div class="block">
                <span class="demonstration">起始日期时刻为 12:00:00</span>
                <el-date-picker
                  v-model="value6"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00']"
                >
                </el-date-picker>
              </div>
              <div class="block">
                <span class="demonstration">起始日期时刻为 12:00:00，结束日期时刻为 08:00:00</span>
                <el-date-picker
                  v-model="value7"
                  type="datetimerange"
                  align="right"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['12:00:00', '08:00:00']"
                >
                </el-date-picker>
              </div>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ defaultTime }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  /* eslint-disable */
  name: '',
  components: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            },
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            },
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      pickerOptions1: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '',
      base: `
      <template>
        <div class="block">
          <span class="demonstration">默认</span>
          <el-date-picker
            v-model="value1"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">带快捷选项</span>
          <el-date-picker
            v-model="value2"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">设置默认时间</span>
          <el-date-picker
            v-model="value3"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </div>
      </template>

      <script>
        export default {
          data() {
            return {
              pickerOptions: {
                shortcuts: [{
                  text: '今天',
                  onClick(picker) {
                    picker.$emit('pick', new Date());
                  }
                }, {
                  text: '昨天',
                  onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                  }
                }, {
                  text: '一周前',
                  onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                  }
                }]
              },
              value1: '',
              value2: '',
              value3: ''
            };
          }
        };
      <\/script>`,
      datetimerange: `
      <template>
        <div class="block">
          <span class="demonstration">默认</span>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="block">
          <span class="demonstration">带快捷选项</span>
          <el-date-picker
            v-model="value2"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </div>
      </template>

      <script>
        export default {
          data() {
            return {
              pickerOptions: {
                shortcuts: [{
                  text: '最近一周',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近一个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                  }
                }, {
                  text: '最近三个月',
                  onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                  }
                }]
              },
              value1: '',
              value2: ''
            };
          }
        };
      <\/script>`,
      defaultTime: `
     <template>
      <div class="block">
        <span class="demonstration">起始日期时刻为 12:00:00</span>
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']">
        </el-date-picker>
      </div>
      <div class="block">
        <span class="demonstration">起始日期时刻为 12:00:00，结束日期时刻为 08:00:00</span>
        <el-date-picker
          v-model="value2"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']">
        </el-date-picker>
      </div>
    </template>

    <script>
      export default {
        data() {
          return {
            value1: '',
            value2: ''
          };
        }
      };
    <\/script>`,
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
@import '../../assets/style/container';
.el-date-editor + .el-date-editor {
  margin-left: 10px;
}
.block {
  padding: 30px 0;
  text-align: center;
  border-right: 1px solid #eff2f6;
  display: inline-block;
  width: 49%;
  box-sizing: border-box;

  &:last-child {
    border-right: none;
  }
}

.demonstration {
  display: block;
  color: #8492a6;
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
