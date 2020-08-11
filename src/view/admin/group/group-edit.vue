aa<template>
  <div class="container">
    <div class="title">编辑分组权限</div>
    <div class="content">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <div class="content">
            <group-permissions
              :id="$route.query.id"
              ref="groupPermissions"
              @updatePermissions="updatePermissions"
              @getCacheAuthIds="getCacheAuthIds"
              @updateAllPermissions="updateAllPermissions"
              style="margin-right:-30px;margin-left:-25px;margin-bottom:-10px;"
            >
            </group-permissions>
          </div>
          <div style="padding-left:5px;margin-top: 30px;">
            <el-button type="primary" @click="confirmEdit">确 定</el-button>
            <el-button @click="goBack">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
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
    return {
      allPermissions: [], // 所有权限
      permissions: [], // 最终选择的权限
      loading: false,
    }
  },
  methods: {
    updatePermissions(permissions) {
      this.permissions = permissions
    },
    updateAllPermissions(allPermissions) {
      this.allPcrmissions = allPermissions
    },
    // 页面打开时候，记录缓存所拥有的全部权限
    getCacheAuthIds(ids) {
      this.cachePermissions = ids
    },
    async confirmEdit() {
      let addRes = 0
      let delRes = 0
      // 判断是否更改了分组权限
      if (this.permissions.sort().toString() !== this.cachePermissions.sort().toString()) {
        const deletePermissions = this.cachePermissions
          .concat(this.permissions)
          .filter(v => !this.permissions.includes(v))
        const addPermissions = this.cachePermissions
          .concat(this.permissions)
          .filter(v => !this.cachePermissions.includes(v))

        if (addPermissions.length > 0) {
          addRes = await Admin.dispatchPermissions(this.$route.query.id, addPermissions)
        }
        if (deletePermissions.length > 0) {
          delRes = await Admin.removePermissions(this.$route.query.id, deletePermissions)
        }
        if (addRes.code < window.MAX_SUCCESS_CODE || delRes.code < window.MAX_SUCCESS_CODE) {
          this.$refs.groupPermissions.getGroupPermissions()
          this.$message.success('权限修改成功')
        }
      }
    },
    goBack() {
      this.$router.go(-1)
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
    padding-left: 33px;
    padding-right: 40px;
  }

  .submit {
    float: left;
  }
}
</style>
