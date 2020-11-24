<template>
  <div class="container">
    <el-form
      :model="userInfo"
      status-icon
      :rules="rules"
      :label-position="labelPosition"
      ref="form"
      v-loading="loading"
      label-width="100px"
      @submit.prevent
    >
      <el-form-item label="用户名" prop="username">
        <el-input size="medium" clearable v-model="userInfo.username" :disabled="isEdited"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          size="medium"
          clearable
          v-model="userInfo.email"
          :disabled="isEdited"
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="密码" prop="password">
        <el-input
          size="medium"
          clearable
          type="password"
          v-model="userInfo.password"
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="pageType === 'add'" label="确认密码" prop="confirmPassword" label-position="top">
        <el-input
          size="medium"
          clearable
          type="password"
          v-model="userInfo.confirmPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="pageType !== 'password'" label="选择分组">
        <el-checkbox-group v-model="userInfo.groupIDs" size="small" style="transform: translateY(5px);">
          <el-checkbox v-for="item in groups" :key="item.id" :label="item.id" border style="margin-left: 0">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-show="submit" class="submit">
        <el-button type="primary" @click="submitForm('form')">保 存</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import AdminModel from '@/lin/model/admin'
import UserModel from '@/lin/model/user'

export default {
  props: {
    submit: {
      // 表单是否显示功能按钮
      type: Boolean,
      default: true,
    },
    id: {
      // 用户id
      type: Number,
      default: undefined,
    },
    groups: {
      // 所有分组
      type: Array,
      default: () => {},
    },
    labelPosition: {
      // 表单label位置
      type: String,
      default: 'right',
    },
    info: {
      // 用户信息
      type: Object,
      default: () => {},
    },
    pageType: {
      type: String,
      default: 'add', // 区分编辑页面/添加页面
    },
  },
  setup(props, ctx) {
    const loading = ref(false)
    const isEdited = ref(false) // 能否编辑

    const userInfo = reactive({
      email: '',
      username: '',
      password: '',
      groupIDs: [],
      confirmPassword: '',
    })

    /**
     * 表单规则验证
     */
    const { rules } = getRules(userInfo)

    /**
     * 新增或更新管理员信息
     */
    const submitForm = formName => {
      ctx.refs[formName].validate(async valid => {
        if (valid) {
          let res
          // 1. 新增用户
          if (props.pageType === 'add') {
            try {
              loading.value = true
              res = await UserModel.register(userInfo)
              if (res.code < window.MAX_SUCCESS_CODE) {
                loading.value = false
                ElMessage.success(`${res.message}`)
                ctx.emit('handleAddUser', true)
                resetForm(formName)
              }
            } catch (e) {
              loading.value = false
              ElMessage.error('新增用户失败')
              console.error(e)
            }
          } else {
            // 2. 更新用户信息 TODO
            // eslint-disable-next-line vue/no-mutating-props
            if (userInfo.groupIDs.sort().toString() === props.info.groupIDs.sort().toString()) {
              ctx.emit('handleInfoResult', false)
              return
            }
            try {
              loading.value = true
              res = await AdminModel.updateOneUser(userInfo.email, userInfo.groupIDs, props.id)
            } catch (e) {
              loading.value = false
              console.error(e)
            }
            if (res.code < window.MAX_SUCCESS_CODE) {
              loading.value = false
              ElMessage.success(`${res.message}`)
              ctx.emit('handleInfoResult', true)
            } else {
              loading.value = false
              ElMessage.error(`${res.message}`)
            }
          }
        } else {
          console.log('error submit!!')
          ElMessage.error('请填写正确的信息')
        }
      })
    }

    /**
     * reset表单内容
     */
    const resetForm = formName => {
      if (props.pageType === 'edit') {
        setInfo()
      } else {
        userInfo.groupIDs = []
        ctx.refs[formName].resetFields()
      }
    }

    /**
     * 编辑页面设置初始值
     */
    const setInfo = () => {
      const temp = []
      userInfo.email = props.info.email
      userInfo.username = props.info.username
      props.info.groupIDs.forEach(item => {
        temp.push(item.id)
      })
      userInfo.groupIDs = temp
    }

    /**
     * 通过是否接收到数据来判断当前页面是添加数据还是编辑数据
     */
    onMounted(() => {
      if (props.pageType === 'edit') {
        setInfo()
        isEdited.value = true
      }
    })
    return {
      rules,
      loading,
      isEdited,
      userInfo,
      resetForm,
      submitForm,
    }
  },
}

/**
 * 表单验证规则
 */
function getRules(userInfo) {
  /**
   * 验证回调函数
   */
  const checkUserName = (rule, value, callback) => {
    if (!value) {
      callback(new Error('用户名不能为空'))
    }
    callback()
  }
  /**
   * 验证密码
   */
  const validatePassword = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请输入密码'))
    } else if (value.length < 6) {
      callback(new Error('密码长度不能少于6位数'))
    } else {
      callback()
    }
  }
  /**
   * 再次验证密码
   */
  const validatePassword2 = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'))
    } else if (value !== userInfo.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }
  const rules = {
    password: [{ validator: validatePassword, trigger: 'blur', required: true }],
    username: [{ validator: checkUserName, trigger: ['blur', 'change'], required: true }],
    confirmPassword: [{ validator: validatePassword2, trigger: 'blur', required: true }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址或者不填', trigger: ['blur', 'change'] }],
  }
  return { rules }
}
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;
  margin-left: -5px;
  max-width: 800px;

  .submit {
    float: left;
  }
}
</style>
