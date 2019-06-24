<template>
  <div class="app-sidebar">
    <div class="logo" v-if="!isCollapse">
      <img src="../../assets/img/logo.png" alt="">
    </div>
    <div class="mobile-logo" v-else>
      <img src="../../assets/img/mobile-logo.png" alt="">
    </div>
    <div style="margin-bottom:50px">
      <el-menu
        class="el-menu-vertical-demo"
        ref="meun"
        :default-active="defaultActive"
        :collapse="isCollapse"
        background-color="#192A5E"
        text-color="rgba(196,201,210,1)"
        active-text-color="#1890ff">
        <template v-for="(item) in sideBarList">
          <el-submenu
            class="subMenuContent"
            v-if="item.children"
            :key="idMap[item.name]"
            :index="idMap[item.name]"
            popper-class="abc">
            <template slot="title">
              <i v-if="!filterIcon(item.icon)" :class="item.icon"></i>
              <img v-else :src="item.icon" class="imgIcon" />
              <span slot="title">{{item.title}}</span>
            </template>

            <!-- 二级菜单 -->
            <template v-for="(subItem) in item.children">
              <el-submenu v-if="subItem.children" :key="idMap[subItem.name]" :index="idMap[subItem.name]" class="subMenuContent">
                <template slot="title">
                  <i class="iconfont icon-erjizhibiao"></i>
                  <span slot="title" class="two-folder">{{subItem.title}}</span>
                </template>

                <!-- 三级菜单 -->
                <router-link
                  v-for="(grandchildItem) in subItem.children"
                  :key="idMap[grandchildItem.name]"
                  :to="grandchildItem.path"
                  class="circle third">
                  <el-menu-item :index="idMap[grandchildItem.name]" style="padding-left: 80px;" class="subMenuContent">
                    {{grandchildItem.title}}
                  </el-menu-item>
                </router-link>
              </el-submenu>
              <!-- 二级else -->
              <router-link
                :to="subItem.path"
                :key="subItem.name"
                class="circle"
                v-else>
                <el-menu-item :index="idMap[subItem.name]" style="padding-left: 60px;" class="subMenuContent">
                  {{subItem.title}}
                </el-menu-item>
              </router-link>

            </template>
          </el-submenu>

          <!-- 一级else -->
          <el-menu-item
            class="subMenuContent"
            :index="idMap[item.name]"
            @click="goto(item.path)"
            v-else
            :key="idMap[item.name]">
            <i v-if="!filterIcon(item.icon)" :class="item.icon"></i>
            <img v-else :src="item.icon" class="imgIcon" />
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>

  </div>
</template>

<script>
import Utils from '@/lin/utils/util'
/* eslint-disable no-restricted-syntax */
import { mapGetters } from 'vuex'

export default {
  props: ['isCollapse'],
  methods: {
    goto(path) {
      this.$router.push({
        path,
      })
    },
    filterIcon(icon) {
      return icon.indexOf('/') !== -1
    },
  },
  computed: {
    // 根据当前路由设置激活侧边栏
    defaultActive() {
      for (let i = (this.stageInfo.length - 1); i >= 0; i -= 1) {
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
          obj.forEach((item) => {
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
      deepTravel(sideBarList, (item) => {
        mapData[item.name] = Utils.getRandomStr()
      })

      return mapData
    },
    imgSrc() {
      return this.isCollapse === false ? '../../assets/img/left-logo.png' : '../../assets/img/logo.png'
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
    position:sticky;
    top:0;
    left:0;
    z-index: 99;

    img {
      width: 110px;
      transition: all 0.3s linear;
    }
  }

  .mobile-logo {
    width: 64px;
    height: 72px;
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
}
</style>
