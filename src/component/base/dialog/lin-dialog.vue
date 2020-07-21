<template>
  <div class="container">
    <el-dialog title="编辑分组" :append-to-body="true" :visible.sync="dialogFormVisible">
      <slot name="content"></slot> <slot name="footer"></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style scoped lang="stylus"></style>
