<template>
  <div class="lin-table">
    <el-table
      ref="linTable"
      v-loading="loading"
      stripe
      row-key="id"
      :border="border"
      :data="currentData"
      :highlight-current-row="highlightCurrentRow ? true : false"
      :element-loading-text="loadingText"
      :element-loading-spinner="loadingIcon"
      :element-loading-background="loadingBG"
      :row-class-name="rowClassName"
      @current-change="handleCurrentChange"
      @selection-change="handleSelectionChange"
      @select-all="selectAll"
      @row-click="rowClick"
    >
      <el-table-column v-if="type" :type="type" width="55"></el-table-column>
      <el-table-column v-if="index" :type="index" :index="currentIndex" width="55"></el-table-column>
      <el-table-column
        v-for="item in filterTableColumn"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        :show-overflow-tooltip="true"
        :filters="item.filters ? item.filters : null"
        :filter-method="item.filterMethod ? item.filterMethod : null"
        :column-key="item.filterMethod ? item.prop : null"
        :formatter="item.formatter ? item.formatter : null"
        :sortable="item.sortable ? item.sortable : false"
        :fixed="item.fixed ? item.fixed : false"
        :width="item.width ? item.width : ''"
      ></el-table-column>
      <el-table-column v-if="operate.length > 0" label="操作" fixed="right" width="275">
        <template slot-scope="scope">
          <el-button
            v-for="(item, index) in operate"
            :type="item.type"
            plain
            :key="index"
            size="mini"
            v-permission="{ permission: item.permission ? item.permission : '', type: 'disabled' }"
            @click.native.prevent.stop="buttonMethods(item.func, scope.$index, scope.row)"
            >{{ item.name }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      v-if="pagination"
      background
      layout="prev, pager, next"
      :page-size="pagination.pageSize ? pagination.pageSize : 10"
      :total="pagination.pageTotal ? pagination.pageTotal : null"
      :current-page="pagination.currentPage ? pagination.currentPage : 1"
      @current-change="currentChange"
    ></el-pagination>
  </div>
</template>

<script>
// import Sortable from 'sortablejs'
// import FileSaver from 'file-saver'

export default {
  props: {
    tableColumn: {
      // 表头名称
      type: Array,
      default: () => [],
    },
    tableData: {
      // 表格数据
      type: Array,
      default: () => [],
    },
    operate: {
      // 自定义按键及绑定方法
      type: Array,
      default: () => [],
    },
    customColumn: {
      // 定制要展示的列
      type: Array,
      default: () => [],
    },
    fixedLeftList: {
      // 左侧固定列
      type: Array,
      default: () => [],
    },
    fixedRightList: {
      // 右侧固定列
      type: Array,
      default: () => [],
    },
    type: {
      // 是否开启表格多选
      type: String,
      default: null,
    },
    index: {
      // 是否显示索引
      index: String,
      default: '',
    },
    highlightCurrentRow: {
      // 是否开启表格单选
      type: Boolean,
      default: false,
    },
    loading: {
      // 动画加载
      type: Boolean,
      default: false,
    },
    loadingText: {
      // 动画提示
      type: String,
      default: '',
    },
    loadingIcon: {
      // 动画图标
      type: String,
      default: 'el-icon-loading',
    },
    loadingBG: {
      // 动画背景色
      type: String,
      default: 'rgba(255,255,255,0.5)',
    },
    pagination: {
      // 分页
      type: [Object, Boolean],
      default: false,
    },
    border: {
      // 边框
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      filterTableColumn: [], // 定制展示的列
      currentPage: 1, // 当前选中页
      currentData: [], // 每次切换页码的时候要给table传入不同的数据
      selectedTableData: [], // 多选选中的数据
      currentRow: null, // 单选选中的数据
      oldVal: [], // 上一次选中的数据
      oldKey: [], // 上一次选中数据的key
      currentIndex: 1, // 当前索引，切换页面的时候需要重新计算
      rowClassName: '', // 行样式
    }
  },
  created() {},
  beforeMount() {
    // 先放在session里，因为每次切换页码table都会重新渲染，之前选中都数据就丢失了  sessionstorage在create里面打包会提示undefined
    sessionStorage.setItem('selectedTableData', JSON.stringify([]))
  },
  methods: {
    // 开发者自定义的函数
    buttonMethods(func, index, row) {
      const _this = this
      const { methods } = this.$options
      methods[func](_this, index, row)
    },
    // 行内编辑
    handleEdit(_this, index, row) {
      _this.$emit('handleEdit', { index, row })
    },
    // 行内删除
    handleDelete(_this, index, row) {
      _this.$emit('handleDelete', { index, row })
    },
    // 行内跳转页面
    goToGroupEditPage(_this, index, row) {
      _this.$emit('goToGroupEditPage', { index, row })
    },
    // 多选-选中checkbox
    toggleSelection(rows, flag) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.linTable.toggleRowSelection(row, flag)
        })
      } else {
        this.$refs.linTable.clearSelection()
      }
    },
    // 全选-取消全选
    selectAll(val) {
      this.oldKey = val.map(item => item.key)
    },
    // 单选
    handleCurrentChange(val, oldVal) {
      this.currentRow = val
      this.$emit('handleCurrentChange', { val, oldVal })
    },
    // 单击某一行
    rowClick(row) {
      // eslint-disable-line
      // 选中-多选
      if (!this.oldKey.includes(row.key)) {
        this.oldKey.push(row.key)
        const data = this.oldVal.concat(row)
        this.handleSelectionChange(data)
        // 选中checkbox
        this.toggleSelection(this.currentData.filter(item => item.key === row.key))
        // 取消选中
      } else {
        this.oldKey = this.oldKey.filter(item => item !== row.key)
        const data = this.oldVal.filter(item => item.key !== row.key)
        this.handleSelectionChange(data)
        this.toggleSelection(
          this.currentData.filter(item => item.key === row.key),
          false,
        )
      }
      // 选中-单选
      if (this.currentOldRow && this.currentOldRow.key === row.key) {
        // 取消单选选中
        this.$refs.linTable.setCurrentRow()
        this.currentOldRow = null
        return
      }
      this.currentOldRow = row
    },
    // 切换当前页
    currentChange(page) {
      const currentSelectedData = []
      this.oldVal = []
      this.currentPage = page
      this.selectedTableData = JSON.parse(sessionStorage.getItem('selectedTableData'))
      this.currentData = this.tableData.filter(
        (item, index) => index >= (this.currentPage - 1) * this.pagination.pageSize
          && index < this.currentPage * this.pagination.pageSize,
      ) // eslint-disable-line
      this.$emit('currentChange', page)
      // 已选中的数据打勾
      this.selectedTableData.forEach(item => {
        for (let i = 0; i < this.currentData.length; i++) {
          if (this.currentData[i].key === item.key) {
            // 切换页码重新计算oldVal
            this.oldVal.push(this.currentData[i])
            // 需要打勾的数据
            currentSelectedData.push(this.currentData[i])
          }
        }
      })
      this.$nextTick(() => {
        this.toggleSelection(currentSelectedData)
      })
      // 切换行索引
      this.currentIndex = (this.currentPage - 1) * this.pagination.pageSize + 1
    },
    // checkbox触发函数
    handleSelectionChange(val) {
      const valKeys = val.map(item => item.key)
      const oldValKeys = this.oldVal.map(item => item.key)
      this.selectedTableData = JSON.parse(sessionStorage.getItem('selectedTableData'))
      // 一条数据都没选中
      if (this.selectedTableData.length === 0) {
        this.selectedTableData = this.selectedTableData.concat(val)
        this.$emit('selection-change', this.selectedTableData)
        this.oldVal = [...val]
        sessionStorage.setItem('selectedTableData', JSON.stringify(this.selectedTableData))
        return
      }
      // 判断是选中数据还是取消选中
      if (valKeys.length < oldValKeys.length) {
        const delKey = oldValKeys.filter(item => !valKeys.includes(item))
        this.selectedTableData = this.selectedTableData.filter(item => !delKey.includes(item.key))
        this.$emit('selection-change', this.selectedTableData)
      } else {
        const addKey = valKeys.filter(item => !oldValKeys.includes(item))
        const addVal = val.filter(item => addKey.includes(item.key))
        this.selectedTableData = this.selectedTableData.concat(addVal)
        this.$emit('selection-change', this.selectedTableData)
      }
      sessionStorage.setItem('selectedTableData', JSON.stringify(this.selectedTableData))
      this.oldVal = [...val]
    },
    // 拖拽
    // setDrag() {
    //   const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    //   this.rowClassName = 'rowClassName' // 设置行样式，添加移动手势
    //   this.sortable = Sortable.create(el, {
    //     setData(dataTransfer) {
    //       dataTransfer.setData('Text', '')
    //     },
    //     onEnd: (evt) => {
    //       const dragData = [...this.currentData]
    //       let { oldIndex, newIndex } = evt
    //       if (this.pagination) {
    //         oldIndex = evt.oldIndex * this.currentPage
    //         newIndex = evt.newIndex * this.currentPage
    //       }
    //       dragData[oldIndex] = this.currentData[newIndex]
    //       dragData[newIndex] = this.currentData[oldIndex]
    //       this.$emit('getDragData', { dragData, oldIndex, newIndex })
    //     },
    //   })
    // },
    // 导出excel
    // exportExcel(fileName = 'sheet') {
    //   const targetTable = this.$XLSX.utils.table_to_book(document.querySelectorAll('.el-table__body-wrapper > table')[0])
    //   const writeTable = this.$XLSX.write(targetTable, { bookType: 'xlsx', bookSST: true, type: 'array' })
    //   try {
    //     FileSaver.saveAs(new Blob([writeTable], { type: 'application/octet-stream' }), `${fileName}.xlsx`)
    //   } catch (e) { if (typeof console !== 'undefined') console.log(e, writeTable) }
    //   return writeTable
    // },
    // 导出csv
    // exportCsv(fileName = 'sheet') {
    //   const targetTable = this.$XLSX.utils.table_to_book(document.querySelectorAll('.el-table__body-wrapper > table')[0])
    //   const writeTable = this.$XLSX.write(targetTable, { bookType: 'csv', bookSST: true, type: 'array' })
    //   try {
    //     FileSaver.saveAs(new Blob([writeTable], { type: 'application/octet-stream' }), `${fileName}.csv`)
    //   } catch (e) { if (typeof console !== 'undefined') console.log(e, writeTable) }
    //   return writeTable
    // },
  },
  watch: {
    fixedLeftList: {
      handler() {
        // eslint-disable-line
        this.filterTableColumn.map((item, index) => {
          if (this.fixedLeftList.indexOf(item.label) > -1) {
            this.$set(this.filterTableColumn[index], 'fixed', 'left')
          } else if (this.fixedRightList.indexOf(item.label) === -1) {
            this.$set(this.filterTableColumn[index], 'fixed', false)
          }
          return ''
        })
      },
      deep: true,
      immediate: true,
    },
    fixedRightList: {
      handler() {
        // eslint-disable-line
        this.filterTableColumn.map((item, index) => {
          if (this.fixedRightList.indexOf(item.label) > -1) {
            this.$set(this.filterTableColumn[index], 'fixed', 'right')
          } else if (this.fixedLeftList.indexOf(item.label) === -1) {
            this.$set(this.filterTableColumn[index], 'fixed', false)
          }
          return ''
        })
      },
      deep: true,
      immediate: true,
    },
    customColumn: {
      handler(val) {
        if (val.length > 1) {
          this.filterTableColumn = this.tableColumn.filter(v => val.indexOf(v.label) > -1)
        }
      },
      deep: true,
    },
    tableData: {
      handler() {
        // 传了分页配置
        if (this.pagination && this.pagination.pageSize) {
          this.currentData = this.tableData.filter((item, index) => index < this.pagination.pageSize)
        } else {
          this.currentData = this.tableData
        }
      },
      deep: true,
      immediate: true,
    },
    tableColumn: {
      handler() {
        // 如果一开始没有传要展示的列 就默认全展示
        if (this.customColumn.length > 1) {
          this.filterTableColumn = this.tableColumn.filter(v => this.customColumn.indexOf(v.label) > -1)
        } else {
          this.filterTableColumn = this.tableColumn
        }
      },
      deep: true,
      immediate: true,
    },
  },
}
</script>

<style lang="scss" scoped>
.lin-table {
  position: relative;
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

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-right: -10px;
  margin-top: 15px;
}
</style>

<style>
.lin-table .rowClassName {
  cursor: move !important;
}
</style>
