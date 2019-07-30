<template>
  <div class="container">
    <div class="title">
      <span>{{ isCreate? '新建SPU':'更新SPU' }}</span>
      <span class="back" @click="back">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="标题" prop="title">
              <el-input size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
            </el-form-item>
            <el-form-item label="副标题" prop="subtitle">
              <el-input size="medium" v-model="form.subtitle" placeholder="请填写副标题"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input size="medium" v-model="form.price" placeholder="请填写价格"></el-input>
            </el-form-item>
            <el-form-item label="分类" prop="category_id">
              <el-autocomplete
                @focus="loadCategorySuggestions"
                popper-class="my-autocomplete"
                class="inline-input"
                v-model="categoryState"
                :fetch-suggestions="queryCategorySearch"
                placeholder="请填写所属分类"
                @select="handleCategorySelect"
              >
                <template slot-scope="{ item }">
                  <span class="id">{{ item.id }}</span>
                  <span class="name">{{ item.name }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="品牌" prop="brand_id">
              <!-- <el-input size="medium" v-model="form.brand_id" placeholder="请填写所属品牌"></el-input> -->
              <el-autocomplete
                @focus="loadBrandSuggestions"
                popper-class="my-autocomplete"
                class="inline-input"
                v-model="brandState"
                :fetch-suggestions="queryBrandSearch"
                placeholder="请填写所属分类"
                @select="handleBrandSelect"
              >
                <template slot-scope="{ item }">
                  <span class="id">{{ item.id }}</span>
                  <span class="name">{{ item.name }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="规格值" prop="sketch_spec_id">
              <!-- <el-input size="medium" v-model="form.sketch_spec_id" placeholder="请填写默认规格值id"></el-input> -->
              <el-autocomplete
                @focus="loadSpecKeySuggestions"
                popper-class="my-autocomplete"
                class="inline-input"
                v-model="specKeyState"
                :fetch-suggestions="querySpecKeySearch"
                placeholder="请填写默认规格值id"
                @select="handleSpecKeySelect"
              >
                <template slot-scope="{ item }">
                  <span class="id">{{ item.id }}</span>
                  <span class="name">{{ item.name }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>
            <el-form-item label="sku" prop="default_sku_id">
              <el-autocomplete
                @focus="loadSkuSuggestions"
                popper-class="my-autocomplete"
                class="inline-input"
                v-model="skuState"
                :fetch-suggestions="querySkuSearch"
                placeholder="请填写默认sku id"
                @select="handleSkuSelect"
              >
                <template slot-scope="{ item }">
                  <span class="id">{{ item.id }}</span>
                  <span class="name">{{ item.name }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>

            <el-form-item label="是否上架">
              <el-switch
                size="medium"
                v-model="saled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="上架"
                inactive-text="下架"
              ></el-switch>
            </el-form-item>

            <el-form-item label="图片" prop="img">
              <upload-imgs :max-num="maxNum" ref="uploadEle" :value="initData" />
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
import spu from '@/models/spu'
import category from '@/models/category'
import brand from '@/models/brand'
import sku from '@/models/sku'
import specKey from '@/models/spec-key'
import UploadImgs from '@/components/base/upload-imgs'

export default {
  components: {
    UploadImgs,
  },
  props: {
    isCreate: {
      type: Boolean,
      default: false,
    },
    spuId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        title: '',
        subtitle: '',
        category_id: null,
        on_sale: 1,
        brand_id: null,
        price: null,
        sketch_spec_id: null,
        default_sku_id: null,
        img: null,
      },
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      initData: [],
      maxNum: 1,
      saled: false,
      categoryState: '',
      brandState: '',
      specKeyState: '',
      skuState: '',
      categorySuggestions: [],
      brandSuggestions: [],
      specKeySuggestions: [],
      skuSuggestions: [],
    }
  },
  watch: {
    saled(val) {
      this.form.on_sale = val ? 1 : 0
    },
  },
  async mounted() {
    if (!this.isCreate) {
      const res = await spu.getSpuWithNames(this.spuId)
      this.form = res
      const initData = [
        {
          id: res.id,
          display: res.img,
        },
      ]
      this.saled = res.on_sale === 1
      this.initData = initData
      this.specKeyState = res.sketch_spec_name
      this.brandState = res.brand_name
      this.categoryState = res.category_name
    }
  },
  methods: {
    async submitForm(formName) {
      await this.getValue()
      try {
        const postData = { ...this.form }
        let res
        if (this.isCreate) {
          res = await spu.addSpu(postData)
        } else {
          res = await spu.editSpu(this.spuId, postData)
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
    queryCategorySearch(queryString, cb) {
      // eslint-disable-next-line
      const suggestions = this.categorySuggestions
      const results = queryString
        ? suggestions.filter(this.createCategoryFilter(queryString))
        : suggestions
      cb(results)
    },
    queryBrandSearch(queryString, cb) {
      // eslint-disable-next-line
      const suggestions = this.brandSuggestions
      const results = queryString
        ? suggestions.filter(this.createCategoryFilter(queryString))
        : suggestions
      cb(results)
    },
    querySpecKeySearch(queryString, cb) {
      // eslint-disable-next-line
      const suggestions = this.specKeySuggestions
      const results = queryString
        ? suggestions.filter(this.createCategoryFilter(queryString))
        : suggestions
      cb(results)
    },
    querySkuSearch(queryString, cb) {
      // eslint-disable-next-line
      const suggestions = this.skuSuggestions
      const results = queryString
        ? suggestions.filter(this.createCategoryFilter(queryString))
        : suggestions
      cb(results)
    },
    createCategoryFilter(queryString) {
      // eslint-disable-next-line
      return suggestion => {
        return (
          suggestion.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleCategorySelect(item) {
      this.categoryState = item.name
      this.form.category_id = item.id
    },
    handleBrandSelect(item) {
      this.brandState = item.name
      this.form.brand_id = item.id
    },
    handleSpecKeySelect(item) {
      this.specKeyState = item.name
      this.form.sketch_spec_id = item.id
    },
    handleSkuSelect(item) {
      this.skuState = item.name
      this.form.default_sku_id = item.id
    },
    async getValue() {
      const val = await this.$refs.uploadEle.getValue()
      this.form.img = val[0].display
    },
    back() {
      this.$emit('editClose')
    },
    async loadCategorySuggestions() {
      if (this.categorySuggestions.length > 0) {
        return
      }
      try {
        if (!this.isCreate) {
          this.categorySuggestions = await category.getSuggestions(
            // eslint-disable-next-line
            this.form.category_id
          )
        } else {
          this.categorySuggestions = await category.getSuggestions(null)
        }
      } catch (error) {
        this.$message.error('获取分类建议信息失败')
        console.log(error)
      }
    },
    async loadBrandSuggestions() {
      if (this.brandSuggestions.length > 0) {
        return
      }
      try {
        if (!this.isCreate) {
          this.brandSuggestions = await brand.getSuggestions(
            // eslint-disable-next-line
            this.form.brand_id
          )
        } else {
          this.brandSuggestions = await brand.getSuggestions(null)
        }
      } catch (error) {
        this.$message.error('获取品牌建议信息失败')
        console.log(error)
      }
    },
    async loadSpecKeySuggestions() {
      if (this.specKeySuggestions.length > 0) {
        return
      }
      try {
        if (!this.isCreate) {
          this.specKeySuggestions = await specKey.getSuggestions(
            // eslint-disable-next-line
            this.form.sketch_spec_id
          )
        } else {
          this.specKeySuggestions = await specKey.getSuggestions(null)
        }
      } catch (error) {
        this.$message.error('获取规格键建议信息失败')
        console.log(error)
      }
    },
    async loadSkuSuggestions() {
      if (this.skuSuggestions.length > 0) {
        return
      }
      // 如果新建spu，则没有sku，不用建议
      if (!this.isCreate) {
        this.skuSuggestions = await sku.getSuggestions(
          this.spuId,
          // eslint-disable-next-line
          this.form.default_sku_id
        )
      }
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

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    display: inline-flex;
    align-content: space-around;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .id {
      margin-right: 15px;
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
