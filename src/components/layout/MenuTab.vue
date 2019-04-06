<template>
  <div>
    <div v-if="menuTabs.length || show"  style="margin: 0 20px 20px;">
      <ul class="menu-tab">
        <router-link
          :to="tab.path"
          v-for="(tab) in menuTabs"
          :key="tab.path"
          ref="menuTabs">
          <li ref="tabList" class="menu-li">
            <i :class="tab.icon"/>
            <span class="title">{{tab.title | filterTitle}}</span>
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    }
  },
  computed: {
    stageInfo() {
      return this.$store.getters.getStageInfo(this.$route.name)
    },
    menuTabs() {
      if (this.stageInfo.length < 2) {
        return []
      }
      const father = this.stageInfo[this.stageInfo.length - 2]
      if (father.type === 'tab') {
        return father.children.map(item => ({
          icon: item.icon || '',
          title: item.title,
          path: item.route,
        }))
      }
      return []
    },
  },
}
</script>

<style lang="scss" scoped>

.router-link-active {
  background: black;
}

.menu-tab {
  width: 100%;
  height: 50px;
  background: rgba(25, 42, 94, 0.5);
  font-size: 14px;
  font-family: "PingFangSC-Regular";
  font-weight: 400;
  color: rgba(140, 152, 174, 1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .router-link-exact-active,
  .router-link-active {
    height: 47px;
    border-top: 3px solid $theme;
    background: rgba(255, 255, 255, 1);
    color: rgba(57, 99, 188, 1);

    .menu-li {
      margin-top: -3px;
    }
  }

  .menu-li {
    width: 120px;
    height: 50px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .imgIcon {
      width: 16px;
      height: 16px;
      margin: 0 auto;
    }

    .title {
      margin-top: -9px;
    }
  }
}
</style>
