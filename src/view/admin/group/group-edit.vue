<template>
  <div class="container">
    <div class="title">编辑分组权限</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <GroupPermissions
            :id="groupId"
            v-model:selected-ids="selectedPermissionIds"
            @loaded="handlePermissionsLoaded"
          />
          <div class="actions">
            <el-button type="primary" @click="applyPermissionChanges">确 定</el-button>
            <el-button @click="goBack">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

import GroupPermissions from './group-permission'
import { useGroupPermissionEditor } from './use-group-form'

const route = useRoute()
const router = useRouter()

const { groupId, selectedPermissionIds, handlePermissionsLoaded, applyPermissionChanges, goBack } =
  useGroupPermissionEditor({
    route,
    router,
  })
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
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 5px;
    margin-top: 30px;
  }
}
</style>
