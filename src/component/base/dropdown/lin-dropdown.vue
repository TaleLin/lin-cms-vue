<template>
  <div class="container">
    <el-dropdown @command="handleCommand">
      <el-button> {{ title }} <i class="el-icon-arrow-down el-icon--right"></i> </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="single in list" :key="single" :command="single"> {{ single }} </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '全部人员',
    },
    list: {
      type: Array,
    },
  },
  data() {
    return {}
  },
  methods: {
    handleCommand(command) {
      this.$emit('command', command)
    },
  },
}
</script>

<style>
.el-dropdown-menu__item:not(.is-disabled):hover,
.el-dropdown-menu__item:focus {
  color: #3963bc;
}
</style>
