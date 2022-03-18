<template>
  <div v-if="showSidebarSearch" style="margin-top: 15px">
    <div class="search-display" v-if="!showSearchList" @click="toSearch"><i class="el-icon-search"></i></div>
    <el-select
      clearable
      filterable
      class="search"
      v-model="sidebar"
      ref="searchInput"
      v-if="showSearchList"
      :filter-method="search"
      @change="handleChange"
      placeholder="请输入关键字"
    >
      <el-option v-for="item in groups" :key="item.key" :label="item.title" :value="item.path"> </el-option>
    </el-select>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import emitter from 'lin/util/emitter'

import Config from '@/config/index'

export default {
  data() {
    return {
      groups: [],
      sidebar: '',
      showSearchList: false,
      showSidebarSearch: Config.showSidebarSearch,
    }
  },
  computed: {
    ...mapGetters(['sidebarList']),
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
}
</script>

<style lang="scss" scoped>
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
  width: 80%;
}
</style>
