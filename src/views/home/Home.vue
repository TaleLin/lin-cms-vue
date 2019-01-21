<template>
  <div style="height:100%;">
    <el-container>
      <el-aside :width="sideBarWidth">
        <side-bar :isCollapse="isCollapse"
                  class="sidebar"></side-bar>
      </el-aside>
      <el-container>
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
        <scroll class="wrapper"
                ref="scroll"
                :listenScroll="true"
                :probeType="2"
                @scroll="scroll">
          <el-main>
            <menu-tab></menu-tab>
            <app-main ref="appMain"
                      class="app-main"></app-main>
          </el-main>
        </scroll>
        <div class="backTop"
             v-if="showBackTop">
          <i class="iconfont icon-top"
             @click="backTop"></i>
        </div>
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
} from '@/components/layout'
import layoutMixin from 'lin/mixin/layout.js'
import { mapGetters } from 'vuex'
import Scroll from '@/base/scroll/scroll'

const navBarHeight = 66
const reuseTabHeight = 70
const marginHeight = 20
const totalHeight = navBarHeight + reuseTabHeight + marginHeight

export default {
  name: 'layout',
  data() {
    return {
      isCollapse: false,
      sideBarWidth: '170px',
      clientWidth: 0,
      clientHeight: 0,
      foldState: false,
      upState: false,
      showReuseTab: true,
      showBackTop: false,
    }
  },
  methods: {
    changeSlidebarState() {
      this.isCollapse = !this.isCollapse
      this.foldState = !this.foldState
    },
    changeReuseState() {
      this.showReuseTab = !this.showReuseTab
      this.upState = !this.upState
      this.$refs.appMain.$el.style.minHeight = this.showReuseTab === false ? `${this.clientHeight - navBarHeight - marginHeight}px` : `${this.clientHeight - totalHeight}px`
      // 因为动画效果有延时，所以需要重新渲染scroll
      setTimeout(() => {
        this.$refs.scroll.refresh()
      }, 400)
    },
    setResize() {
      this.clientHeight = document.body.clientHeight
      this.clientWidth = document.body.clientWidth
      this.$refs.appMain.$el.style.minHeight = `${this.clientHeight - totalHeight}px`
    },
    // 监听滚轮
    scroll(pos) {
      this.showBackTop = pos.y < -100
    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 1000)
    },
  },
  watch: {
    isCollapse() {
      this.sideBarWidth = this.isCollapse === false ? '170px' : '50px'
    },
    $route() {
      this.showBackTop = false
    },
  },
  computed: {
    ...mapGetters(['isScroll']),
  },
  mounted() {
    const _this = this
    this.setResize()
    window.onresize = function temp() {
      _this.setResize()
      if (_this.clientWidth <= 768) {
        if (_this.isCollapse === false) {
          _this.isCollapse = true
        }
      } else if (_this.isCollapse === true) {
        _this.isCollapse = false
      }
    }
  },
  mixins: [layoutMixin],
  components: {
    NavBar,
    SideBar,
    AppMain,
    ReuseTab,
    MenuTab,
    Scroll,
  },
}
</script>

<style lang="scss" type="text/scss" scoped>
.sidebar {
  position:absolute;
  top:0;
  left:0;
  bottom:0;
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
.app-main {
  height: 100%;
  background: white;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
    font-size: 18px;
  }
}
</style>
