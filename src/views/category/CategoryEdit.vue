<template>
  <div class="container">
    <div class="title">
      <span>{{ isCreate? '新建分类' : '更新分类' }}</span>
      <span class="back" @click="back">
        <i class="iconfont icon-fanhui"></i> 返回
      </span>
    </div>
    <div class="wrap">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <el-form :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
            <el-form-item label="分类名" prop="name">
              <el-input size="medium" v-model="form.name" placeholder="请填写分类名"></el-input>
            </el-form-item>
            <el-form-item label="父分类" prop="parent_id">
              <!-- <el-input size="medium" v-model="form.parent_id" placeholder="请填写父分类"></el-input> -->

              <el-autocomplete
                popper-class="my-autocomplete"
                class="inline-input"
                v-model="state"
                :fetch-suggestions="querySearch"
                placeholder="请填写父分类"
                @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <span class="id">{{ item.id }}</span>
                  <span class="name">{{ item.name }}</span>
                </template>
              </el-autocomplete>
            </el-form-item>

            <el-form-item label="是否root">
              <el-switch
                size="medium"
                v-model="rooted"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="root"
                inactive-text="非root"
              ></el-switch>
            </el-form-item>

            <el-form-item label="分类描述" prop="description">
              <el-input size="medium" v-model="form.description" placeholder="请填写分类描述"></el-input>
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
import category from '@/models/category'

export default {
  props: {
    isCreate: {
      type: Boolean,
      default: false,
    },
    categoryId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      state: '',
      suggestions: [],
      rooted: false,
      form: {
        name: '',
        is_root: 0,
        parent_id: null,
        description: '',
      },
    }
  },
  async mounted() {
    if (!this.isCreate) {
      const res = await category.getCategory(this.categoryId)
      this.form = res
    }
    this.loadSuggestions()
  },
  watch: {
    state(val) {
      if (val.trim() === '') {
        this.form.parent_id = null
      }
    },
    rooted(val) {
      this.form.is_root = val ? 1 : 0
    },
  },
  methods: {
    async submitForm(formName) {
      try {
        const postData = { ...this.form }
        let res
        if (this.isCreate) {
          res = await category.addCategory(postData)
        } else {
          res = await category.editCategory(this.categoryId, postData)
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
    querySearch(queryString, cb) {
      // eslint-disable-next-line
      const suggestions = this.suggestions
      const results = queryString
        ? suggestions.filter(this.createFilter(queryString))
        : suggestions
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      // eslint-disable-next-line
      return suggestion => {
        return (
          suggestion.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    handleSelect(item) {
      this.state = item.name
      this.form.parent_id = item.id
    },
    async loadSuggestions() {
      try {
        if (!this.isCreate) {
          this.suggestions = await category.getSuggestions(this.categoryId)
        } else {
          this.suggestions = await category.getSuggestions(null)
        }
      } catch (error) {
        this.$message.error('获取分类建议信息失败')
        console.log(error)
      }
      // eslint-disable-next-line
      const hit = this.suggestions.filter(val => {
        return val.id === this.form.parent_id
      })
      if (hit.length > 0) {
        this.state = hit[0].name
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
