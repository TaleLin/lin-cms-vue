<template>
  <div class="container">
    <div class="title">新建规格键</div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="规格键名" prop="name">
              <el-input size="medium" v-model="form.name" placeholder="请填写规格键名"></el-input>
            </el-form-item>
            <el-form-item label="规格键描述" prop="description">
              <el-input size="medium" v-model="form.description" placeholder="请填写规格键描述"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit">
              <el-input size="medium" v-model="form.unit" placeholder="请填写单位，如：英寸"></el-input>
              <!-- <el-button @click.prevent="clearItem(form.unit)">重 置</el-button> -->
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
    </div>
  </div>
</template>

<script>
import specKey from '@/models/spec-key'

export default {
  data() {
    return {
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
  },
  methods: {
    async submitForm(formName) {
      try {
        const postData = { ...this.form }
        postData.standard = this.isStandard ? 1 : 0
        const res = await specKey.addSpecKey(postData)
        if (res.error_code === 0) {
          this.$message.success(`${res.msg}`)
          this.resetForm(formName)
        }
      } catch (error) {
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
