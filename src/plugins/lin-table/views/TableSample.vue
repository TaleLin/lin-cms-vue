<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">豆瓣电影TOP250</div>
      </div>
      <el-checkbox-group v-model="checkList" @change="handleChange">
        <el-checkbox disabled label="电影名"></el-checkbox>
        <el-checkbox label="原名"></el-checkbox>
        <el-checkbox label="类型"></el-checkbox>
        <el-checkbox label="导演"></el-checkbox>
      </el-checkbox-group>
      <lin-table
        :tableColumn="filterTableColumn"
        :tableData="tableData"
        :operate="operate"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"></lin-table>

        <!-- 分页 -->
        <!-- <div class="pagination">
          <el-pagination @current-change="handleCurrentChange"
                        :background="true"
                        :page-size="pageCount"
                        :current-page="currentPage"
                        v-if="refreshPagination"
                        layout="prev, pager, next, jumper"
                        :total="total_nums">
          </el-pagination>
        </div> -->
    </div>
  </div>
</template>

<script>
import { tableColumn } from './data'
import LinTable from '@/base/table/lin-table'
import movie from './models/movie'

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
    const res = movie.getTop250(0, 20)
    this.tableData = [...res]
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

<style lang="scss" scoped>
@import "~assets/styles/variable.scss";

.container {
  padding: 0 30px 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
    }
  }
  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
<style>

  .el-table .cell {
    display: inline-block;
  }
</style>
