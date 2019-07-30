<template>
  <div class="container">
    <div class="header">
      <div class="title">规格键列表</div>
    </div>

    <el-table v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="name" label="规格值名" width="150"></el-table-column>
      <el-table-column prop="description" label="描述" width="400"></el-table-column>
      <el-table-column prop="unit" label="单位" width="120"></el-table-column>
      <el-table-column prop="standard" label="标准" width="120"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click.prevent="handleDetail(scope.row)" type="primary" plain size="mini">查看</el-button>
          <el-button @click.prevent="handleDelete(scope.row)" type="danger" size="mini" plain>删除</el-button>
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
import specKey from '@/models/spec-key'

export default {
  data() {
    return {
      tableData: [],
      showEdit: false,
      totalNums: 0,
      currentPage: 1,
      pageCount: 5,
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
    }
  },
  async created() {
    this.loading = true
    this.getSpecKeys()
    this.loading = false
  },
  methods: {
    async getSpecKeys() {
      try {
        const page = this.currentPage - 1
        const count = this.pageCount
        const specKeys = await specKey.getSpecKeys({ page, count })
        const formatSpecs = []
        // eslint-disable-next-line
        specKeys.collection.forEach(it => {
          const s = it.standard
          // eslint-disable-next-line
          it.standard = s === 1 ? '是' : '否'
          formatSpecs.push(it)
        })
        this.tableData = formatSpecs
        this.totalNums = specKeys.total_nums
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
      this.getSpecKeys()
      this.loading = false
    },
    handleDetail(val) {
      this.$router.push({ path: `/spec/key/value/${val.id}` })
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await specKey.delectSpecKey(val.id)
        if (res.error_code === 0) {
          this.getSpecKeys()
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
