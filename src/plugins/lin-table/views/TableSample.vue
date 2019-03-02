<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">豆瓣电影TOP250</div>
      </div>
      <!-- 定制列 -->
      <span>选择要展示的列:</span>
      <el-checkbox-group v-model="checkList" @change="handleChange">
        <!-- <el-checkbox disabled label="电影名"></el-checkbox>
        <el-checkbox label="原名"></el-checkbox>
        <el-checkbox label="类型"></el-checkbox>
        <el-checkbox label="导演"></el-checkbox>
        <el-checkbox label="排序"></el-checkbox> -->
         <el-checkbox :disabled="item === '电影名'" :label="item" v-for="item in checkList" :key="item" />
      </el-checkbox-group>
      <!-- 固定列 -->
      <span>选择固定在左侧的列:</span>
      <el-checkbox-group v-model="fixedLeftList">
        <el-checkbox :disabled="fixedRightList.indexOf(item) > -1" :label="item" v-for="item in checkList" :key="item" />
      </el-checkbox-group>
      <span>选择固定在右侧的列:</span>
      <el-checkbox-group v-model="fixedRightList">
        <el-checkbox :disabled="fixedLeftList.indexOf(item) > -1" :label="item" v-for="item in checkList" :key="item" />
      </el-checkbox-group>
      <lin-table
        :tableColumn="filterTableColumn"
        :tableData="tableData"
        :operate="operate"
        :sortingHidden="sortingHidden"
        @handleEdit="handleEdit"
        @handleDelete="handleDelete"
        @row-click="rowClick"
        @changeSort="changeSort"
        @changeRocommend="changeRocommend"
        v-loading="loading"></lin-table>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination @current-change="handleCurrentChange"
                        :background="true"
                        :page-size="pageCount"
                        :current-page="currentPage"
                        v-if="refreshPagination"
                        layout="prev, pager, next, jumper"
                        :total="total_nums">
          </el-pagination>
        </div>
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
      tableData: [],
      loading: false,
      sortingHidden: true, // 默认隐藏自定义排序列
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      // 分页相关
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 20, // 每页20条数据
      total_nums: 180, // 分组内的用户总数
      // 固定列相关
      fixedLeftList: [],
      fixedRightList:[]
    }
  },
  created() {
    // 获取数据
    this._getTableData((this.currentPage - 1) * this.pageCount, this.pageCount)

    // 操作栏
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'edit' },
      { name: '删除', func: 'handleDelete', type: 'del' },
    ]
    // 定制列
    this.checkList = tableColumn.map((v) => { // eslint-disable-line
      if (!v.hidden) return v.label
    })
    this.filterTableColumn = tableColumn.filter(
      v => this.checkList.indexOf(v.label) > -1,
    )
  },
  methods: {

    _getTableData() {
      const res = movie.getTop250((this.currentPage - 1) * this.pageCount, this.pageCount)
      this.tableData = [...res]
    },

    handleEdit(val) {
      console.log(val)
    },

    handleDelete(val) {
      console.log(val)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {})
    },

    rowClick(val) {
      console.log(val)
    },

    // 定制列
    handleChange(e) {
      this.sortingHidden = !e.includes('排序')
      this.filterTableColumn = tableColumn.filter(
        v => this.checkList.indexOf(v.label) > -1,
      )
    },

    // 变更排序
    changeSort(val, rowData) {
      console.log('rowData', rowData)
      this.$message({
        type: 'success',
        message: `排序已更改为：${val}`,
      })
    },

    changeRocommend(val, rowData) {
      console.log(val, rowData)
      if (val) {
        this.$message({
          type: 'success',
          message: '推荐成功',
        })
      }
    },

    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this._getTableData((this.currentPage - 1) * this.pageCount, this.pageCount)
      this.loading = false
    },
  },

  watch: {
    // 监听固定列变化
    fixedLeftList () {
      this.filterTableColumn.map( (item,index) => {
        if (this.fixedLeftList.indexOf(item.label) > -1 ) {
          this.$set(this.filterTableColumn[index], 'fixed','left')
        } else if ( this.fixedRightList.indexOf(item.label) === -1 ){
          this.$set(this.filterTableColumn[index], 'fixed',false)
        }
      })
      console.log(this.filterTableColumn)
    },
    fixedRightList () {
      this.filterTableColumn.map( (item,index) => {
        if (this.fixedRightList.indexOf(item.label) > -1 ) {
          this.$set(this.filterTableColumn[index], 'fixed','right')
        } else if ( this.fixedLeftList.indexOf(item.label) === -1 ){
          this.$set(this.filterTableColumn[index], 'fixed',false)
        }
      })
      console.log(this.filterTableColumn)
    }
  }
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
