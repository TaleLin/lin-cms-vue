<template>
  <div class="container">
    <div class="title">
      <span>{{ isCreate? '添加BannerItem' : '修改BannerItem' }}</span>
      <span class="back" @click="back">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
    <el-divider></el-divider>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <!-- <el-form-item label="图片" prop="img">
              <el-input size="medium" v-model="form.img" placeholder="请上传图片"></el-input>
            </el-form-item>-->
            <el-form-item label="图片" prop="img">
              <upload-imgs :max-num="maxNum" ref="uploadEle" :value="initData" />
            </el-form-item>

            <el-form-item label="关键字" prop="key_word">
              <el-input size="medium" v-model="form.key_word" placeholder="请填写关键字"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-input size="medium" v-model="form.type" placeholder="请填写类型"></el-input>
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
import bannerItem from '@/models/banner-item'
import UploadImgs from '@/components/base/upload-imgs'

export default {
  components: {
    UploadImgs,
  },
  props: {
    editID: {
      type: Number,
    },
    isCreate: {
      type: Boolean,
      default: false,
    },
    bannerId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      maxNum: 1,
      form: {
        img: '',
        key_word: '',
        type: null,
      },
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      initData: [],
    }
  },
  async mounted() {
    if (!this.isCreate) {
      const res = await bannerItem.getBannerItem(this.editID)
      const initData = [
        {
          id: res.id,
          display: res.img,
        },
      ]
      this.initData = initData
      this.form = res
    }
  },
  methods: {
    async getValue() {
      const val = await this.$refs.uploadEle.getValue()
      this.form.img = val[0].display
    },
    async submitForm() {
      await this.getValue()
      const form = { ...this.form }
      // eslint-disable-next-line
      let res
      if (this.isCreate) {
        form.banner_id = this.bannerId
        res = await bannerItem.addBannerItem(form)
      } else {
        res = await bannerItem.editBannerItem(this.editID, form)
      }
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
