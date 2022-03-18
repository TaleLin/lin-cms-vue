<template>
  <!-- 列表页面 -->
  <div class="container">
    <div class="title">分组列表信息</div>
    <el-table :data="tableData" v-loading="loading" @row-dblclick="rowDoubleClick">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="info" label="分组描述"></el-table-column>
      <el-table-column label="操作" fixed="right" width="275">
        <template #default="scope">
          <el-button plain size="small" type="primary" @click="handleEdit(scope.row)">信息</el-button>
          <el-button plain size="small" type="info" @click="goToGroupEditPage(scope.row.id)">权限</el-button>
          <el-button plain size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分组信息 -->
    <el-dialog title="分组信息" :append-to-body="true" v-model="dialogFormVisible" :before-close="handleClose">
      <div style="margin-top: -25px">
        <el-form
          ref="form"
          status-icon
          :rules="rules"
          :model="group"
          label-width="120px"
          v-if="dialogFormVisible"
          label-position="labelPosition"
          style="margin-left: -35px; margin-bottom: -35px; margin-top: 15px"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input clearable v-model="group.name"></el-input>
          </el-form-item>
          <el-form-item label="分组描述" prop="info">
            <el-input clearable v-model="group.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer" style="padding-left: 5px">
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
          <el-button @click="resetForm">重 置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useGroupList, useEditGroup } from './use-group'

export default {
  setup(props, ctx) {
    const router = useRouter()
    /**
     * 分组列表所需数据
     */
    const { tableData, loading, handleDelete, getAllGroups } = useGroupList()

    /**
     * 编辑分组信息
     */
    const {
      id,
      form,
      rules,
      group,
      resetForm,
      handleEdit,
      confirmEdit,
      handleClose,
      rowDoubleClick,
      dialogFormVisible,
    } = useEditGroup(ctx, getAllGroups)

    /**
     * 前往修改分组权限页
     */
    const goToGroupEditPage = groupId => {
      id.value = groupId
      router.push({ path: '/admin/group/edit', query: { id: groupId } })
    }

    return {
      id,
      form,
      rules,
      group,
      loading,
      tableData,
      resetForm,
      handleEdit,
      confirmEdit,
      handleClose,
      handleDelete,
      rowDoubleClick,
      goToGroupEditPage,
      dialogFormVisible,
    }
  },
}
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
  }
}
</style>
