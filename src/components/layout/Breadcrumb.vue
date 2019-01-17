<template>
  <div class="nav-title">
    <a class="item"
       v-for="(item) in titleArr"
       style="cursor: default;"
       :key="item.path">
      <!-- <i v-if="index===0"
         :class="item.meta.icon"></i> -->
      <p>{{item.meta.title}}</p>
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      titleArr: [],
    }
  },
  created() { },
  mounted() {
    const to = this.$route
    // eslint-disable-next-line
    for (const i in to.matched) {
      if (to.matched[i].path) {
        this.titleArr.push({
          path: to.matched[i].path,
          meta: to.matched[i].meta,
        })
      }
    }
  },

  watch: {
    $route(to) {
      this.titleArr = []
      // eslint-disable-next-line
      for (const i in to.matched) {
        if (to.matched[i].path) {
          this.titleArr.push({
            path: to.matched[i].path,
            meta: to.matched[i].meta,
          })
        }
      }
    },
  },
  components: {},
}
</script>

<style type="text/scss" lang="scss" socped>
.nav-title {
  display: flex;
  align-items: center;
  font-size: 14px;
  .item {
    i {
      margin-right: 4px;
    }
    display: flex;
    align-items: center;
    padding-right: 18px;
    position: relative;
    color: rgba(89, 108, 142, 1);
    &:after {
      content: "/";
      position: absolute;
      top: 0;
      right: 6px;
    }
  }
  .item:last-child {
    color: #fff;
    padding-right: 0;
    &:after {
      content: "";
    }
  }
}
</style>
