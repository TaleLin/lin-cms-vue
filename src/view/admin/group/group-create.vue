<template>
  <PagePanel title="新建分组信息">
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form
            ref="form"
            v-loading="loading"
            :model="groupDraft"
            :rules="rules"
            label-position="right"
            label-width="100px"
            status-icon
            @submit.prevent
          >
            <el-form-item label="分组名称" prop="name">
              <el-input v-model="groupDraft.name" clearable />
            </el-form-item>
            <el-form-item label="分组描述" prop="info">
              <el-input v-model="groupDraft.info" clearable />
            </el-form-item>
            <el-form-item label-width="0">
              <GroupPermissions ref="groupPermissions" v-model:selected-ids="selectedPermissionIds" title="分配权限" />
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitGroupForm">保 存</el-button>
              <el-button @click="resetGroupForm">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </PagePanel>
</template>

<script setup>
import { useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

import PagePanel from '@/component/base/page-panel.vue'

import GroupPermissions from './group-permission'
import { useGroupCreation } from './use-group-form'

const router = useRouter()
const formRef = useTemplateRef('form')
const groupPermissionsRef = useTemplateRef('groupPermissions')

const { groupDraft, loading, resetGroupForm, rules, selectedPermissionIds, submitGroupForm } = useGroupCreation({
  formRef,
  groupPermissionsRef,
  router,
})
</script>

<style lang="scss" scoped>
.wrap {
  .submit :deep(.el-form-item__content) {
    justify-content: flex-start;
  }
}
</style>
