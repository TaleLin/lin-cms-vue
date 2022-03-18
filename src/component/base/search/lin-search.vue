<template>
  <div class="lin-search">
    <el-input :placeholder="placeholder" clearable v-model="keyword" class="input-with-select">
      <template #suffix>
        <i class="el-input__icon el-icon-search" @click="search"></i>
      </template>
    </el-input>
  </div>
</template>

<script>
import Utils from 'lin/util/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '请输入内容',
    },
  },
  data() {
    return {
      keyword: '',
    }
  },
  created() {
    // 节流搜索
    this.$watch(
      'keyword',
      Utils.debounce(newQuery => {
        this.$emit('query', newQuery)
      }, 1000),
    )
  },
  methods: {
    clear() {
      this.keyword = ''
    },
    search() {
      this.$emit('query', this.keyword)
    },
  },
}
</script>
<style lang="scss" scoped>
.lin-search :v-deep(.el-input__inner) {
  width: 150px;
  border-radius: 20px;
  transition: all 0.2s linear;

  &:focus {
    width: 250px;
    transition: all 0.3s linear;
  }
}
.lin-search :v-deep(.el-input__suffix) {
  cursor: pointer;
}
</style>
