<template>
  <div class="container">
    <div class="title">
      <span>{{ isCreate? '新建SKU':'更新SKU' }}</span>
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

            <el-form-item label="价格" prop="price">
              <el-input-number v-model="form.price" :precision="2" :step="0.1"></el-input-number>
            </el-form-item>

            <el-form-item label="折扣" prop="discount">
              <el-input-number v-model="form.discount" :precision="2" :step="0.1" :max="1"></el-input-number>
            </el-form-item>

            <el-form-item v-if="!isCreate" label="编码" prop="code">
              <el-input disabled size="medium" v-model="form.code" placeholder="请填写编码"></el-input>
            </el-form-item>

            <el-form-item label="货币类型" prop="currency">
              <el-input size="medium" v-model="form.currency" placeholder="请填写货币类型"></el-input>
            </el-form-item>

            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="form.stock" :step="1" step-strictly></el-input-number>
            </el-form-item>

            <el-form-item label="SPU" prop="spu_id">
              <el-autocomplete
                @focus="loadSpuSuggestions"
                popper-class="my-autocomplete"
                class="inline-input"
                v-model="spuState"
                :fetch-suggestions="querySpuSearch"
                placeholder="请填写所属分类"
                @select="handleSpuSelect"
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

            <el-form-item label="选择规格" prop="specs">
              <el-cascader :props="cascaderProps"></el-cascader>
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
import sku from '@/models/sku'
// import specKey from '@/models/spec-key'
import UploadImgs from '@/components/base/upload-imgs'

let id = 0

export default {
  components: {
    UploadImgs,
  },
  props: {
    isCreate: {
      type: Boolean,
      default: false,
    },
    skuId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        title: '',
        on_sale: 1,
        price: null,
        discount: null,
        currency: null,
        code: null,
        stock: null,
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
      spuState: '',
      spuSuggestions: [],
      cascaderProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          console.log(node)
          const { level } = node
          setTimeout(() => {
            // eslint-disable-next-line
            const nodes = Array.from({ length: level + 1 }).map(item => ({
              value: ++id,
              label: `选项${id}`,
              leaf: level >= 2,
            }))
            // 通过调用resolve将子节点数据返回，通知组件数据加载完成
            resolve(nodes)
          }, 1000)
        },
      },
    }
  },
  watch: {
    saled(val) {
      this.form.on_sale = val ? 1 : 0
    },
  },
  async mounted() {
    if (!this.isCreate) {
      const res = await sku.getSkuWithName(this.skuId)
      this.form = res
      const initData = [
        {
          id: res.id,
          display: res.img,
        },
      ]
      this.saled = res.on_sale === 1
      this.initData = initData
      this.spuState = res.spu_name
    }
  },
  methods: {
    async submitForm(formName) {
      await this.getValue()
      try {
        const postData = { ...this.form }
        let res
        if (this.isCreate) {
          res = await sku.addSku(postData)
        } else {
          res = await sku.editSku(this.skuId, postData)
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
    querySpuSearch(queryString, cb) {
      // eslint-disable-next-line
      const suggestions = this.spuSuggestions
      const results = queryString
        ? suggestions.filter(this.createSpuFilter(queryString))
        : suggestions
      cb(results)
    },
    createSpuFilter(queryString) {
      // eslint-disable-next-line
      return suggestion => {
        return (
          suggestion.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSpuSelect(item) {
      this.spuState = item.name
      this.form.spu_id = item.id
    },
    async getValue() {
      const val = await this.$refs.uploadEle.getValue()
      this.form.img = val[0].display
    },
    back() {
      this.$emit('editClose')
    },
    async loadSpuSuggestions() {
      if (this.spuSuggestions.length > 0) {
        return
      }
      try {
        if (!this.isCreate) {
          this.spuSuggestions = await spu.getSuggestions(
            // eslint-disable-next-line
            this.form.spu_id
          )
        } else {
          this.spuSuggestions = await spu.getSuggestions(null)
        }
      } catch (error) {
        this.$message.error('获取SPU建议信息失败')
        console.log(error)
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
