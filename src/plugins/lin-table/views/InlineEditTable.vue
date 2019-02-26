<template>
  <div class="container">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="name" label="姓名" width="120" :show-overflow-tooltip="true"></el-table-column>
       <el-table-column prop="date" label="日期" width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="province" label="省份" width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column min-width="300px" label="地址">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.address" class="edit-input" size="small"/>
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(scope.row)"
            >cancel</el-button>
          </template>
          <span v-else>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(scope.row)"
          >Ok</el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="scope.row.edit=!scope.row.edit"
          >Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { tableData } from './data'

export default {
  data() {
    return {
      tableData: [],
    }
  },
  created() {
    this.tableData = tableData.map((v) => {
      const temp = { ...v }
      this.$set(temp, 'edit', false)
      temp.originalAddress = temp.address
      return temp
    })
  },
  methods: {
    // 行内编辑
    cancelEdit(row) {
      const temp = { ...row }
      temp.address = temp.originalAddress
      temp.edit = false
    },
    confirmEdit(row) {
      const temp = { ...row }
      temp.edit = false
      temp.originalAddress = temp.address
    },
  },
}
</script>

<style lang="scss">
.container {
  padding: 30px;
}
</style>
