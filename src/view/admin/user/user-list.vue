<template>
  <div class="container">
    <div class="header">
      <div class="title">用户列表</div>
      <!-- 分组选择下拉框 -->
      <el-select size="medium" filterable v-model="group_id" placeholder="请选择分组" @change="handleChange" clearable>
        <el-option v-for="(group, index) in groups" :key="index" :label="group.name" :value="group.id"> </el-option>
      </el-select>
    </div>
    <!-- 表格 -->
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @row-click="rowClick"
      v-loading="loading"
    ></lin-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="total_nums"
      >
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="用户信息" :append-to-body="true" :before-close="handleClose" :visible.sync="dialogFormVisible">
      <div style="margin-top:-25px;">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info
              ref="userInfo"
              v-if="dialogFormVisible"
              @handleInfoResult="handleInfoResult"
              labelPosition="right"
              pageType="edit"
              :id="id"
              :groups="groups"
              :info="form"
              :submit="false"
              class="info"
            />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <user-password @handlePasswordResult="handlePasswordResult" ref="password" :id="id" class="password" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 按键操作 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'
import UserInfo from './user-info'
import UserPassword from './user-password'

export default {
  components: { LinTable, UserInfo, UserPassword },
  inject: ['eventBus'],
  data() {
    return {
      id: 0, // 用户id
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      editIndex: null, // 编辑的行
      total_nums: 0, // 分组内的用户总数
      currentPage: 1, // 默认获取第一页的数据
      pageCount: 10, // 每页10条数据
      tableData: [], // 表格数据
      tableColumn: [], // 表头数据
      operate: [], // 表格按键操作区
      dialogFormVisible: false, // 控制弹窗显示
      selectGroup: '', // 选中的分组Id
      groups: [], // 所有分组
      group_id: undefined,
      activeTab: '修改信息',
      form: {
        // 表单信息
        username: '',
        password: '',
        confirm_password: '',
        email: '',
        group_ids: [],
      },
      loading: false,
    }
  },
  methods: {
    // 根据分组 刷新/获取分组内的用户
    async getAdminUsers() {
      let res
      const currentPage = this.currentPage - 1
      try {
        this.loading = true
        res = await Admin.getAdminUsers({ group_id: this.group_id, count: this.pageCount, page: currentPage }) // eslint-disable-line
        this.loading = false
        this.tableData = this.shuffleList(res.items)
        this.total_nums = res.total
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所有分组
    async getAllGroups() {
      try {
        this.loading = true
        this.groups = await Admin.getAllGroups()
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },
    // 获取所拥有的权限并渲染  由子组件提供
    async handleEdit(val) {
      this.editIndex = val.index
      let selectedData
      // 单击 编辑按键
      if (val.index >= 0) {
        selectedData = val.row
      } else {
        // 单击 table row
        selectedData = val
      }
      this.id = selectedData.id
      this.form.username = selectedData.username
      this.form.email = selectedData.email
      this.form.group_ids = selectedData.groups
      this.dialogFormVisible = true
    },
    // 下拉框选择分组
    async handleChange() {
      this.currentPage = 1
      this.loading = true
      await this.getAdminUsers()
      this.loading = false
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      await this.getAdminUsers('changePage')
      this.loading = false
    },
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Admin.deleteOneUser(val.row.id)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          if (this.total_nums % this.pageCount === 1 && this.currentPage !== 1) {
            // 判断删除的是不是每一页的最后一条数据
            this.currentPage--
          }
          await this.getAdminUsers()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.message}`)
        }
      })
    },
    // 提交表单信息
    async confirmEdit() {
      if (this.activeTab === '修改信息') {
        await this.$refs.userInfo.submitForm('form')
      } else {
        await this.$refs.password.submitForm('form')
      }
    },
    // 重置
    resetForm() {
      if (this.activeTab === '修改信息') {
        this.$refs.userInfo.resetForm('form')
      } else {
        this.$refs.password.resetForm('form')
      }
    },
    // 双击 table ro
    rowClick(row) {
      this.handleEdit(row)
    },
    // 弹框 右上角 X
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    // 切换tab栏
    handleClick(tab) {
      this.activeTab = tab.name
    },
    // 监听子组件更新用户信息是否成功
    async handleInfoResult(flag) {
      this.dialogFormVisible = false
      if (flag === true) {
        this.getAdminUsers()
      }
    },
    // 监听子组件更新密码是否成功
    handlePasswordResult(result) {
      if (result === true) {
        this.dialogFormVisible = false
      }
    },
    // 监听添加用户是否成功
    async addUser(flag) {
      if (flag === true) {
        if (this.total_nums % this.pageCount === 0) {
          // 判断当前页的数据是不是满了，需要增加新的页码
          this.currentPage++
        }
        await this.getAdminUsers()
        this.refreshPagination = false // 刷新pagination组件
        this.$nextTick(() => {
          this.refreshPagination = true
        })
      }
    },
    shuffleList(users) {
      const list = []
      users.forEach(element => {
        const groups = []
        element.groups.forEach(item => {
          groups.push(item.name)
        })
        element.groupNames = groups.join(',')
        list.push(element)
      })
      return list
    },
  },
  async created() {
    await this.getAdminUsers()
    this.getAllGroups()
    this.tableColumn = [
      { prop: 'username', label: '名称' },
      { prop: 'groupNames', label: '所属分组' },
    ] // 设置表头信息
    this.operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    this.eventBus.$on('addUser', this.addUser)
  },
  beforeDestroy() {
    this.eventBus.$off('addUser', this.addUser)
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}

.info {
  margin-left: -55px;
  margin-bottom: -30px;
}

.password {
  margin-top: 20px;
  margin-left: -55px;
  margin-bottom: -20px;
}
</style>
