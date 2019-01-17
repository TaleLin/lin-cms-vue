<template>
  <div class="container">
    <div class="title">
      <span>修改图书</span>
      <span class="back" @click="back"><i class="iconfont icon-fanhui"></i> 返回</span>
    </div>
    <lin-1px></lin-1px>
    <div class="wrap">
      <el-row>
        <el-col :lg="16"
                :md="20"
                :sm="24"
                :xs="24">
          <el-form :model="form"
                  status-icon
                  ref="form"
                  label-width="100px">
            <el-form-item label="书名"
                          prop="title">
              <el-input v-model="form.title"
                        placeholder="请填写书名"></el-input>
            </el-form-item>
            <el-form-item label="作者"
                          prop="author">
              <el-input v-model="form.author" placeholder="请填写作者"></el-input>
            </el-form-item>
            <el-form-item label="封面"
                          prop="image">
              <el-input v-model="form.image" placeholder="请填写封面地址"></el-input>
            </el-form-item>
            <el-form-item label="简介"
                          prop="summary">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入简介"
                v-model="form.summary">
              </el-input>
            </el-form-item>
            <el-form-item
                          class="submit">
              <el-button type="primary"
                        @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import book from '@/lin/models/book'

export default {
  props: {
    editBookID: {
      type: Number,
    },
  },
  data() {
    return {
      form: {
        title: '',
        author: '',
        summary: '',
        image: '',
      },
    }
  },
  async mounted() {
    this.form = await book.getBook(this.editBookID)
  },
  methods: {
    async submitForm() {
      const res = await book.editBook(this.editBookID, this.form)
      if (res.error_code === 0) {
        this.$message.success(`${res.msg}`)
        this.$emit('editClose')
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    back() {
      this.$emit('editClose')
    },
  },
}
</script>

<style scoped lang="scss">
@import "~assets/styles/variable.scss";
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-family: PingFangSC-Medium;
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
