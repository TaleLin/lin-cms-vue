<template>
  <div class="container">
    <div class="title">添加规格值</div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="规格值名" prop="value">
              <el-input size="medium" v-model="form.value" placeholder="请填写规格值名"></el-input>
            </el-form-item>
            <el-form-item label="扩展" prop="extend">
              <el-input size="medium" v-model="form.extend" placeholder="请填写规格值扩展"></el-input>
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
import specValue from '@/models/spec-value'

export default {
  data() {
    return {
      form: {
        value: '',
        extend: '',
        spec_id: 0,
      },
    }
  },
  methods: {
    async submitForm() {
      const form = { ...this.form }
      const res = await specValue.addSpecValue(form)
      if (res.error_code === 0) {
        this.$message.success(`${res.msg}`)
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
