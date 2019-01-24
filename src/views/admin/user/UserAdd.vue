<template>
  <div class="container">
    <div class="title">新建用户</div>
    <lin-1px></lin-1px>
    <div class="wrap">
      <user-info :groups="groups" />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Admin from '@/lin/models/admin'
import UserInfo from './UserInfo'

export default {
  components: {
    UserInfo,
  },
  data() {
    return {
      groups: [],
    }
  },
  async created() {
    try {
      this.loading = true
      this.groups = await Admin.getAllGroups()
      this.loading = false
    } catch (e) {
      this.loading = false
      console.log(e)
    }
  },
}
</script>

<style scoped lang="scss">
@import "~assets/styles/variable.scss";
.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    text-indent: 40px;
  }
  .wrap {
    padding: 0px 20px;
  }
}
</style>
