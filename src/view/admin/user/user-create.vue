<template>
  <div class="container">
    <div class="title">新建用户</div>
    <div class="wrap" v-loading="loading">
      <UserInfo :all-groups="allGroups" />
    </div>
  </div>
</template>

<script setup>
import UserInfo from './user-info'
import { useUserCreate } from './use-user-create'

const { allGroups, loading } = useUserCreate()
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    padding: 0 40px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 20px;
  }
}
</style>
