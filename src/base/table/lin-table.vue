<template>
  <el-table
    :data="tableData"
    @row-dblclick="rowClick"
    @selection-change="handleSelectionChange"
    @current-change="handleCurrentChange">
    <!-- 多选列 -->
    <el-table-column
      type="selection"
      v-if="selection"
      width="55"
      @cell-dblclick="tableDbEdit"></el-table-column>


    <!-- 正常表单列 -->
    <div v-for="item in tableColumn" :key="item.id">
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="true"
        v-if="item.prop !== 'remark'"
        :fixed="item.fixed ? item.fixed : false"
        :width="item.width ? item.width : ''">
      </el-table-column>
    </div>


    <!-- 操作列 -->
    <el-table-column label="操作" fixed="right" width="150">
      <template slot-scope="scope">
        <lin-button
          v-for="(item,index) in operate"
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
        </el-button>-->
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import LinButton from '@/base/button/lin-button'

export default {
  props: {
    tableColumn: {
      // 表头名称
      type: Array,
      default: null,
    },
    tableData: {
      // 表格数据
      type: Array,
      default: null,
    },
    operate: {
      // 自定义按键及绑定方法
      type: Array,
      default: null,
    },
    selection: {
      // 是否开启多选功能(checkbox)
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
    // 推荐
    handleRecommend(val, rowData) {
      this.$emit('changeRocommend', val, rowData)
    },
    rowClick(row, event, column) { // eslint-disable-line
      this.$emit('row-click', row)
    },

  },
}
</script>

<style lang="scss" scoped>
.sort-input {
  width: 50px;
  background: none;
  justify-content: space-around;
}
.table-edit {
  display: flex; align-items: center; justify-content: space-between;width:135px;
}
.cell-edit-input .el-input,
.el-input__inner {
  width: 125px;
}

.cell-icon {
  cursor: pointer;
  color: #3963bc;
  margin-left: 5px;
}
</style>
