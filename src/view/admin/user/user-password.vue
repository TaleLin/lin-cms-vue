<template>
  <div class="container" :class="containerClass">
    <el-form
      ref="form"
      v-loading="loading"
      :model="passwordForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
      status-icon
    >
      <el-form-item label="密码" prop="newPassword">
        <el-input v-model="passwordForm.newPassword" autocomplete="off" clearable type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="passwordForm.confirmPassword" autocomplete="off" clearable type="password" />
      </el-form-item>
      <el-form-item v-show="false">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useUserPasswordForm } from './use-user-password-form'

const { id, layout } = defineProps({
  id: {
    type: Number,
    default: undefined,
  },
  layout: {
    type: String,
    default: 'page',
  },
})

const emit = defineEmits(['submitted'])
const containerClass = computed(() => `container--${layout}`)
const { passwordForm, loading, resetForm, rules, submitForm } = useUserPasswordForm({
  id: () => id,
  onSubmitted: result => {
    emit('submitted', result)
  },
})

defineExpose({
  resetForm,
  submitForm,
})
</script>

<style lang="scss" scoped>
.container--dialog {
  margin: 0;
}

.el-form-item ::v-deep(.el-form-item__label) {
  padding-right: 10px !important;
}
</style>
