<!--
  Author: 一飞同学
-->
<template>
  <div class="container">
    <div class="title">新建图书</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="book" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="书名" prop="title">
              <el-input size="medium" v-model="book.title" placeholder="请填写书名"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input size="medium" v-model="book.author" placeholder="请填写作者"></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-input size="medium" v-model="book.image" placeholder="请填写封面地址"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                size="medium"
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入简介"
                v-model="book.summary"
              >
              </el-input>
            </el-form-item>

            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm('form')">保 存</el-button>
              <el-button @click="resetForm('form')">重 置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api'
import { Message } from 'element-ui'
import bookModel from '@/model/book'

export default {
  setup(initProps, setupContext) {
    const data = reactive({
      book: {
        title: '',
        author: '',
        summary: '',
        image: '',
      },
    })

    // 重置表单
    function resetForm(formName) {
      setupContext.refs[formName].resetFields()
    }

    async function submitForm(formName) {
      try {
        const res = await bookModel.createBook(data.book)
        if (res.code < window.MAX_SUCCESS_CODE) {
          Message.success(`${res.message}`)
          resetForm(formName)
        }
      } catch (error) {
        Message.error('图书添加失败，请检测填写信息')
        console.log(error)
      }
    }

    return {
      ...toRefs(data),
      submitForm,
      resetForm,
    }
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
