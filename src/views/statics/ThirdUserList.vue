<template>
  <div class="container">
    <div class="header">
      <div class="title">用户列表</div>
    </div>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="openid" label="openid" width="150"></el-table-column>
      <el-table-column prop="nickname" label="用户名" width="150"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
      <el-table-column prop="mobile" label="联系方式" width="150"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            disabled
            @click.prevent="handleEdit(scope.row)"
            type="primary"
            plain
            size="mini"
          >编辑</el-button>
          <el-button
            disabled
            @click.prevent="handleDelete(scope.row)"
            type="danger"
            size="mini"
            plain
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="totalNums"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import thirdUser from '@/models/third-user'

export default {
  data() {
    return {
      tableData: [],
      totalNums: 0,
      currentPage: 1,
      pageCount: 5,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
    }
  },
  async created() {
    this.loading = true
    this.getThirdUsers()
    this.loading = false
  },
  methods: {
    async getThirdUsers() {
      try {
        const page = this.currentPage - 1
        const count = this.pageCount
        const categorys = await thirdUser.getThirdUsers({ page, count })
        this.tableData = categorys.collection
        this.totalNums = categorys.total_nums
      } catch (error) {
        if (error.error_code === 10020) {
          this.tableData = []
        }
        console.log(error)
      }
    },
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getThirdUsers()
      this.loading = false
    },
    // eslint-disable-next-line
    handleEdit(val) {},
    handleDelete(val) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await thirdUser.delectThirdUser(val.id)
        if (res.error_code === 0) {
          this.getThirdUsers()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }
}
</style>
