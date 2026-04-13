<template>
  <div class="container">
    <div class="header">
      <div class="title">分组列表信息</div>
    </div>
    <el-table v-loading="loading" :data="tableData" @row-dblclick="rowDoubleClick">
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="info" label="分组描述" />
      <el-table-column label="操作" fixed="right" width="275">
        <template #default="{ row }">
          <el-button plain size="small" type="primary" @click="handleEdit(row)">信息</el-button>
          <el-button plain size="small" type="info" @click="goToGroupEditPage(row.id)">权限</el-button>
          <el-button plain size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" :append-to-body="true" :before-close="handleClose" title="分组信息">
      <div class="dialog-body">
        <el-form
          v-if="dialogFormVisible"
          ref="form"
          class="dialog-form"
          :model="group"
          :rules="rules"
          label-position="right"
          label-width="120px"
          status-icon
        >
          <el-form-item label="分组名称" prop="name">
            <el-input v-model="group.name" clearable />
          </el-form-item>
          <el-form-item label="分组描述" prop="info">
            <el-input v-model="group.info" clearable />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useTemplateRef } from 'vue'

import { useGroupList } from './use-group-list'

defineOptions({
  name: 'GroupList',
})

const router = useRouter()
const form = useTemplateRef('form')
const {
  confirmEdit,
  dialogFormVisible,
  goToGroupEditPage,
  group,
  handleClose,
  handleDelete,
  handleEdit,
  loading,
  resetForm,
  rowDoubleClick,
  rules,
  tableData,
} = useGroupList({
  formRef: form,
  router,
})
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
}

.dialog-body {
  padding-top: 8px;
}

.dialog-form {
  margin-top: 16px;
}

.dialog-footer {
  padding-left: 5px;
}
</style>
