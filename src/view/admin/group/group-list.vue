<template>
  <!-- 列表页面 -->
  <div class="container">
    <div class="title">分组列表信息</div>
    <lin-table
      :tableColumn="tableColumn"
      :tableData="tableData"
      :operate="operate"
      @handleEdit="handleEdit"
      @goToGroupEditPage="goToGroupEditPage"
      @handleDelete="handleDelete"
      @row-click="rowClick"
      v-loading="loading"
    >
    </lin-table>
    <el-dialog
      title="分组信息"
      :append-to-body="true"
      v-model:visible="dialogFormVisible"
      :before-close="handleClose"
      class="groupListInfoDialog"
    >
      <div style="margin-top:-25px;">
        <el-form
          status-icon
          v-if="dialogFormVisible"
          ref="form"
          label-width="120px"
          :model="group"
          label-position="labelPosition"
          :rules="rules"
          style="margin-left:-35px;margin-bottom:-35px;margin-top:15px;"
        >
          <el-form-item label="分组名称" prop="name">
            <el-input size="medium" clearable v-model="group.name"></el-input>
          </el-form-item>
          <el-form-item label="分组描述" prop="info">
            <el-input size="medium" clearable v-model="group.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer" style="padding-left:5px;">
          <el-button type="primary" @click="confirmEdit">确 定</el-button>
          <el-button @click="resetForm('form')">重 置</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import LinTable from '@/component/base/table/lin-table'
import { useGroupList, useEditGroup } from './hook'

export default {
  components: {
    LinTable,
  },
  setup(props, ctx) {
    // originally data properties
    const tableColumn = [
      { prop: 'name', label: '名称' },
      { prop: 'info', label: '分组描述' },
    ]
    const operate = [
      { name: '信息', func: 'handleEdit', type: 'primary' },
      { name: '权限', func: 'goToGroupEditPage', type: 'info' },
      { name: '删除', func: 'handleDelete', type: 'danger' },
    ]

    /**
     * 分组列表所需数据
     */
    const { tableData, loading, handleDelete, getAllGroups } = useGroupList()

    /**
     * 编辑分组信息
     */
    const {
      id,
      rules,
      group,
      rowClick,
      resetForm,
      handleEdit,
      confirmEdit,
      handleClose,
      dialogFormVisible,
    } = useEditGroup(ctx, getAllGroups)

    /**
     * 前往修改分组权限页
     */
    const goToGroupEditPage = val => {
      id.value = val.row.id
      const { router } = ctx.root.$options
      router.push({ path: '/admin/group/edit', query: { id: val.row.id } })
    }

    return {
      id,
      rules,
      group,
      operate,
      loading,
      rowClick,
      tableData,
      resetForm,
      handleEdit,
      tableColumn,
      confirmEdit,
      handleClose,
      handleDelete,
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
.groupListInfoDialog /deep/ .el-dialog__footer {
  text-align: left;
  padding-left: 30px;
}
.groupListInfoDialog /deep/ .el-dialog__header {
  padding-left: 30px;
}

.groupListInfoDialog /deep/ .el-dialog__body {
  padding: 30px;
}
</style>
