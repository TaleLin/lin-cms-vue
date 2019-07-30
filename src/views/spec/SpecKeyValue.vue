<template>
  <div>
    <div class="container" v-if="!showEdit">
      <div style="padding-left:12px" class="title">
        <span>修改规格键</span>
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
              <el-form-item label="规格键名" prop="name">
                <el-input disabled size="medium" v-model="form.name" placeholder="请填写规格键名"></el-input>
              </el-form-item>
              <el-form-item label="规格键描述" prop="description">
                <el-input size="medium" v-model="form.description" placeholder="请填写规格键描述"></el-input>
              </el-form-item>
              <el-form-item label="单位" prop="unit">
                <el-input size="medium" v-model="form.unit" placeholder="请填写单位，如：英寸"></el-input>
              </el-form-item>
              <el-form-item label="是否标准">
                <el-switch
                  size="medium"
                  v-model="isStandard"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="标准"
                  inactive-text="非标准"
                ></el-switch>
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
          <span>规格值列表</span>
        </div>
        <el-divider></el-divider>

        <el-row>
          <el-table v-loading="loading" :data="tableData">
            <el-table-column prop="id" label="id" width="150"></el-table-column>
            <el-table-column prop="value" label="规格值名" width="150"></el-table-column>
            <el-table-column prop="extend" label="扩展" width="400"></el-table-column>
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
          <el-button @click.prevent="addSpecValue" type="primary" plain size="medium">添加规格值</el-button>
        </div>
      </div>
    </div>

    <spec-value-edit
      v-else
      @editClose="editClose"
      :specId="id"
      :isCreate="isCreate"
      :editID="editID"
    ></spec-value-edit>
  </div>
</template>

<script>
import specKey from '@/models/spec-key'
import specValue from '@/models/spec-value'
import SpecValueEdit from './SpecValueEdit'

export default {
  components: {
    SpecValueEdit,
  },
  data() {
    return {
      tableData: [],
      editID: 0,
      isCreate: false,
      id: 0,
      showEdit: false,
      loading: false,
      isStandard: false,
      form: {
        name: '',
        description: '',
        unit: '',
        standard: 0,
      },
    }
  },
  watch: {
    isStandard(newVal) {
      this.form.standard = newVal ? 1 : 0
    },
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
      // eslint-disable-next-line
      // form.standard = form.isStandard ? 1 : 0
      console.log(form)
      const res = await specKey.editSpecKey(this.id, form)
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
        const res = await specValue.delectSpecValue(row.id)
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
      const res = await specKey.getSpecKeyDetail(id)
      // eslint-disable-next-line
      this.isStandard = res.standard === 1 ? true : false
      this.form = {
        name: res.name,
        description: res.description,
        unit: res.unit,
        standard: res.standard,
      }
      this.tableData = res.items
      this.loading = false
    },
    addSpecValue() {
      // this.$router.push({ path: '/spec/value/add' })
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
