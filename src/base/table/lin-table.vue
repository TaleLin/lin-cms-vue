<template>
  <el-table :data="tableData"
            @row-dblclick="rowClick"
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChange">
    <!-- 多选列 -->
    <el-table-column type="selection"
                     v-if="selection"
                     width="55"
                     @cell-dblclick="tableDbEdit">
    </el-table-column>
    <!-- 自定义排序 -->
    <el-table-column label="排序" prop="sorting" v-if="!sortingHidden">
      <template slot-scope="scope" >
        <input type="number"
               class="sort-input"
               v-model="scope.row.sorting"
               @blur="handleSort(scope.row.sorting, scope.row)"/>
      </template>
    </el-table-column>
    <!-- 正常表单列 -->
    <el-table-column v-for="item in tableColumn"
                     :key="item.id"
                     :prop="item.prop"
                     :label="item.label"
                     :show-overflow-tooltip="true"
                     :width="item.width ? item.width : ''">
    </el-table-column>
     <!-- 推荐 -->
    <el-table-column label="推荐" prop="recommend" v-if="!recommendHidden">
      <template slot-scope="scope" >
        <el-switch
          v-model="scope.row.recommend"
          active-color="#3963bc"
          @change="handleRecommend($event, scope.row)">
        </el-switch>
      </template>
    </el-table-column>
    <!-- 操作列 -->
    <el-table-column label="操作"
                     fixed="right"
                     width="150">
      <template slot-scope="scope">
        <lin-button v-for="(item,index) in operate"
                    :type="item.type"
                    :text="item.name"
                    :key="index"
                    v-auth="item.auth ? item.auth : ''"
                    @click.native.prevent.stop="buttonMethods(item.func, scope.$index, tableData)">
        </lin-button>
        <!-- <el-button @click.native.prevent="handleEdit(scope.$index, tableData)"
                   type="text"
                   size="small">
          编辑
        </el-button>
        <el-button @click.native.prevent="handleDelete(scope.$index, tableData)"
                   type="danger"
                   size="small">
          删除
        </el-button> -->
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import LinButton from '@/base/button/lin-button'

export default {
  props: {
    tableColumn: { // 表头名称
      type: Array,
      default: null,
    },
    tableData: { // 表格数据
      type: Array,
      default: null,
    },
    operate: { // 自定义按键及绑定方法
      type: Array,
      default: null,
    },
    selection: { // 是否开启多选功能(checkbox)
      type: Boolean,
      default: false,
    },
    sortingHidden: { // 是否隐藏排序列
      type: Boolean,
      default: true,
    },
    recommendHidden: { // 是否隐藏推荐列
      type: Boolean,
      default: false,
    },
  },
  components: {
    LinButton,
  },
  methods: {
    buttonMethods(func, index, row) {
      const _this = this
      const { methods } = this.$options
      methods[func](_this, index, row)
    },
    handleEdit(_this, index, row) {
      _this.$emit('handleEdit', { index, row })
    },
    handleDelete(_this, index, row) {
      _this.$emit('handleDelete', { index, row })
    },
    handleSelectionChange(val) {
      this.$emit('multipleSelection', val)
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // 自定义排序
    handleSort(val, rowData) {
      this.$emit('changeSort', val, rowData)
    },
    // 推荐
    handleRecommend(val, rowData) {
      this.$emit('changeRocommend', val, rowData)
    },
    rowClick (row, event, column) { // eslint-disable-line
      this.$emit('row-click', row)
    },
  },
}
</script>

<style lang="scss" scoped>
.sort-input {
  width: 50px;
  background: none;
}
</style>
