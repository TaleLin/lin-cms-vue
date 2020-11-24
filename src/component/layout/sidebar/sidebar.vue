<template>
  <div class="app-sidebar">
    <logo :elMenuCollapse="elMenuCollapse" />
    <div style="margin-bottom:50px">
      <div v-if="showSidebarSearch" style="margin-top: 15px">
        <div class="search-display" v-if="!showSearchList" @click="toSearch"><i class="el-icon-search"></i></div>
        <el-select
          v-if="showSearchList"
          size="medium"
          filterable
          clearable
          :filter-method="search"
          v-model="sidebar"
          @change="handleChange"
          class="search"
          placeholder="请输入关键字"
          ref="searchInput"
        >
          <el-option v-for="item in groups" :key="item.key" :label="item.title" :value="item.path"> </el-option>
        </el-select>
      </div>
      <el-menu
        ref="meun"
        class="el-menu-vertical-demo"
        :default-active="defaultActive"
        :collapse="elMenuCollapse"
        background-color="#192A5E"
        text-color="rgba(196,201,210,1)"
        active-text-color="#1890ff"
      >
        <menu-tree v-for="item in sidebarList" :key="item.path" :item="item"></menu-tree>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import emitter from 'lin/util/emitter'
import Config from '@/config/index'
import MenuTree from './menu-tree'
import Logo from './logo'

export default {
  components: { MenuTree, Logo },
  data() {
    return {
      sidebar: '',
      groups: [],
      showSearchList: false,
      showSidebarSearch: Config.showSidebarSearch,
    }
  },
  props: {
    isPhone: {
      type: Boolean,
      default: false,
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    emitter.on('removeSidebarSearch', () => {
      this.showSidebarSearch = false
    })
    emitter.on('showSidebarSearch', () => {
      if (Config.showSidebarSearch) {
        this.showSidebarSearch = true
      }
    })
  },
  methods: {
    handleChange(val) {
      this.groups = []
      this.sidebar = ''
      this.showSearchList = false
      this.$router.push(val)
    },
    toSearch() {
      this.showSearchList = true
      setTimeout(() => {
        this.$refs.searchInput.focus()
      }, 200)
    },
    search(val) {
      // if (!val) {
      //   this.showSearchList = false
      //   return
      // }
      this.groups = []

      // 深度遍历配置树, 摘取叶子节点作为路由部分
      function deepTravel(config, fuc) {
        if (Array.isArray(config)) {
          config.forEach(subConfig => {
            deepTravel(subConfig, fuc)
          })
        } else if (config.children) {
          config.children.forEach(subConfig => {
            deepTravel(subConfig, fuc)
          })
        } else {
          fuc(config)
        }
      }

      deepTravel(this.sidebarList, viewConfig => {
        // 构造舞台view路由
        if (viewConfig.title.includes(val)) {
          const viewRouter = {}
          viewRouter.path = viewConfig.path
          viewRouter.title = viewConfig.title
          viewRouter.key = Math.random()
          this.groups.push(viewRouter)
        }
      })
    },
  },
  computed: {
    elMenuCollapse() {
      if (this.isPhone) {
        return false
      }

      return this.isCollapse
    },
    /**
     * 根据当前路由设置激活侧边栏
     */
    defaultActive() {
      const route = this.$route
      return route.path
    },
    ...mapGetters(['sidebarList']),
  },
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}

.app-sidebar {
  background: #192a5e;

  &::-webkit-scrollbar {
    width: 0px;
    height: 0px;
  }

  .search-display {
    position: relative;
    width: 80%;
    margin: 0 auto;
    height: 36px;
    border-bottom: 1px rgb(185, 190, 195) solid;
    cursor: pointer;

    .el-icon-search {
      position: absolute;
      left: 1px;
      top: 10px;
      color: rgb(185, 190, 195);
    }
  }

  .search {
    // margin-top: 20px;
    width: 80%;
  }
}
</style>
