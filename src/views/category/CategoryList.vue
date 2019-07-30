<template>
  <div>
    <div v-if="!showEdit" class="container">
      <div class="header">
        <div class="title">分类列表</div>
      </div>

      <el-table v-loading="loading" :data="tableData">
        <el-table-column prop="id" label="id" width="100"></el-table-column>
        <el-table-column prop="name" label="名称" width="150"></el-table-column>
        <el-table-column prop="rooted" label="是否root" width="150"></el-table-column>
        <el-table-column prop="parent_id" label="父分类id" width="150"></el-table-column>
        <el-table-column prop="description" label="描述" width="400"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>
            <el-button @click.prevent="handleDelete(scope.row)" type="danger" size="mini" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-button @click.prevent="addCategory" type="primary" plain size="medium">添加分类</el-button>
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
    <category-edit v-else @editClose="editClose" :categoryId="categoryId" :isCreate="isCreate"></category-edit>
  </div>
</template>

<script>
import category from '@/models/category'
import CategoryEdit from './CategoryEdit'

export default {
  components: { CategoryEdit },
  data() {
    return {
      categoryId: null,
      isCreate: false,
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
    this.getCategorys()
    this.loading = false
  },
  methods: {
    async getCategorys() {
      try {
        const page = this.currentPage - 1
        const count = this.pageCount
        const categorys = await category.getCategorys({ page, count })
        const tlData = []
        // eslint-disable-next-line
        categorys.collection.forEach(el => {
          const tmp = { ...el }
          tmp.rooted = el.is_root === 1 ? '是' : '否'
          tlData.push(tmp)
        })
        this.tableData = tlData
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
      this.getCategorys()
      this.loading = false
    },
    handleEdit(val) {
      this.isCreate = false
      this.categoryId = `${val.id}`
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await category.delectCategory(val.id)
        if (res.error_code === 0) {
          this.getCategorys()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        }
      })
    },
    addCategory() {
      this.isCreate = true
      this.categoryId = null
      this.showEdit = true
    },
    editClose() {
      this.showEdit = false
      this.getCategorys()
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
    justify-content: space-between;
    margin: 20px;
  }
}
</style>
