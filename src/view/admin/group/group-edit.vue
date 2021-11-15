<template>
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
            <el-button @click="back">返回</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import AdminModel from '@/lin/model/admin'
import GroupPermissions from './group-permission'

export default {
  components: {
    GroupPermissions,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    // originally data properties
    const permissions = ref([])
    const allPermissions = ref([])
    const cachePermissions = ref([])

    /**
     * 编辑后的最终权限
     */
    const updatePermissions = picked => {
      permissions.value = picked
    }

    /**
     * 全部权限
     */
    const updateAllPermissions = all => {
      allPermissions.value = all
    }

    /**
     * 页面打开时候，记录当前分组所拥有的全部权限
     */
    const getCacheAuthIds = ids => {
      cachePermissions.value = ids
    }

    /**
     * 确认修改
     */
    const confirmEdit = async () => {
      let addRes = 0
      let delRes = 0
      const groupId = parseInt(route.query.id, 10)
      // 判断是否更改了分组权限
      if (permissions.value.sort().toString() !== cachePermissions.value.sort().toString()) {
        const deletePermissions = cachePermissions.value
          .concat(permissions.value)
          .filter(v => !permissions.value.includes(v))
        const addPermissions = cachePermissions.value
          .concat(permissions.value)
          .filter(v => !cachePermissions.value.includes(v))

        if (addPermissions.length > 0) {
          addRes = await AdminModel.dispatchPermissions(groupId, addPermissions)
        }
        if (deletePermissions.length > 0) {
          delRes = await AdminModel.removePermissions(groupId, deletePermissions)
        }
        if (addRes.code < window.MAX_SUCCESS_CODE || delRes.code < window.MAX_SUCCESS_CODE) {
          ElMessage.success('权限修改成功')
        }
      }
    }

    /**
     * 返回
     */
    const back = () => {
      router.go(-1)
    }

    return {
      back,
      permissions,
      confirmEdit,
      allPermissions,
      getCacheAuthIds,
      cachePermissions,
      updatePermissions,
      updateAllPermissions,
    }
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
