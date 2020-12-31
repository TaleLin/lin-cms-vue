<template>
  <div class="app-sidebar">
    <div class="logo" v-if="!elMenuCollapse"><img src="../../assets/image/logo.png" alt="" /></div>
    <div class="mobile-logo" v-else><img src="../../assets/image/mobile-logo.png" alt="" /></div>
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
        class="el-menu-vertical-demo"
        ref="meun"
        :default-active="defaultActive"
        :collapse="elMenuCollapse"
        background-color="#192A5E"
        text-color="rgba(196,201,210,1)"
        active-text-color="#1890ff"
      >
        <template v-for="item in sideBarList">
          <el-submenu
            class="subMenuContent"
            v-if="item.children"
            :key="idMap[item.name]"
            :index="idMap[item.name]"
            popper-class="abc"
          >
            <template slot="title">
              <i v-if="!filterIcon(item.icon)" :class="item.icon"></i> <img v-else :src="item.icon" class="imgIcon" />
              <span slot="title">{{ item.title }}</span>
            </template>

            <!-- 二级菜单 -->
            <template v-for="subItem in item.children">
              <el-submenu
                v-if="subItem.children"
                :key="idMap[subItem.name]"
                :index="idMap[subItem.name]"
                class="subMenuContent"
              >
                <template slot="title">
                  <i class="iconfont icon-erjizhibiao"></i>
                  <span slot="title" class="two-folder">{{ subItem.title }}</span>
                </template>

                <!-- 三级菜单 -->
                <router-link
                  v-for="grandchildItem in subItem.children"
                  :key="idMap[grandchildItem.name]"
                  :to="grandchildItem.path"
                  class="circle third"
                >
                  <el-menu-item :index="idMap[grandchildItem.name]" style="padding-left: 80px;" class="subMenuContent">
                    {{ grandchildItem.title }}
                  </el-menu-item>
                </router-link>
              </el-submenu>
              <!-- 二级else -->
              <router-link :to="subItem.path" :key="subItem.name" class="circle" v-else>
                <el-menu-item :index="idMap[subItem.name]" style="padding-left: 60px;" class="subMenuContent">
                  {{ subItem.title }}
                </el-menu-item>
              </router-link>
            </template>
          </el-submenu>

          <!-- 一级else -->
          <router-link :to="item.path" :key="item.name" v-else>
            <el-menu-item class="subMenuContent" :index="idMap[item.name]" :key="idMap[item.name]">
              <i v-if="!filterIcon(item.icon)" :class="item.icon"></i> <img v-else :src="item.icon" class="imgIcon" />
              <span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Utils from '@/lin/util/util'
import Config from '../../config/index'

export default {
  data() {
    return {
      sidebar: '',
      groups: [],
      showSidebarSearch: Config.showSidebarSearch,
      showSearchList: false,
    }
  },
  inject: ['eventBus'],
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
    this.eventBus.$on('removeSidebarSearch', () => {
      this.showSidebarSearch = false
    })
    this.eventBus.$on('showSidebarSearch', () => {
      if (Config.showSidebarSearch) {
        this.showSidebarSearch = true
      }
    })
  },
  methods: {
    filterIcon(icon) {
      return icon.indexOf('/') !== -1
    },
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

      deepTravel(this.sideBarList, viewConfig => {
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
    // 根据当前路由设置激活侧边栏
    defaultActive() {
      for (let i = this.stageInfo.length - 1; i >= 0; i -= 1) {
        if (this.idMap[this.stageInfo[i].name]) {
          return this.idMap[this.stageInfo[i].name]
        }
      }
      return ''
    },
    stageInfo() {
      return this.$store.getters.getStageInfo(this.$route.name)
    },
    // 由于index不支持symbol格式, 因此使用 idMap 进行映射
    idMap() {
      const { sideBarList } = this
      const mapData = {}
      const deepTravel = (obj, fuc) => {
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            deepTravel(item, fuc)
          })
          return
        }
        if (obj && obj.children) {
          fuc(obj)
          deepTravel(obj.children, fuc)
          return
        }
        if (obj.name) {
          fuc(obj)
        }
      }
      deepTravel(sideBarList, item => {
        mapData[item.name] = Utils.getRandomStr()
      })

      return mapData
    },
    imgSrc() {
      return this.elMenuCollapse === false ? '../../assets/image/left-logo.png' : '../../assets/image/logo.png'
    },
    ...mapGetters(['sideBarList']),
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

  .subMenuContent {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .logo {
    width: $sidebar-width;
    height: $header-height;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fff;
    transition: all 0.5s ease-in-out;
    background-color: #122150;
    transition: all 0.3s linear;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 99;

    img {
      width: 120px;
      transition: all 0.3s linear;
    }
  }

  .mobile-logo {
    width: 64px;
    height: 86px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #122150;
    transition: all 0.3s linear;

    img {
      width: 40px;
      height: 40px;
      transition: all 0.3s linear;
    }
  }

  .imgIcon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    margin-left: 5px;
    display: inline-block;
    transform: translateY(21px);
  }

  .iconfont {
    margin-right: 10px;
    margin-left: 5px;
    color: $submenu-title;
    height: $menuItem-height;
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
