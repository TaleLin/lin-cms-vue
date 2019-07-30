<template>
  <div>
    <div v-if="!showEdit" class="container">
      <div class="header">
        <div class="title">SKU列表</div>
      </div>

      <el-table v-loading="loading" :data="tableData">
        <el-table-column fixed="left" prop="id" label="id" width="50"></el-table-column>
        <el-table-column prop="title" label="标题" width="150"></el-table-column>
        <el-table-column prop="spu_id" label="spuId" width="100"></el-table-column>
        <el-table-column prop="discount" label="折扣" width="100"></el-table-column>
        <el-table-column prop="price" label="价格（元）" width="150"></el-table-column>
        <el-table-column prop="on_sale" label="是否上架" width="150"></el-table-column>

        <el-table-column prop="code" label="编码" width="200"></el-table-column>
        <el-table-column prop="currency" label="货币" width="100"></el-table-column>
        <el-table-column prop="stock" label="库存（个）" width="100"></el-table-column>
        <el-table-column prop="img" label="图片url" width="300"></el-table-column>

        <el-table-column width="150" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">编辑</el-button>
            <el-button @click.prevent="handleDelete(scope.row)" type="danger" size="mini" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-button @click.prevent="addSku" type="primary" plain size="medium">添加SKU</el-button>
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
    <sku-edit v-else @editClose="editClose" :skuId="skuId" :isCreate="isCreate"></sku-edit>
  </div>
</template>

<script>
import sku from '@/models/sku'
import SkuEdit from './SkuEdit'

export default {
  components: { SkuEdit },
  data() {
    return {
      skuId: null,
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
    this.getSkus()
    this.loading = false
  },
  methods: {
    async getSkus() {
      try {
        const page = this.currentPage - 1
        const count = this.pageCount
        const banners = await sku.getSkus({ page, count })
        this.tableData = banners.collection
        this.totalNums = banners.total_nums
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
      this.getSkus()
      this.loading = false
    },
    handleEdit(val) {
      this.isCreate = false
      this.skuId = `${val.id}`
      this.showEdit = true
    },
    handleDelete(val) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await sku.delectSku(val.id)
        if (res.error_code === 0) {
          this.getSkus()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        }
      })
    },
    addSku() {
      this.isCreate = true
      this.skuId = null
      this.showEdit = true
    },
    editClose() {
      this.showEdit = false
      this.getSkus()
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
