<template>
  <div class="container">
    <el-date-picker v-model="value"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      align="right"
      popper-class="date-box"
      value-format="yyyy-MM-dd HH:mm:ss"
      :default-time="['00:00:00', '23:59:59']"
      :picker-options="pickerOptions">
    </el-date-picker>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      value: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 7))
            picker.$emit('pick', [start, end])
          },
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 30))
            picker.$emit('pick', [start, end])
          },
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - (3600 * 1000 * 24 * 90))
            picker.$emit('pick', [start, end])
          },
        }],
      },
    }
  },
  watch: {
    value(date) {
      this.$emit('dateChange', date)
    },
  },
  methods: {
    clear() {
      this.value = ''
    },
  },
}
</script>

<style>
.el-popper[x-placement^="bottom"]{
  margin-top: 10px;
}
.el-input__inner{
  height: 32px;
  line-height: 32px;
}
.el-date-editor .el-range__icon {
  height: 32px;
}
.el-date-editor .el-range-separator{
  height: 32px;
}
.el-date-table td.start-date span, .el-date-table td.end-date span{
  background-color: #3963BC;
}
.el-date-table td.today span{
  color: #3963BC;
}
.el-picker-panel__shortcut:hover{
  color: #3963BC;
}
</style>
