<template>
  <div class="container" :class="containerClass">
    <el-form
      ref="form"
      v-loading="loading"
      :label-position="labelPosition"
      :model="userInfo"
      :rules="rules"
      label-width="100px"
      status-icon
      @submit.prevent
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userInfo.username" :disabled="isEdited" clearable />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userInfo.email" :disabled="isEdited" autocomplete="new-password" clearable />
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="密码" prop="password">
        <el-input v-model="userInfo.password" autocomplete="new-password" clearable type="password" />
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="确认密码" prop="confirmPassword">
        <el-input v-model="userInfo.confirmPassword" autocomplete="off" clearable type="password" />
      </el-form-item>
      <el-form-item label="选择分组" prop="groupIds">
        <el-checkbox-group v-model="userInfo.groupIds" size="small" class="group-selector">
          <el-checkbox v-for="group in allGroups" :key="group.id" :value="group.id" border class="group-selector__item">
            {{ group.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="submit" class="form-actions">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="resetForm">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useUserInfoForm } from './use-user-info-form'

const { submit, id, allGroups, labelPosition, userDetail, pageType, layout } = defineProps({
  submit: {
    type: Boolean,
    default: true,
  },
  id: {
    type: Number,
    default: undefined,
  },
  allGroups: {
    type: Array,
    default: () => [],
  },
  labelPosition: {
    type: String,
    default: 'right',
  },
  userDetail: {
    type: Object,
    default: () => ({}),
  },
  pageType: {
    type: String,
    default: 'add',
  },
  layout: {
    type: String,
    default: 'page',
  },
})

const emit = defineEmits(['submitted'])
const containerClass = computed(() => {
  return layout === 'dialog' ? 'container--dialog' : 'container--page'
})

const { isEdited, loading, resetForm, rules, submitForm, userInfo } = useUserInfoForm({
  id: () => id,
  userDetail: () => userDetail,
  pageType: () => pageType,
  onSubmitted: flag => {
    emit('submitted', flag)
  },
})

defineExpose({
  resetForm,
  submitForm,
})
</script>

<style lang="scss" scoped>
.container {
  .group-selector {
    transform: translateY(5px);
  }

  .group-selector__item {
    margin-left: 0;
  }

  .form-actions :deep(.el-form-item__content) {
    justify-content: flex-start;
  }
}

.container--page {
  max-width: 800px;
  margin-top: 20px;
}

.container--dialog {
  max-width: none;
  margin: 0;
}
</style>
