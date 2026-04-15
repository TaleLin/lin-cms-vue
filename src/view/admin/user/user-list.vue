<template>
  <PagePanel title="用户列表">
    <template #actions>
      <div class="filter-toolbar">
        <div class="group-field">
          <el-select
            v-model="selectedGroupId"
            class="group-select"
            clearable
            filterable
            placeholder="请选择分组"
            @change="handleGroupChange"
          >
            <el-option v-for="group in allGroups" :key="group.id" :label="group.name" :value="group.id" />
          </el-select>
        </div>
      </div>
    </template>
    <el-table v-loading="loading" :data="userRows" @row-dblclick="handleRowDoubleClick">
      <el-table-column prop="username" label="名称" />
      <el-table-column prop="groupNames" label="所属分组" />
      <el-table-column label="操作" fixed="right" width="275">
        <template #default="{ row }">
          <el-button plain size="small" type="primary" @click="openEditDialog(row)">编辑</el-button>
          <el-button plain size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :background="true"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next, jumper"
        @current-change="handlePageChange"
      />
    </div>

    <el-dialog v-model="isDialogVisible" :append-to-body="true" :before-close="handleClose" title="用户信息">
      <div class="dialog-body">
        <el-tabs v-model="activeTabName" class="dialog-tabs" @tab-click="handleTabChange">
          <el-tab-pane label="修改信息" name="修改信息">
            <UserInfo
              v-if="isDialogVisible"
              ref="userInfoFormRef"
              :allGroups
              :id="selectedUserId"
              layout="dialog"
              :user-detail="selectedUser"
              :submit="false"
              labelPosition="right"
              pageType="edit"
              @submitted="handleInfoSubmittedWrapper"
            />
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="修改密码">
            <UserPassword
              ref="userPasswordFormRef"
              :id="selectedUserId"
              layout="dialog"
              class="dialog-password-panel"
              @submitted="handlePasswordSubmitted"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </div>
      </template>
    </el-dialog>
  </PagePanel>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'

import PagePanel from '@/component/base/page-panel.vue'

import UserInfo from './user-info'
import UserPassword from './user-password'
import { useUserList } from './use-user-list'

const userInfoFormRef = useTemplateRef('userInfoFormRef')
const userPasswordFormRef = useTemplateRef('userPasswordFormRef')

const allGroups = ref([])

const {
  activeTabName,
  confirmEdit,
  currentPage,
  fetchGroups,
  fetchUsers,
  handleClose,
  handleDelete,
  handleGroupChange,
  handleInfoSubmitted,
  handlePageChange,
  handlePasswordSubmitted,
  handleRowDoubleClick,
  handleTabChange,
  isDialogVisible,
  loading,
  openEditDialog,
  pageSize,
  resetForm,
  selectedGroupId,
  selectedUser,
  selectedUserId,
  total,
  userRows,
} = useUserList({
  userInfoFormRef,
  userPasswordFormRef,
})

async function loadAllGroups() {
  allGroups.value = await fetchGroups()
}

loadAllGroups()

async function handleInfoSubmittedWrapper(submitted) {
  const result = handleInfoSubmitted(submitted)
  if (submitted === true) {
    await fetchUsers()
  }
  return result
}
</script>

<style lang="scss" scoped>
.filter-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
}

.group-field {
  width: 160px;
}

.group-select {
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0 0;
}

.dialog-body {
  padding-top: 8px;
}

.dialog-tabs :deep(.el-tabs__content) {
  padding-top: 16px;
}

.dialog-password-panel {
  margin-top: 8px;
}
</style>
