<template>
  <div class="app-sidebar">
    <div class="logo" v-if="!isCollapse">
      <img src="../../assets/img/logo.png" alt="">
    </div>
    <div class="mobile-logo" v-else>
      <img src="../../assets/img/mobile-logo.png" alt="">
    </div>
    <div class="app-sidebar-second">
      <el-menu
        class="el-menu-vertical-demo"
        ref="meun"
        @open="handleOpen"
        @close="handleClose"
        :default-active="defaultActive"
        :collapse="isCollapse"
        background-color="#192A5E"
        text-color="rgba(196,201,210,1)"
        active-text-color="#1890ff">
        <template v-for="(item, index) in sideBarList">
          <el-submenu
            v-if="item.children"
            :key="'sidenav_' + index"
            :index="indexToString(index++)"
            popper-class="abc">
            <template slot="title">
              <!-- <img v-if="item.meta.src" :src="item.meta.src" class="imgIcon" />
              <i v-else :class="item.meta.icon"></i> -->
              <i :class="item.icon"/>
              <span slot="title">{{item.title}}</span>
            </template>
            <el-menu-item-group>
              <router-link
                v-for="(subItem, subIndex) in item.children"
                :to="subItem.path"
                :key="'sidenav_' + index + subIndex">
                <el-menu-item
                  :index="index - 1 + '-' + indexToString(subIndex++)"
                  style="padding-left: 60px;">
                  {{subItem.title}}
                </el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
          <!-- 分割线 -->
          <el-menu-item
            :index="indexToString(index++)"
            @click="goto(item.path)"
            v-else
            :key="item.path">
            <!-- <img v-if="item.meta.src" :src="item.meta.src" class="imgIcon" />
            <i v-else :class="{[item.meta.icon]: item.meta.icon}"></i> -->
            <i :class="item.icon" />
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
          <!-- </router-link> -->
        </template>
      </el-menu>
    </div>

  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax */
import { mapGetters } from 'vuex'

export default {
  props: ['isCollapse'],
  data() {
    return {
      arr: [],
      itemIndex: 0,
    }
  },
  methods: {
    goto(path) {
      this.$router.push({
        path,
      })
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    // 路由标志位
    indexToString(num) {
      this.itemIndex = num
      return num.toString()
    },
  },
  computed: {
    imgSrc() {
      return this.isCollapse === false ? '../../assets/img/left-logo.png' : '../../assets/img/logo.png'
    },
    ...mapGetters(['defaultActive', 'sideBarList', 'auths', 'user']),
  },
}
</script>

<style lang="scss">
@import "~assets/styles/variable.scss";

.app-sidebar {
  background: #192a5e;
  padding-right: 0px;

  .logo {
    width: $sidebar-width;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fff;
    transition: all 0.5s ease-in-out;
    background-color: #122150;
    transition: all 0.3s linear;

    img {
      width: 110px;
      height: 60px;
      padding: 3px 0px;
      transition: all 0.3s linear;
    }
  }

  .mobile-logo {
    width: 50px;
    background-color: #122150;
    transition: all 0.3s linear;

    img {
      width: 40px;
      height: 40px;
      padding: 13px 5px;
      transition: all 0.3s linear;
    }
  }

  .app-sidebar-second {
    width: $sidebar-width + 30px;
    position: absolute;
    top: 66px;
    left: 0;
    bottom: 0;
    padding-bottom: 20px;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .imgIcon {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    display: inline-block;
    transform: translateY(5px);
  }

  .iconfont {
    margin-right: 10px;
    color: $submenu-title;
    height: $menuItem-height;
  }
}
</style>
