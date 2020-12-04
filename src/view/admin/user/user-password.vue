<template>
  <div class="container">
    <el-form
      :model="info"
      status-icon
      :rules="rules"
      label-position="right"
      ref="form"
      v-loading="loading"
      label-width="100px"
    >
      <el-form-item label="密码" prop="newPassword">
        <el-input size="medium" clearable type="password" v-model="info.newPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" label-position="top">
        <el-input size="medium" clearable type="password" v-model="info.confirmPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item v-show="false">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
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
    const loading = ref(false)
    const info = reactive({
      newPassword: '',
      confirmPassword: '',
    })

    /**
     * 表单规则
     */
    const rules = getRules(ctx, info)

    /**
     * 提交表单数据
     */
    const submitForm = formName => {
      if (info.newPassword === '' && info.confirmPassword === '') {
        ctx.emit('handlePasswordResult', true)
        return
      }
      ctx.refs[formName].validate(async valid => {
        if (valid) {
          let res
          try {
            loading.value = true
            res = await AdminModel.changePassword(info.newPassword, info.confirmPassword, props.id)
          } catch (e) {
            loading.value = false
            console.error(e)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            loading.value = false
            ElMessage.success(`${res.message}`)
            resetForm(formName)
            ctx.emit('handlePasswordResult', true)
          } else {
            loading.value = false
            ElMessage.error(`${res.message}`)
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请填写正确的信息')
          ctx.emit('handlePasswordResult', false)
        }
      })
    }

    // 重置表单
    const resetForm = formName => {
      ctx.refs[formName].resetFields()
    }

    return {
      info,
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
function getRules(ctx, info) {
  const validatePassword = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else if (value.length < 6) {
      callback(new Error('密码长度不能少于6位数'))
    } else {
      if (info.confirmPassword !== '') {
        ctx.refs.form.validateField('confirmPassword')
      }
      callback()
    }
  }
  const validatePassword2 = (rule, value, callback) => {
    if (value === '') {
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
