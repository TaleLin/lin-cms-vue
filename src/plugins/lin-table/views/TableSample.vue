<template>
  <div>
    <!-- 列表页面 -->
    <div class="container">
      <div class="header">
        <div class="title">豆瓣电影TOP250</div>
      </div>
      <!-- 定制列 -->
      <span>选择要展示的列:</span>
      <el-checkbox-group v-model="checkList" @change="handleChange" class="m-20">
        <el-checkbox
          :disabled="item === '电影名'"
          :label="item"
          v-for="item in tempCheckList"
          :key="item" />
      </el-checkbox-group>
      <!-- 固定列 -->
      <span>选择固定在左侧的列:</span>
      <el-checkbox-group v-model="fixedLeftList" class="m-20">
        <el-checkbox
          :disabled="fixedRightList.indexOf(item) > -1"
          :label="item"
          v-for="item in checkList"
          :key="item" />
      </el-checkbox-group>
      <span>选择固定在右侧的列:</span>
      <el-checkbox-group v-model="fixedRightList" class="m-20">
        <el-checkbox
          :disabled="fixedLeftList.indexOf(item) > -1"
          :label="item"
          v-for="item in checkList"
          :key="item" />
      </el-checkbox-group>
      <el-table :data="tableData" @row-dblclick="rowClick" v-loading="loading">
        <!-- 展示摘要 -->
        <el-table-column type="expand" >
          <template slot-scope="props">
            <div class="summary">
              <img  :src="props.row.thumb" alt="">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="电影名">
                  <span>{{ props.row.title }}</span>
                </el-form-item>
                <el-form-item label="导演">
                  <span>{{ props.row.directors }}</span>
                </el-form-item>
                <el-form-item label="主演">
                  <span>{{ props.row.casts }}</span>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-table-column>
        <!-- 开始循环 -->
        <template v-for="item in filterTableColumn">
          <!-- 自定义排序 -->
          <el-table-column label="排序" v-if="item.label === '排序'" v-bind:key="item.label">
            <template slot-scope="props">
              <input
                type="number"
                class="sort-input"
                v-model="props.row.sorting"
                @blur="handleSort(props.row.sorting, props.row)">
            </template>
          </el-table-column>
          <!-- 正常表单列 -->
            <el-table-column
              v-bind:key="item.label"
              v-if="!item.noRepeat"
              :prop="item.prop"
              :label="item.label"
              :show-overflow-tooltip="true"
              :fixed="item.fixed ? item.fixed : false"
              :width="item.width ? item.width : ''">
            </el-table-column>
          <!-- 单元格编辑 -->
          <el-table-column
            v-bind:key="item.label"
            label="备注"
            width="200"
            :show-overflow-tooltip="true"
            v-if="item.label === '备注'">
            <template slot-scope="props">
              <div class="table-edit">
                <div v-if="!props.row.editFlag" @click="handleEdit(props.row)">
                  {{ props.row.remark }}
                </div>
                <div v-if="props.row.editFlag" class="cell-edit-input">
                  <el-input v-model="props.row.remark" placeholder=""></el-input>
                </div>
                <div v-if="!props.row.editFlag" class="cell-icon"
                  @click="handleCellEdit(props.row)">
                  <i class="el-icon-edit"></i>
                </div>
                <div v-if="props.row.editFlag" class="cell-icon" @click="handleCellSave(props.row)">
                  <i class="el-icon-circle-check-outline"></i>
                </div>
                <div v-if="props.row.editFlag" class="cell-icon"
                  @click="handleCellCancel(props.row)">
                  <i class="el-icon-circle-close-outline"></i>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 推荐 -->
          <el-table-column label="推荐"  v-if="item.label === '推荐'" v-bind:key="item.label">
            <template slot-scope="props">
              <el-switch v-model="props.row.recommend"
              active-color="#3963bc"
              @change="handleRecommend($event, props.row)">
              </el-switch>
            </template>
          </el-table-column>
        </template>
        <!-- 操作列 -->
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="props">
            <lin-button
              v-for="(item,index) in operate"
              :type="item.type"
              :text="item.name"
              :key="index"
              v-auth="item.auth ? item.auth : ''"
              @click.native.prevent.stop="buttonMethods(item.func, props.$index, props.row)">
            </lin-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
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
import movie from './models/movie'
import LinButton from '@/base/button/lin-button'

export default {
  components: {
    LinButton,
  },
  data() {
    return {
      tableData: [],
      loading: false,
      Hidden: true, // 默认隐藏自定义排序列
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
      fixedRightList: [],
    }
  },
  computed: {

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
    this.tempCheckList = tableColumn.map(v => v.label).slice()
    this.checkList = tableColumn.map(v => v.label)
    this.filterTableColumn = tableColumn.filter(
      v => this.checkList.indexOf(v.label) > -1,
    )
  },
  methods: {
    // 获取数据
    _getTableData() {
      const res = movie.getTop250((this.currentPage - 1) * this.pageCount, this.pageCount)
      res.map((item) => {
        const temp = item
        temp.remark = '这是一部不错的电影'
        temp.editFlag = false
        return ''
      })
      this.tableData = [...res]
    },

    rowClick(val) {
      console.log(val)
    },

    // 定制列
    handleChange() {
      this.filterTableColumn = tableColumn.filter(
        v => this.checkList.indexOf(v.label) > -1,
      )
    },

    // 变更排序
    handleSort(val, rowData) {
      console.log('rowData', rowData)
      this.$message({
        type: 'success',
        message: `排序已更改为：${val}`,
      })
    },

    // 推荐
    handleRecommend(val, rowData) {
      console.log(val, rowData)
      if (val) {
        this.$message({
          type: 'success',
          message: '推荐成功',
        })
      }
    },

    // 单元格编辑
    handleCellEdit(row) {
      row.editFlag = true // eslint-disable-line
      this.tempEditRemark = row.remark
    },
    handleCellSave(row) {
      row.editFlag = false // eslint-disable-line
    },
    handleCellCancel(row) {
      row.editFlag = false // eslint-disable-line
      row.remark = this.tempEditRemark // eslint-disable-line
    },

    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this._getTableData((this.currentPage - 1) * this.pageCount, this.pageCount)
      this.loading = false
    },

    // 操作列
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      methods[func](self, index, row)
    },
    handleEdit(self, index, row) {
      console.log(index, row)
    },
    handleDelete(self, index, val) {
      console.log(val)
      self.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {})
    },
  },

  watch: {
    // 监听固定列变化
    fixedLeftList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedLeftList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'left')
        } else if (this.fixedRightList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
    },
    fixedRightList() {
      this.filterTableColumn.map((item, index) => {
        if (this.fixedRightList.indexOf(item.label) > -1) {
          this.$set(this.filterTableColumn[index], 'fixed', 'right')
        } else if (this.fixedLeftList.indexOf(item.label) === -1) {
          this.$set(this.filterTableColumn[index], 'fixed', false)
        }
        return ''
      })
      console.log(this.filterTableColumn)
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

  .sort-input {
    width: 50px;
    background: none;
    justify-content: space-around;
  }

  .table-edit {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 135px;
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

  .m-20 {
    margin-bottom: 10px;
    margin-top: 5px;
  }
  .summary {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    img {
      width: 135px;
      height: 200px;
    }
    .demo-table-expand {
      font-size: 0;
      margin-left: 30px;
      display: flex;
      flex-direction: column;
      label {
        width: 90px;
        color: #99a9bf;
      }
      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        display: flex;
        flex-direction: row;
      }
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
