<template>
  <div>
    <el-input
      :placeholder="placeholder"
      clearable
      v-model="keyword"
      class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
  </div>
</template>

<script>
import Utils from 'lin/utils/util'

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

<style lang="scss">

</style>
