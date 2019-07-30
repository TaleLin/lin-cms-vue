<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div style="padding-left:12px" class="title">
        <span>修改Banner</span>
      </div>
      <el-divider></el-divider>
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form
              :model="form"
              status-icon
              ref="form"
              label-width="100px"
              @submit.native.prevent
            >
              <el-form-item label="Banner名" prop="name">
                <el-input disabled size="medium" v-model="form.name" placeholder="请填写Banner名"></el-input>
              </el-form-item>
              <el-form-item label="Banner描述" prop="description">
                <el-input size="medium" v-model="form.description" placeholder="请填写Banner描述"></el-input>
              </el-form-item>

              <el-form-item class="submit">
                <el-button type="primary" @click="submitForm('form')">保 存</el-button>
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-divider></el-divider>
        <div class="title">
          <span>Banner-Item列表</span>
        </div>
        <el-divider></el-divider>

        <el-row>
          <el-table v-loading="loading" :data="tableData">
            <el-table-column prop="id" label="id" width="150"></el-table-column>
            <el-table-column prop="img" label="图片" width="400"></el-table-column>
            <el-table-column prop="key_word" label="关键字" width="150"></el-table-column>
            <el-table-column prop="type" label="类型" width="100"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  @click.prevent="handleEdit(scope.row)"
                  type="primary"
                  plain
                  size="mini"
                >编辑</el-button>
                <el-button
                  @click.prevent="handleDelete(scope.row)"
                  type="danger"
                  size="mini"
                  plain
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <div class="pagination">
          <el-button @click.prevent="addBannerItem" type="primary" plain size="medium">添加BannerItem</el-button>
        </div>
      </div>
    </div>

    <banner-item-edit
      v-else
      @editClose="editClose"
      :bannerId="id"
      :isCreate="isCreate"
      :editID="editID"
    ></banner-item-edit>
  </div>
</template>

<script>
import banner from '@/models/banner'
import bannerItem from '@/models/banner-item'
import BannerItemEdit from './BannerItemEdit'

export default {
  components: {
    BannerItemEdit,
  },
  data() {
    return {
      tableData: [],
      editID: 0,
      isCreate: false,
      id: 0,
      showEdit: false,
      loading: false,
      form: {
        name: '',
        description: '',
      },
    }
  },
  watch: {
    // eslint-disable-next-line
    '$route.params': function() {
      this.getDetail()
    },
  },
  async mounted() {
    this.getDetail()
  },
  methods: {
    async submitForm() {
      const form = { ...this.form }
      console.log(form)
      const res = await banner.editBanner(this.id, form)
      if (res.error_code === 0) {
        this.$message.success(`${res.msg}`)
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await bannerItem.delectBannerItem(row.id)
        if (res.error_code === 0) {
          this.getDetail()
          this.$message({
            type: 'success',
            message: `${res.msg}`,
          })
        }
      })
    },
    handleEdit(row) {
      this.isCreate = false
      this.editID = row.id
      this.showEdit = true
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    async getDetail() {
      this.loading = true
      const { id } = this.$route.params
      this.id = id
      const res = await banner.getBanner(id)
      // eslint-disable-next-line
      this.form = {
        name: res.name,
        description: res.description,
      }
      this.tableData = res.items
      this.loading = false
    },
    addBannerItem() {
      this.isCreate = true
      this.editID = 0
      this.showEdit = true
    },
    editClose() {
      this.showEdit = false
      this.getDetail()
    },
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: flex-start;
  margin: 20px;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
