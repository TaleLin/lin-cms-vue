<template>
  <div class="container">
    <el-checkbox-group v-model="checkList" @change="handleChange">
      <el-checkbox disabled label="日期"></el-checkbox>
      <el-checkbox label="姓名"></el-checkbox>
      <el-checkbox label="省份"></el-checkbox>
      <el-checkbox label="市区"></el-checkbox>
    </el-checkbox-group>
    <lin-table
      :tableColumn="filterTableColumn"
      :tableData="tableData"
      :operate="operate"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @row-click="rowClick"
    ></lin-table>
  </div>
</template>

<script>
import { tableData, tableColumn } from './data'
import LinTable from '@/base/table/lin-table'

export default {
  components: {
    LinTable,
  },

  data() {
    return {
      checkList: [],
      tableData: [],
      filterTableColumn: [],
    }
  },
  created() {
    this.tableData = [...tableData]
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'edit' },
      { name: '删除', func: 'handleDelete', type: 'del' },
    ]
    this.checkList = tableColumn.map(v => v.label)
    this.filterTableColumn = tableColumn.filter(
      v => this.checkList.indexOf(v.label) > -1,
    )
  },
  methods: {
    handleEdit(val) {
      console.log(val)
    },

    handleDelete(val) {
      console.log(val)
    },

    rowClick(val) {
      console.log(val)
    },

    handleChange() {
      this.filterTableColumn = tableColumn.filter(
        v => this.checkList.indexOf(v.label) > -1,
      )
    },
  },
}
</script>

<style lang="scss"  scoped >
.container {
  padding: 30px;
}
</style>
