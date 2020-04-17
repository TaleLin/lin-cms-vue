<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="grid-content bg-purple">
          <group-column></group-column>
        </div>
      </el-col>
      <el-col :span="8" class="none">
        <div class="grid-content bg-purple">
          <radar></radar>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="16">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <tiny-area-july></tiny-area-july>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <tiny-area-june></tiny-area-june>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <line-charts></line-charts>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="none">
        <div class="grid-content bg-purple">
          <rose></rose>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import GroupColumn from '../component/grouped-column'
import Radar from '../component/radar'
import TinyAreaJuly from '../component/tiny-area-july'
import TinyAreaJune from '../component/tiny-area-june'
import LineCharts from '../component/line-chart'
import Rose from '../component/rose'

export default {
  components: {
    Rose,
    GroupColumn,
    Radar,
    TinyAreaJuly,
    TinyAreaJune,
    LineCharts,
  },
  data() {
    return {
      list1: [
        { type: 1, value: 100 },
        { type: 2, value: 120 },
        { type: 3, value: 230 },
        { type: 4, value: 150 },
        { type: 5, value: 280 },
        { type: 6, value: 190 },
        { type: 7, value: 130 },
        { type: 8, value: 150 },
        { type: 9, value: 160 },
        { type: 10, value: 140 },
        { type: 11, value: 190 },
      ],
      list2: [
        { type: 1, value: 80 },
        { type: 2, value: 120 },
        { type: 3, value: 210 },
        { type: 4, value: 120 },
        { type: 5, value: 130 },
        { type: 6, value: 190 },
        { type: 7, value: 130 },
        { type: 8, value: 150 },
        { type: 9, value: 160 },
        { type: 10, value: 140 },
        { type: 11, value: 190 },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .el-row {
    .el-col {
      .grid-content {
        background: #ffffff;
        box-shadow: 0px 2px 14px 0px rgba(243, 243, 243, 1);
        border-radius: 8px;
        min-height: 36px;
        margin-bottom: 20px;
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .none {
    display: none;
  }
}
</style>
