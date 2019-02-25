<template>
  <div style="height:100%;">
    <el-container>
      <el-aside :width="sideBarWidth">
        <side-bar :isCollapse="isCollapse"
                  class="sidebar"></side-bar>
      </el-aside>
      <el-container class="el-container-right">
        <el-header>
          <div class="operate">
            <i class="iconfont icon-fold"
               :class="{rotate: foldState}"
               @click="changeSlidebarState"></i>
            <i class="iconfont icon-up"
               :class="{rotate: upState}"
               @click="changeReuseState"></i>
            <nav-bar></nav-bar>
          </div>
          <el-collapse-transition>
            <reuse-tab v-show="showReuseTab"></reuse-tab>
          </el-collapse-transition>
        </el-header>
        <el-main ref="main">
          <menu-tab></menu-tab>
          <app-main ref="appMain"
                    class="app-main"></app-main>
        </el-main>
        <back-top :right="50"
                  :bottom="50"
                  :fontSize="24"></back-top>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {
  NavBar,
  SideBar,
  AppMain,
  ReuseTab,
  MenuTab,
  BackTop,
} from '@/components/layout'
import layoutMixin from 'lin/mixin/layout.js'

const navBarHeight = 66 // header高度
const reuseTabHeight = 70 // 历史记录栏高度
const marginHeight = 20 // 历史记录栏与舞台的间距
const totalHeight = navBarHeight + reuseTabHeight + marginHeight

export default {
  name: 'layout',
  data() {
    return {
      isCollapse: false, // 左侧菜单栏是否折叠
      sideBarWidth: '170px', // 左侧菜单栏展开的宽度
      clientWidth: 0, // 页面宽度
      clientHeight: 0, // 页面高度
      foldState: false, // 控制左侧菜单栏按键
      upState: false, // 控制历史记录栏按键
      showReuseTab: true, // 是否显示历史记录栏
    }
  },
  mounted() {
    const _this = this
    this.setResize()
    // 监测屏幕宽度 折叠左侧菜单栏
    window.onresize = function temp() {
      _this.setResize()
      if (_this.clientWidth <= 768) { // 页面宽度 768
        if (_this.isCollapse === false) {
          _this.isCollapse = true
        }
      } else if (_this.isCollapse === true) {
        _this.isCollapse = false
      }
    }
  },
  methods: {
    // 控制菜单折叠
    changeSlidebarState() {
      this.isCollapse = !this.isCollapse
      this.foldState = !this.foldState
    },
    // 控制历史记录折叠
    changeReuseState() {
      this.showReuseTab = !this.showReuseTab
      this.upState = !this.upState
      this.$refs.appMain.$el.style.minHeight = this.showReuseTab === false ? `${this.clientHeight - navBarHeight - marginHeight}px` : `${this.clientHeight - totalHeight}px`
      // 因为动画效果有延时，所以需要重新渲染scroll
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 400)
    },
    // 响应页面的宽度高度变化
    setResize() {
      this.clientHeight = document.body.clientHeight
      this.clientWidth = document.body.clientWidth
      this.$refs.appMain.$el.style.minHeight = `${this.clientHeight - totalHeight}px`
    },
  },
  watch: {
    isCollapse() {
      this.sideBarWidth = this.isCollapse === false ? '170px' : '50px'
    },
    $route() {
      this.showBackTop = false
      if (this.scrollY <= 70) { // MenuTab组件高度
        this.backTop()
      }
    },
  },
  mixins: [layoutMixin],
  components: {
    NavBar,
    SideBar,
    AppMain,
    ReuseTab,
    MenuTab,
    BackTop,
  },
}
</script>

<style lang="scss" type="text/scss" scoped>
.sidebar {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
}
.operate {
  display: flex;
  align-items: center;
  background: $navbar-background;
  padding-left: 20px;
  .iconfont {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    transform: rotate(0deg);
    transition: all 0.3s linear;
    margin-right: 10px;
    &:hover {
      color: #3963bc;
    }
  }
  .rotate {
    transform: rotate(180deg);
    transition: all 0.3s linear;
  }
}
.wrapper {
  height: 100%;
  overflow: hidden;
}
.el-container-right {
  padding-bottom: 20px;
}
.app-main {
  background: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.el-main {
  overflow-y: auto;
  position: relative;
}
.backTop {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  right: 50px;
  bottom: 50px;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  line-height: 45px;
  .iconfont {
    font-size: 36px;
  }
}
</style>
