<template>
  <div class="container">
    <div class="title">新建图书</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="书名" prop="title">
              <el-input size="medium" v-model="form.title" placeholder="请填写书名"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input size="medium" v-model="form.author" placeholder="请填写作者"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-input size="medium" v-model="form.image" placeholder="请填写封面地址"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入简介"
                v-model="form.summary"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')" :loading="loading">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import book from '@/model/book'

export default {
  data() {
    return {
      form: {
        title: '',
        author: '',
        summary: '',
        image: '',
      },
      loading: false,
    }
  },
  methods: {
    async submitForm(formName) {
      try {
        this.loading = true
        const res = await book.createBook(this.form)
        this.loading = false
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.resetForm(formName)
        }
      } catch (error) {
        this.loading = false
        this.$message.error('图书添加失败，请检测填写信息')
        console.log(error)
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
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

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}
</style>
