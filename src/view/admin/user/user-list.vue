<!--
  TODO: nextTick refreash pagination
-->
<template>
  <div class="container">
    <div class="header">
      <div class="title">用户列表</div>
      <!-- 分组选择下拉框 -->
      <el-select size="medium" filterable v-model="groupID" placeholder="请选择分组" @change="handleChange" clearable>
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
        :total="totalNum"
      >
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="用户信息" :append-to-body="true" :before-close="handleClose" v-model:visible="dialogFormVisible">
      <div style="margin-top:-25px;">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info
              ref="userInfo"
              v-if="dialogFormVisible"
              @handleInfoResult="handleInfoResult"
              @handleAddUser="handleAddUser"
              labelPosition="right"
              pageType="edit"
              :id="id"
              :groups="groups"
              :info="userInfo"
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
      <div v-solt:footer class="dialog-footer">
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
        <el-button @click="resetForm">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { MessageBox, Message } from 'element-plus'
import AdminModel from '@/lin/model/admin'
import LinTable from '@/component/base/table/lin-table'
import UserInfo from './user-info'
import UserPassword from './user-password'
import { useUserList, useFormData } from './hook'

export default {
  components: { LinTable, UserInfo, UserPassword },
  setup(props, ctx) {
    const tableColumn = [
      { prop: 'username', label: '名称' },
      { prop: 'groupNames', label: '所属分组' },
    ] // 设置表头信息
    const operate = [
      { name: '编辑', func: 'handleEdit', type: 'primary' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]
    const dialogFormVisible = ref(false) // 弹窗遮罩层
    const refreshPagination = ref(true) // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件

    const { groups, loading, groupID, totalNum, tableData, pageCount, currentPage, getAdminUsers } = useUserList()
    const {
      id,
      activeTab,
      resetForm,
      confirmEdit,
      handleClose,
      handleClick,
      handleChange,
      handleInfoResult,
      handleCurrentChange,
      handlePasswordResult,
    } = useFormData(ctx, dialogFormVisible, getAdminUsers, currentPage, loading)

    const userInfo = reactive({
      email: '',
      username: '',
      password: '',
      groupIDs: [],
      confirm_password: '',
    })

    /**
     * 修改管理员信息
     */
    const handleEdit = val => {
      id.value = val.row.id
      userInfo.username = val.row.username
      userInfo.email = val.row.email
      userInfo.groupIDs = val.row.groups
      dialogFormVisible.value = true
    }

    /**
     * 删除管理员数据
     */
    const handleDelete = val => {
      let res
      MessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          loading.value = true
          res = await AdminModel.deleteOneUser(val.row.id)
        } catch (e) {
          loading.value = false
          console.error(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          loading.value = false
          if (totalNum.value % pageCount.value === 1 && currentPage.value !== 1) {
            // 判断删除的是不是每一页的最后一条数据
            currentPage.value--
          }
          await getAdminUsers()
          Message.success(`${res.message}`)
        } else {
          loading.value = false
          Message.error(`${res.message}`)
        }
      })
    }

    /**
     * 监听添加用户是否成功
     */
    const handleAddUser = async flag => {
      if (flag === true) {
        if (totalNum.value % pageCount.value === 0) {
          // 判断当前页的数据是不是满了，需要增加新的页码
          currentPage.value++
        }
        await getAdminUsers()
        // refreshPagination.value = false // 刷新pagination组件
        // this.$nextTick(() => {
        //   this.refreshPagination = true
        // })
      }
    }
    const rowClick = row => {
      handleEdit(row)
    }

    return {
      id,
      groups,
      groupID,
      operate,
      loading,
      rowClick,
      userInfo,
      totalNum,
      tableData,
      activeTab,
      resetForm,
      pageCount,
      handleEdit,
      confirmEdit,
      tableColumn,
      handleClose,
      currentPage,
      handleClick,
      handleChange,
      handleDelete,
      handleAddUser,
      handleInfoResult,
      refreshPagination,
      dialogFormVisible,
      handleCurrentChange,
      handlePasswordResult,
    }
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
