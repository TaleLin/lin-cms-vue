<template>
  <div class="container">
    <el-input placeholder="请输入内容"
              clearable
              v-model="keyword"
              class="input-with-select">
      <el-button slot="append"
                 icon="el-icon-search"></el-button>
    </el-input>
  </div>
</template>

<script>
import Utils from 'lin/utils/util'

export default {
  data() {
    return {
      keyword: '',
    }
  },
  created() {
    // 节流搜索
    this.$watch('keyword', Utils.debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 1000))
  },
  methods: {
    clear() {
      this.keyword = ''
    },
  },
}
</script>
