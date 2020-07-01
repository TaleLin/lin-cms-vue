<template>
  <div class="container">
    <div class="title">新建分组信息</div>
    <el-row>
      <el-col :lg="16" :md="20" :sm="24" :xs="24">
        <div class="content">
          <el-form
            status-icon
            :rules="rules"
            :model="form"
            ref="form"
            label-position="right"
            label-width="100px"
            @submit.native.prevent
          >
            <el-form-item label="分组名称" prop="name">
              <el-input size="medium" clearable v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="分组描述" prop="info">
              <el-input size="medium" clearable v-model="form.info"></el-input>
            </el-form-item>
            <el-form-item>
              <group-permissions
                @updatePermissions="updatePermissions"
                @updateAllPermissions="updateAllPermissions"
                ref="groupPermissions"
                title="分配权限"
              >
              </group-permissions>
            </el-form-item>
            <el-form-item class="submit">
              <el-button type="primary" :loading="loading" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Admin from '@/lin/model/admin'
import GroupPermissions from './group-permission'

export default {
  components: {
    GroupPermissions,
  },
  inject: ['eventBus'],
  data() {
    const checkName = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('分组名称不能为空'))
      }
      callback()
    }
    return {
      allPermissions: [], // 所有权限
      permissions: [], // 最终选择的权限
      form: {
        name: '',
        info: '',
      },
      rules: {
        name: [{ validator: checkName, trigger: ['blur', 'change'], required: true }],
        info: [],
      },
      loading: false,
    }
  },
  methods: {
    updatePermissions(permissions) {
      this.permissions = permissions
    },
    updateAllPermissions(allPermissions) {
      this.allPermissions = allPermissions
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        // eslint-disable-line
        if (valid) {
          let res
          const finalPermissions = this.permissions.filter(x => Object.keys(this.allPermissions).indexOf(x) < 0)
          try {
            this.loading = true
            res = await Admin.createOneGroup(this.form.name, this.form.info, finalPermissions, this.id) // eslint-disable-line
          } catch (e) {
            this.loading = false
            console.log(e)
          }
          if (res.code < window.MAX_SUCCESS_CODE) {
            this.loading = false
            this.$message.success(`${res.message}`)
            this.eventBus.$emit('addGroup', true)
            this.$router.push('/admin/group/list')
            this.resetForm('form')
          } else {
            this.loading = false
            this.$message.error(`${res.message}`)
          }
        } else {
          this.$message.error('请将信息填写完整')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$refs.groupPermissions.getGroupPermissions()
    },
  },
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
