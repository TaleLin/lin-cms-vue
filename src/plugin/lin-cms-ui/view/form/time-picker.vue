<template>
  <div class="lin-container">
    <div class="lin-title">TimePicker 时间选择器</div>
    <div class="lin-wrap-ui">
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>固定时间点</span></div>
        <el-row>
          <div>
            <el-time-select
              v-model="value1"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
              }"
              placeholder="选择时间"
            >
            </el-time-select>
          </div>
        </el-row>
        <el-collapse>
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ base }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>任意时间点</span></div>
        <el-row>
          <div>
            <template>
              <el-time-picker
                v-model="value2"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00',
                }"
                placeholder="任意时间点"
              >
              </el-time-picker>
              <el-time-picker
                arrow-control
                v-model="value3"
                :picker-options="{
                  selectableRange: '18:30:00 - 20:30:00',
                }"
                placeholder="任意时间点"
              >
              </el-time-picker>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ selectableRange }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>固定时间范围</span></div>
        <el-row>
          <div>
            <template>
              <el-time-select
                placeholder="起始时间"
                v-model="startTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30',
                }"
              >
              </el-time-select>
              <el-time-select
                placeholder="结束时间"
                v-model="endTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30',
                  minTime: startTime,
                }"
              >
              </el-time-select>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ selectStarTime }}</div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <el-card style="margin-bottom:50px;">
        <div slot="header"><span>任意时间范围</span></div>
        <el-row>
          <div>
            <template>
              <el-time-picker
                is-range
                v-model="value4"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
              <el-time-picker
                is-range
                arrow-control
                v-model="value5"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
              >
              </el-time-picker>
            </template>
          </div>
        </el-row>
        <el-collapse class="test" style="color:red;">
          <el-collapse-item title="查看代码" name="2">
            <div style="white-space: pre-wrap;">{{ isRange }}</div>
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
      startTime: '',
      endTime: '',
      value1: '',
      value2: new Date(2016, 9, 10, 18, 40),
      value3: new Date(2016, 9, 10, 18, 40),
      value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      value5: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
      base: `
      <el-time-select
        v-model="value1"
        :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30'
        }"
        placeholder="选择时间">
        </el-time-select>

        <script>
        export default {
            data() {
            return {
                value1: ''
            };
            }
        }
        /script>`,
      selectableRange: `
      <template>
        <el-time-picker
            v-model="value2"
            :picker-options="{
            selectableRange: '18:30:00 - 20:30:00'
            }"
            placeholder="任意时间点">
        </el-time-picker>
        <el-time-picker
            arrow-control
            v-model="value3"
            :picker-options="{
            selectableRange: '18:30:00 - 20:30:00'
            }"
            placeholder="任意时间点">
        </el-time-picker>
        </template>

        <script>
        export default {
            data() {
            return {
                value2: new Date(2016, 9, 10, 18, 40),
                value3: new Date(2016, 9, 10, 18, 40)
            };
            }
        }
        <\/script>`,
      selectStarTime: `
      <template>
      <el-time-select
        placeholder="起始时间"
        v-model="startTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30'
        }">
      </el-time-select>
      <el-time-select
        placeholder="结束时间"
        v-model="endTime"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '18:30',
          minTime: startTime
        }">
      </el-time-select>
    </template>

    <script>
      export default {
        data() {
          return {
            startTime: '',
            endTime: ''
          };
        }
      }
    <\/script>`,
      isRange: `
    <template>
    <el-time-picker
      is-range
      v-model="value4"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围">
    </el-time-picker>
    <el-time-picker
      is-range
      arrow-control
      v-model="value5"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围">
    </el-time-picker>
  </template>

  <script>
    export default {
      data() {
        return {
          value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
          value5: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)]
        };
      }
    }
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
</style>
