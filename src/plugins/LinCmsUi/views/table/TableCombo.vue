<template>
  <!-- 列表页面 -->
  <div class="tableSample">
    <sticky-top>
      <div class="header">
        <div class="header-left">
          <p class="title">豆瓣电影TOP250</p>
        </div>
        <div class="header-right">
          <lin-search @query="onQueryChange" placeholder="请输入电影名" />
        </div>
      </div>
      <lin-1px></lin-1px>
    </sticky-top>
    <div class="table-main">
      <el-dialog top="5vh" width="60%" :visible.sync="dialogTableVisible">
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
            :disabled="fixedRightList.indexOf(item) > -1 || checkList.indexOf(item) ===  -1"
            :label="item"
            v-for="item in tempCheckList"
            :key="item" />
        </el-checkbox-group>
        <span>选择固定在右侧的列:</span>
        <el-checkbox-group v-model="fixedRightList" class="m-20">
          <el-checkbox
            :disabled="fixedLeftList.indexOf(item) > -1 || checkList.indexOf(item) === -1"
            :label="item"
            v-for="item in tempCheckList"
            :key="item" />
        </el-checkbox-group>
      </el-dialog>
      <div class="top-operate">
        <div>
          <el-button type="primary" @click="dialogTableVisible=!dialogTableVisible">列操作</el-button>
          <!-- <el-button type="primary" :disabled="enableDrag" @click="drag()">开启拖拽</el-button> -->
        </div>
        <!-- <el-select
          style="width: 151px;"
          v-model="value"
          @change="selectChange"
          placeholder="导出数据">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select> -->
      </div>
      <el-table
        :row-class-name="rowClassName"
        :data="tableData"
        @row-dblclick="rowClick"
        @expand-change="expandChange"
        v-loading="loading"
        id="out-table'">
        <!-- 展示摘要 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="summary">
              <img :src="props.row.thumb" alt>
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
            :width="item.width ? item.width : ''"></el-table-column>
          <!-- 排序 评分 -->
          <el-table-column
            label="评分"
            :prop="item.prop"
            sortable
            v-bind:key="item.label"
            :fixed="item.fixed ? item.fixed : false"
            :width="item.width ? item.width : ''"
            v-if="item.label === '评分'"></el-table-column>
          <!-- 单元格编辑 -->
          <el-table-column
            v-bind:key="item.label"
            label="备注"
            :width="item.width"
            :show-overflow-tooltip="showTooltip"
            v-if="item.label === '备注'">
            <template slot-scope="props">
              <div v-if="!props.row.editFlag" class="table-edit">
                <div @click="handleEdit(props.row)">{{ props.row.remark }}</div>
                <div class="cell-icon" @click="handleCellEdit(props.row)">
                  <i class="el-icon-edit"></i>
                </div>
              </div>
              <div v-else class="table-edit">
                <el-input v-model="props.row.remark" placeholder></el-input>
                <div class="cell-icon-edit">
                  <div class="cell-save" @click="handleCellSave(props.row)">
                    <i class="el-icon-circle-check-outline"></i>
                  </div>
                  <div class="cell-cancel" @click="handleCellCancel(props.row)">
                    <i class="el-icon-circle-close-outline"></i>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <!-- 推荐 -->
          <el-table-column label="推荐" v-if="item.label === '推荐'" v-bind:key="item.label">
            <template slot-scope="props">
              <el-switch v-model="props.row.recommend" active-color="#3963bc" @change="handleRecommend($event, props.row)"></el-switch>
            </template>
          </el-table-column>
        </template>
        <!-- 操作列 -->
        <el-table-column label="操作" fixed="right" width="170">
          <template slot-scope="scope">
            <lin-button
              v-for="(item,index) in operate"
              :type="item.type"
              plain
              :key="index"
              @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)">{{item.name}}</lin-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination" v-if="!searchKeyword">
        <el-pagination
          @current-change="handleCurrentChange"
          :background="true"
          :page-size="pageCount"
          :current-page="currentPage"
          v-if="refreshPagination"
          layout="prev, pager, next, jumper"
          :total="total_nums"></el-pagination>
      </div>
    </div>
    <source-code></source-code>
  </div>

</template>

<script>
// import Sortable from 'sortablejs' // eslint-disable-line
// import FileSaver from 'file-saver' // eslint-disable-line
// import XLSX from 'xlsx' // eslint-disable-line
import LinButton from '@/components/base/button/lin-button'
import LinSearch from '@/components/base/search/lin-search'

import { tableColumn } from './data'
import movie from '../../models/movie.js'

export default {
  components: {
    LinButton,
    LinSearch,
  },
  data() {
    return {
      tableData: [],
      loading: false,
      Hidden: true, // 默认隐藏自定义排序列
      searchKeyword: '',
      // 定制列相关
      checkList: [],
      filterTableColumn: [],
      // 分页相关
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      total_nums: 180, // 分组内的用户总数
      // 固定列相关
      dialogTableVisible: false,
      fixedLeftList: [],
      fixedRightList: [],
      // 拖拽相关
      enableDrag: false,
      rowClassName: '', // 行样式
      // 数据导出相关
      options: [{
        value: 'excel',
        label: '导出 Excel',
      },
      {
        value: 'csv',
        label: '导出 Csv',
      },
      ],
      value: '',
      // 单元格编辑相关
      editRow: 0,
      showTooltip: true,
    }
  },
  computed: {},
  created() {
    // 获取数据
    this._getTableData((this.currentPage - 1) * this.pageCount, this.pageCount)
    this.tableColumn = tableColumn
    // 操作栏
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
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
    _getTableData(start, count) {
      const res = movie.getTop250(start, count)
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
    showRowOperateModal() {},

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
      this.loading = true
      console.log(val, rowData)
      if (val) {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '推荐成功',
          })
        }, 1000)
      } else {
        setTimeout(() => {
          this.loading = false
          this.$message({
            type: 'success',
            message: '取消推荐',
          })
        }, 1000)
      }
    },

    expandChange(row, expandedRows) {
      console.log(row, expandedRows)
    },

    // 单元格编辑
    handleCellEdit(row) {
      row.editFlag = true; // eslint-disable-line
      this.showTooltip = false
      this.$set(this.filterTableColumn[7], 'width', 330)
      this.tempEditRemark = row.remark
      this.editRow++
    },
    handleCellSave(row) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        row.editFlag = false; // eslint-disable-line
        this.editRow--
        this.$message({
          type: 'success',
          message: '修改成功',
        })
      }, 1000)
    },
    handleCellCancel(row) {
      row.editFlag = false; // eslint-disable-line
      row.remark = this.tempEditRemark; // eslint-disable-line
      this.editRow--
    },

    // 切换分页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      setTimeout(() => {
        this._getTableData(
          (this.currentPage - 1) * this.pageCount,
          this.pageCount,
        )
        this.loading = false
      }, 1000)
    },

    // 操作列
    buttonMethods(func, index, row) {
      const self = this
      const { methods } = this.$options
      methods[func](self, index, row)
    },
    handleEdit(self, index, row) {
      self.handleCellEdit(row)
      console.log(index, row)
    },
    handleDelete(self, index, val) {
      console.log(val)
      self
        .$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          self.loading = true // eslint-disable-line
          setTimeout(() => {
            self.tableData.splice(index, 1)
            self.loading = false // eslint-disable-line
          }, 1000)
        })
    },

    // 搜索
    onQueryChange(query) {
      this.searchKeyword = query.trim()
      if (!query) {
        this._getTableData(0, 20)
        return
      }
      // 处理带空格的情况
      this.tableData = movie.getDataByQuery(this.searchKeyword)
    },

    // 拖拽
    // drag() {
    //   this.loading = true
    //   setTimeout(() => {
    //     this.loading = false
    //   }, 1000)
    //   this.enableDrag = true
    //   const el = document.querySelectorAll(
    //     '.el-table__body-wrapper > table > tbody',
    //   )[0]
    //   this.rowClassName = 'rowClassName' // 设置行样式，添加移动手势
    //   this.sortable = Sortable.create(el, {
    //     setData(dataTransfer) {
    //       dataTransfer.setData('Text', '')
    //     },
    //     onEnd: (evt) => {
    //       const copy = [...this.tableData]
    //       this.tableData[evt.oldIndex] = copy[evt.newIndex]
    //       this.tableData[evt.newIndex] = copy[evt.oldIndex]
    //     },
    //   })
    // },

    // selectChange(val) {
    //   val === 'excel' ? this.exportExcel() : this.exportCsv() // eslint-disable-line
    // },
    // // 导出excel
    // exportExcel(fileName = 'sheet') {
    //   const targetTable = XLSX.utils.table_to_book(
    //     document.querySelectorAll('.el-table__body-wrapper > table')[0],
    //   )
    //   const writeTable = XLSX.write(targetTable, {
    //     bookType: 'xlsx',
    //     bookSST: true,
    //     type: 'array',
    //   })
    //   try {
    //     FileSaver.saveAs(
    //       new Blob([writeTable], { type: 'application/octet-stream' }),
    //       `${fileName}.xlsx`,
    //     )
    //   } catch (e) {
    //     if (typeof console !== 'undefined') console.log(e, writeTable)
    //   }
    //   return writeTable
    // },
    // // 导出csv
    // exportCsv(fileName = 'sheet') {
    //   const targetTable = XLSX.utils.table_to_book(
    //     document.querySelectorAll('.el-table__body-wrapper > table')[0],
    //   )
    //   const writeTable = XLSX.write(targetTable, {
    //     bookType: 'csv',
    //     bookSST: true,
    //     type: 'array',
    //   })
    //   try {
    //     FileSaver.saveAs(
    //       new Blob([writeTable], { type: 'application/octet-stream' }),
    //       `${fileName}.csv`,
    //     )
    //   } catch (e) {
    //     if (typeof console !== 'undefined') console.log(e, writeTable)
    //   }
    //   return writeTable
    // },
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
    editRow() {
      if (this.filterTableColumn[7]) {
        this.editRow === 0 // eslint-disable-line
          ?          this.$set(this.filterTableColumn[7], 'width', 200) // eslint-disable-line
          :          null // eslint-disable-line
      }
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.tableSample {
  padding: 0 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;

    .header-left {
      float: left;

      .title {
        height: 59px;
        line-height: 59px;
        color: $parent-title-color;
        font-size: 16px;
        font-family: "PingFangSC-Medium";
        font-weight: 500;
      }
    }

    .header-right {
      float: right;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .table-main {
    padding: 0 30px;
  }

  .top-operate {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    margin-top: 30px;
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
    width: 100%;

    .cell-icon {
      cursor: pointer;
      color: #3963bc;
      font-size: 16px;
    }

    .cell-icon-edit {
      display: flex;
      margin-left: 20px;
      width: 50px;
      justify-content: space-between;

      .cell-cancel {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
      }

      .cell-save {
        cursor: pointer;
        color: #3963bc;
        font-size: 16px;
        margin-right: -20px;
      }
    }
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
.tableSample .el-table .cell {
  display: inline-block;
  width: 100%;
}

.tableSample .rowClassName {
  cursor: move !important;
}
</style>
