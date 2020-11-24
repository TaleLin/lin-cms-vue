<template>
  <div class="container">
    <div class="title">
      <span>修改图书</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="book" status-icon ref="form" label-width="100px" v-loading="loading" @submit.prevent>
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
              <el-input size="medium" type="textarea" :rows="4" placeholder="请输入简介" v-model="book.summary">
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
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import bookModel from '@/model/book'

export default {
  props: {
    editBookID: {
      type: Number,
    },
  },
  setup(props, context) {
    const loading = ref(false)
    const book = reactive({
      title: '',
      author: '',
      summary: '',
      image: '',
    })

    const listAssign = (a, b) => Object.keys(a).forEach(key => {
      a[key] = b[key] || a[key]
    })

    loading.value = true
    bookModel
      .getBook(props.editBookID)
      .then(res => {
        listAssign(book, res)
        loading.value = false
      })
      .catch(error => {
        console.error('modify book error:', error)
        loading.value = false
      })

    // 重置表单
    const resetForm = formName => {
      context.refs[formName].resetFields()
    }

    const submitForm = async () => {
      const res = await bookModel.editBook(props.editBookID, book)
      if (res.code < window.MAX_SUCCESS_CODE) {
        ElMessage.success(`${res.message}`)
        context.emit('editClose')
      }
    }

    const back = () => {
      context.emit('editClose')
    }

    return {
      loading,
      book,
      resetForm,
      submitForm,
      back,
    }
  },
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
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
