<template>
  <div class="container">
    <div class="title">分组列表信息</div>
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      @handleEdit="handleEdit"
      @goToGroupEditPage="goToGroupEditPage"
      @handleDelete="handleDelete"
      @row-click="rowClick"
      v-loading="loading"
    >
    </lin-table>
    <el-dialog
      title="分组信息"
      :append-to-body="true"
      :visible.sync="dialogFormVisible"
      :before-close="handleClose"
      class="groupListInfoDialog"
    >
      <div style="margin-top:-25px;">
        <el-form
          status-icon
          v-if="dialogFormVisible"
          ref="form"
          label-width="120px"
          :model="form"
          label-position="labelPosition"
          :rules="rules"
          style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input size="medium" clearable v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="分组描述" prop="info">
            <el-input size="medium" clearable v-model="form.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" style="padding-left:5px;">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'

export default {
  components: {
    LinTable,
  },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 分组id
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 是否弹窗
      labelPosition: 'right', // 设置label位置
      form: {
        // 表单信息
        name: '',
        info: '',
      },
      cacheForm: {
        // 缓存第一次的表单信息
        name: '',
        info: '',
      },
      loading: false,
      activeTab: '修改信息', // tab 标题
      rules: {
        // 表单验证规则
        name: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
        info: [],
      },
    }
  },
  methods: {
    // 获取所有分组并传给table渲染
    async getAllGroups() {
      try {
        this.loading = true
        this.tableData = await Admin.getAllGroups()
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    async confirmEdit() {
      // 修改分组信息
      if (this.form.name === '') {
        this.$message.warning('请将信息填写完整')
        return
      }
      if (this.cacheForm.name !== this.form.name || this.cacheForm.info !== this.form.info) {
        // eslint-disable-line
        const res = await Admin.updateOneGroup(this.form.name, this.form.info, this.id)
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.getAllGroups()
        }
      }
      this.dialogFormVisible = false
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 获取所拥有的权限并渲染  由子组件提供
    handleEdit(val) {
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单机 table row
        selectedData = val
      }
      this.id = selectedData.id
      this.form.name = selectedData.name
      this.form.info = selectedData.info
      this.cacheForm = { ...this.form }
      this.dialogFormVisible = true
    },
    goToGroupEditPage(val) {
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单机 table row
        selectedData = val
      }
      this.id = selectedData.id
      this.$router.push({ path: '/admin/group/edit', query: { id: selectedData.id } })
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Admin.deleteOneGroup(val.row.id)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          await this.getAllGroups()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        } else {
          this.loading = false
          this.$message({
            type: 'error',
            message: `${res.message}`,
          })
        }
      })
    },
    // 双击 table row
    rowClick(row) {
      this.handleEdit(row)
    },
    // 弹框 右上角 X
    handleClose(done) {
      done()
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
    // 监听分添加组是否成功
    async addGroup(flag) {
      if (flag === true) {
        await this.getAllGroups()
      }
    },
  },
  async created() {
    await this.getAllGroups()
    this.tableColumn = [{ prop: 'name', label: '名称' }, { prop: 'info', label: '信息' }] // 设置表头信息
    this.operate = [
      { name: '信息', func: 'handleEdit', type: 'primary' },
      { name: '权限', func: 'goToGroupEditPage', type: 'info' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    // 监听添加分组是否成功
    this.eventBus.$on('addGroup', this.addGroup)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addGroup)
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
  }
}
.groupListInfoDialog /deep/ .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}
.groupListInfoDialog /deep/ .el-dialog__header {
  padding-left: 30px;
}

.groupListInfoDialog /deep/ .el-dialog__body {
  padding: 30px;
}
</style>
