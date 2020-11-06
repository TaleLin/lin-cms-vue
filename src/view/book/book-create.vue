<template>
  <div class="container">
    <div class="title">新建图书</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="book" status-icon ref="form" label-width="100px" @submit.prevent :rules="rules">
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
import { reactive, toRefs } from 'vue'
import { Message } from 'element-plus'
import bookModel from '@/model/book'

export default {
  setup(props, ctx) {
    const data = reactive({
      book: {
        title: '',
        author: '',
        summary: '',
        image: '',
      },
    })

    /**
     * 表单规则验证
     */
    const { rules } = getRules()

    // 重置表单
    const resetForm = formName => {
      ctx.refs[formName].resetFields()
    }

    const submitForm = async formName => {
      ctx.refs[formName].validate(async valid => {
        if (valid) {
          try {
            const res = await bookModel.createBook(data.book)
            if (res.code < window.MAX_SUCCESS_CODE) {
              Message.success(`${res.message}`)
              resetForm(formName)
            }
          } catch (error) {
            Message.error('图书添加失败，请检测填写信息')
            console.error(error)
          }
        } else {
          console.error('error submit!!')
          Message.error('请将信息填写完整')
        }
      })
    }

    return {
      rules,
      resetForm,
      submitForm,
      ...toRefs(data),
    }
  },
}

/**
 * 表单验证规则
 */
function getRules() {
  /**
   * 验证回调函数
   */
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    title: [{ validator: checkInfo, trigger: 'blur', required: true }],
    author: [{ validator: checkInfo, trigger: 'blur', required: true }],
    summary: [{ validator: checkInfo, trigger: 'blur', required: true }],
    image: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
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
