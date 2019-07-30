<template>
  <div class="container">
    <div class="title">
      <span>{{ isCreate? '新建品牌':'更新品牌' }}</span>
      <span class="back" @click="back">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="品牌名" prop="name">
              <el-input size="medium" v-model="form.name" placeholder="请填写品牌名"></el-input>
            </el-form-item>
            <el-form-item label="品牌描述" prop="description">
              <el-input size="medium" v-model="form.description" placeholder="请填写品牌描述"></el-input>
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
import brand from '@/models/brand'

export default {
  props: {
    isCreate: {
      type: Boolean,
      default: false,
    },
    brandId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
      },
    }
  },
  async mounted() {
    if (!this.isCreate) {
      const res = await brand.getBrand(this.brandId)
      this.form = res
    }
  },
  methods: {
    async submitForm(formName) {
      try {
        const postData = { ...this.form }
        let res
        if (this.isCreate) {
          postData.brand_id = this.brandId
          res = await brand.addBrand(postData)
        } else {
          res = await brand.editBrand(this.brandId, postData)
        }
        if (res.error_code === 0) {
          this.$message.success(`${res.msg}`)
          this.$emit('editClose')
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
    back() {
      this.$emit('editClose')
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
