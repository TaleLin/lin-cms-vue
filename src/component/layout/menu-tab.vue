<template>
  <div>
    <div v-if="menuTabs.length || show">
      <ul class="menu-tab">
        <router-link :to="tab.path" v-for="tab in menuTabs" :key="tab.path" ref="menuTabs">
          <li ref="tabList" class="menu-li">
            <i :class="tab.icon" /> <span class="title">{{ tab.title | filterTitle }}</span>
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
        const menus = []
        father.children.forEach(item => {
          if (item.inNav) {
            menus.push({
              icon: item.icon || '',
              title: item.title,
              path: item.route,
            })
          }
        })
        return menus
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
  height: 38px;
  line-height: 38px;
  background: $reuse-tab-item-background;
  font-size: 14px;
  font-weight: 400;
  color: rgba(140, 152, 174, 1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  .router-link-exact-active,
  .router-link-active {
    background: $appmain-background;
    color: $theme;
  }

  .menu-li {
    width: 120px;
    height: 38px;
    cursor: pointer;
    display: flex;
    justify-content: center;

    .imgIcon {
      width: 16px;
      height: 16px;
      margin: 0 auto;
    }
    .title {
      margin-left: 5px;
    }
  }
}
</style>
