<template>
  <PagePanel title="新建用户">
    <div class="content" v-loading="loading">
      <UserInfo :all-groups="allGroups" />
    </div>
  </PagePanel>
</template>

<script setup>
import PagePanel from '@/component/base/page-panel.vue'

import UserInfo from './user-info'
import { useUserCreate } from './use-user-create'

const { allGroups, loading } = useUserCreate()
</script>

<style lang="scss" scoped>
.content {
  min-height: 160px;
}
</style>
