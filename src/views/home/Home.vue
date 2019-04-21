<template>
  <div style="height:100%;">
    <el-container>
      <el-aside :width="sideBarWidth" class="aside">
        <side-bar :isCollapse="isCollapse" class="sidebar"></side-bar>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="left">
            <div class="operate" ref="operate">
              <i class="iconfont icon-fold" :class="{rotate: foldState}" @click="changeSlidebarState" />
              <nav-bar></nav-bar>
            </div>
            <el-collapse-transition>
              <reuse-tab ref="reuse"></reuse-tab>
            </el-collapse-transition>
          </div>
          <div class="right-info">
            <notify v-auth="'消息推送'" v-if="false" />
            <user></user>
          </div>
        </el-header>
        <el-main ref="main">
          <menu-tab></menu-tab>
          <app-main ref="appMain" class="app-main"></app-main>
        </el-main>
        <back-top :right="50" :bottom="50" :fontSize="24"></back-top>
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
  User,
  BackTop,
} from '@/components/layout'
import Notify from '@/components/notify/notify'

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
    this.$nextTick(() => {
      this.eventBus.$on('noReuse', () => {
        this.$refs.operate.style.height = '71px'
      })
      this.eventBus.$on('hasReuse', () => {
        this.$refs.operate.style.height = '46px'
      })
    })
  },
  inject: ['eventBus'],
  methods: {
    // 控制菜单折叠
    changeSlidebarState() {
      this.isCollapse = !this.isCollapse
      this.foldState = !this.foldState
    },
    // 响应页面的宽度高度变化
    setResize() {
      this.clientHeight = document.body.clientHeight
      this.clientWidth = document.body.clientWidth
      this.$refs.appMain.$el.style.minHeight = `${this.clientHeight - totalHeight + 20}px`
      // 页面缩放重新计算reuse宽度
      this.$refs.reuse.setReuseTabWidth()
    },
  },
  watch: {
    isCollapse() {
      this.sideBarWidth = this.isCollapse === false ? '170px' : '64px'
      const sideWidth = this.isCollapse === false ? 170 : 64
      // 页面缩放重新计算reuse宽度
      this.$refs.reuse.setReuseTabWidth(sideWidth)
    },
    $route(to) {
      this.showBackTop = false
      if (this.scrollY <= 70) { // MenuTab组件高度
        this.backTop()
      }

      if (to.meta.blueBaseColor) {
        this.$refs.appMain.$el.style.background = '#273B6F'
      } else {
        this.$refs.appMain.$el.style.background = '#EEF4F9'
      }
    },
  },
  components: {
    NavBar,
    SideBar,
    AppMain,
    ReuseTab,
    MenuTab,
    BackTop,
    User,
    Notify,
  },
  beforeDestroy() {
    this.eventBus.$off('noReuse')
    this.eventBus.$off('hasReuse')
  },
}
</script>

<style lang="scss" scoped>
.aside {
  background: rgb(25, 42, 94);
  overflow: hidden;
}

.header {
  padding: 0;
  background: $appmain-background;
  height: $header-height !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow:0px 2px 6px 0px rgba(190,204,216,0.4);
  border-bottom: 1px solid rgba(190,204,216,0.4);

  .left {
    height: 100%;

    .operate {
      display: flex;
      align-items: center;
      background: $appmain-background;
      padding-left: 20px;
      height: 46px;

      .iconfont {
        font-size: 16px;
        font-weight: 500;
        color: $right-side-font-color;
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
  }

  .right-info {
    display: flex;
    align-items: center;
  }
}

.el-main {
  overflow-y: auto;
  position: relative;
  padding: 0;
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
