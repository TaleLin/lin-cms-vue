<template>
  <div class="container">
    <el-form
      ref="form"
      :model="info"
      status-icon
      :rules="rules"
      v-loading="loading"
      label-width="100px"
      label-position="right"
    >
      <el-form-item label="密码" prop="newPassword">
        <el-input clearable type="password" v-model="info.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" label-position="top">
        <el-input clearable type="password" v-model="info.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-show="false">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import AdminModel from '@/lin/model/admin'

export default {
  props: ['id'],
  setup(props, ctx) {
    const form = ref(null)
    const loading = ref(false)
    const info = reactive({
      newPassword: '',
      confirmPassword: '',
    })

    /**
     * 表单规则
     */
    const rules = getRules(ctx, info, form)

    /**
     * 提交表单数据
     */
    const submitForm = () => {
      if (!info.newPassword && !info.confirmPassword) {
        ctx.emit('handlePasswordResult', true)
        return
      }

      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          try {
            loading.value = true
            res = await AdminModel.changePassword(info.newPassword, info.confirmPassword, props.id)
          } catch (e) {
            loading.value = false
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            loading.value = false
            ElMessage.success(`${res.message}`)
            resetForm()
            ctx.emit('handlePasswordResult', true)
          } else {
            loading.value = false
            ElMessage.error(`${res.message}`)
          }
        } else {
          ElMessage.error('请填写正确的密码信息')
        }
      })
    }

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    return {
      info,
      form,
      rules,
      loading,
      resetForm,
      submitForm,
    }
  },
}

/**
 * 表单规则
 */
function getRules(ctx, info, form) {
  const validatePassword = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入密码'))
    } else if (value.length < 6) {
      callback(new Error('密码长度不能少于6位数'))
    } else {
      if (info.confirmPassword) {
        form.value.validateField('confirmPassword')
      }
      callback()
    }
  }
  const validatePassword2 = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请再次输入密码'))
    } else if (value !== info.newPassword) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }

  // 验证规则
  return {
    newPassword: [{ validator: validatePassword, trigger: 'blur', required: true }],
    confirmPassword: [{ validator: validatePassword2, trigger: 'blur', required: true }],
  }
}
</script>

<style lang="scss" scoped>
.el-form-item :v-deep(.el-form-item__label) {
  padding-right: 10px !important;
}
</style>
