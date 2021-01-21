<template>
  <div class="container">
    <div class="title">新建用户</div>
    <div class="wrap"><user-info :allGroups="allGroups" /></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Admin from '@/lin/model/admin'
import UserInfo from './user-info'

export default {
  components: {
    UserInfo,
  },
  setup() {
    const allGroups = ref([])
    const loading = ref(false)

    onMounted(async () => {
      try {
        loading.value = true
        allGroups.value = await Admin.getAllGroups()
        loading.value = false
      } catch (e) {
        loading.value = false
        console.error(e)
      }
    })

    return {
      loading,
      allGroups,
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;
    border-bottom: 1px solid #dae1ec;
  }

  .wrap {
    padding: 0px 20px;
  }
}
</style>
