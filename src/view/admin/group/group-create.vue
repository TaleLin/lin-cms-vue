<template>
  <div class="container">
    <div class="title">新建分组信息</div>
    <el-row>
      <el-col :lg="16" :md="20" :sm="24" :xs="24">
        <div class="content">
          <el-form
            ref="form"
            status-icon
            :rules="rules"
            :model="group"
            label-position="right"
            label-width="100px"
            v-loading="loading"
            @submit.prevent
          >
            <el-form-item label="分组名称" prop="name">
              <el-input clearable v-model="group.name"></el-input>
            </el-form-item>
            <el-form-item label="分组描述" prop="info">
              <el-input clearable v-model="group.info"></el-input>
            </el-form-item>
            <el-form-item>
              <group-permissions title="分配权限" ref="groupPermissions" @updatePermissions="updatePermissions">
              </group-permissions>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import AdminModel from '@/lin/model/admin'
import GroupPermissions from './group-permission'

export default {
  components: {
    GroupPermissions,
  },
  setup() {
    /**
     * 表单验证规则
     */
    const { rules } = getRules()

    // originally data properties
    const form = ref(null)
    const groupPermissions = ref(null)

    const loading = ref(false)
    const router = useRouter()
    const permissions = ref([])
    const allPermissions = ref([])
    const group = reactive({ name: '', info: '' })

    /**
     * 重置表单
     */
    const resetForm = () => {
      form.value.resetFields()
      groupPermissions.value.getGroupPermissions()
    }

    /**
     * 提交表单
     * 添加新的分组
     */
    const submitForm = async () => {
      form.value.validate(async valid => {
        if (valid) {
          let res = {}
          const finalPermissions = permissions.value.filter(x => Object.keys(allPermissions.value).indexOf(x) < 0)
          try {
            loading.value = true
            res = await AdminModel.createOneGroup(group.name, group.info, finalPermissions)
          } catch (e) {
            loading.value = false
            console.error(e)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            loading.value = false
            ElMessage.success(`${res.message}`)
            router.push('/admin/group/list')
            resetForm()
          } else {
            loading.value = false
          }
        } else {
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    /**
     * 编辑后的最终权限
     */
    const updatePermissions = picked => {
      permissions.value = picked
    }

    return {
      form,
      rules,
      group,
      loading,
      resetForm,
      submitForm,
      groupPermissions,
      updatePermissions,
    }
  },
}

function getRules() {
  const checkName = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('分组名称不能为空'))
    }
    callback()
  }
  const rules = { info: [], name: [{ validator: checkName, trigger: ['blur', 'change'], required: true }] }
  return { rules }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .content {
    margin-top: 10px;
    padding-left: 25px;
    padding-right: 40px;
  }

  .submit {
    float: left;
  }
}
</style>
