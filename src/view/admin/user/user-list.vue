<template>
  <div class="container">
    <div class="header">
      <div class="title">用户列表</div>
      <!-- 分组选择下拉框 -->
      <el-select filterable v-model="groupId" placeholder="请选择分组" @change="handleChange" clearable>
        <el-option v-for="(group, index) in allGroups" :key="index" :label="group.name" :value="group.id"> </el-option>
      </el-select>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="loading" @row-dblclick="rowDoubleClick">
      <el-table-column prop="username" label="名称"></el-table-column>
      <el-table-column prop="groupNames" label="所属分组"></el-table-column>
      <el-table-column label="操作" fixed="right" width="275">
        <template #default="scope">
          <el-button plain size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button plain size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        :total="totalNum"
        :background="true"
        :page-size="pageCount"
        v-if="refreshPagination"
        :current-page="currentPage"
        layout="prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="用户信息" :append-to-body="true" :before-close="handleClose" v-model="dialogFormVisible">
      <div style="margin-top: -25px">
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane label="修改信息" name="修改信息">
            <user-info
              :id="id"
              ref="info"
              class="info"
              pageType="edit"
              :info="userInfo"
              :submit="false"
              :allGroups="allGroups"
              labelPosition="right"
              v-if="dialogFormVisible"
              @handleInfoResult="handleInfoResult"
            />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <user-password @handlePasswordResult="handlePasswordResult" ref="password" :id="id" class="password" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 按键操作 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import AdminModel from 'lin/model/admin'

import UserInfo from './user-info'
import UserPassword from './user-password'
import { useUserList, useFormData } from './use-user'

export default {
  components: { UserInfo, UserPassword },
  setup(props, ctx) {
    const info = ref(false)
    const password = ref(false)
    const dialogFormVisible = ref(false) // 弹窗遮罩层
    const refreshPagination = ref(true) // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件

    const { allGroups, loading, groupId, totalNum, tableData, pageCount, currentPage, getAdminUsers } = useUserList()
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
    } = useFormData(ctx, dialogFormVisible, getAdminUsers, currentPage, loading, info, password)

    const userInfo = reactive({
      email: '',
      username: '',
      password: '',
      groups: [],
      confirm_password: '',
    })

    /**
     * 修改管理员信息
     */
    const handleEdit = row => {
      id.value = row.id
      userInfo.email = row.email
      userInfo.groups = row.groups
      userInfo.username = row.username
      dialogFormVisible.value = true
    }

    /**
     * 删除管理员数据
     */
    const handleDelete = id => {
      let res
      ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          loading.value = true
          res = await AdminModel.deleteOneUser(id)
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
          ElMessage.success(`${res.message}`)
        } else {
          loading.value = false
          ElMessage.error(`${res.message}`)
        }
      })
    }

    const rowDoubleClick = row => {
      handleEdit(row)
    }

    return {
      id,
      info,
      groupId,
      loading,
      password,
      userInfo,
      totalNum,
      allGroups,
      tableData,
      activeTab,
      resetForm,
      pageCount,
      handleEdit,
      confirmEdit,
      handleClose,
      currentPage,
      handleClick,
      handleChange,
      handleDelete,
      rowDoubleClick,
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
