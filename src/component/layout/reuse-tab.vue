<template>
  <div v-if="histories.length > 1" ref="resueTab" class="reuse-tab">
    <swiper :options="swiperOption" class="reuse-tab-wrap">
      <swiper-slide v-for="(item, index) in histories" :key="item.path">
        <router-link
          class="reuse-tab-item"
          :class="item.path === $route.path ? 'active' : ''"
          :to="item.path"
          @contextmenu.prevent.native="onTags(index, $event)"
        >
          <i v-if="!filterIcon(stageList[item.stageId].icon)" :class="stageList[item.stageId].icon"></i>
          <img v-else :src="stageList[item.stageId].icon" style="width:16px;" />
          <span style="padding: 0 5px;">{{ stageList[item.stageId].title }}</span>
          <span class="el-icon-close" @click.prevent.stop="close(index)" />
        </router-link>
      </swiper-slide>
    </swiper>

    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="closeAll">关闭所有</li>
      <li @click="closeOthers">关闭其他</li>
      <li @click="closeLeft" v-if="hasLeft">关闭左侧</li>
      <li @click="closeRight" v-if="hasRight">关闭右侧</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css' // eslint-disable-line

export default {
  components: { swiper, swiperSlide },
  data() {
    return {
      histories: [],
      visible: false,
      hasLeft: true,
      hasRight: true,
      top: 0,
      left: 0,
      index: 0,
      swiperOption: {
        slidesPerView: 'auto',
        initialSlide: 0,
        effect: 'slide',
        spaceBetween: 1,
        preventClicks: false,
        freeMode: true,
        mousewheel: {
          sensitivity: 1.5,
        },
      },
    }
  },
  watch: {
    $route(to) {
      // 对路由变化作出响应...
      const { histories } = this
      const flag = histories.find(item => item.path === to.path)
      if (flag) {
        return
      }
      const ele = {}
      ele.stageId = to.name
      ele.path = to.path
      ele.routePath = to.matched[to.matched.length - 1].path
      this.histories = [ele, ...histories]
    },
    logined(val) {
      if (val) {
        return
      }
      this.closeAll()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    // 舞台改变时触发
    stageList() {
      this.init()
    },
    histories(arr) {
      if (arr.length < 2) {
        this.eventBus.$emit('noReuse')
      } else {
        this.eventBus.$emit('hasReuse')
      }
    },
  },
  inject: ['eventBus'],
  created() {
    // 关闭窗口时执行
    window.onbeforeunload = () => {
      // 缓存历史记录
      window.localStorage.setItem('history', JSON.stringify(this.histories))
    }
  },
  computed: {
    logined() {
      return this.$store.state.logined
    },
    defaultRoute() {
      return this.$store.state.defaultRoute
    },
    ...mapGetters(['getStageByRoute', 'getStageByName', 'stageList']),
  },
  mounted() {
    this.init()
    this.eventBus.$on('clearTap', () => {
      this.histories = []
    })
  },
  methods: {
    init() {
      const histories = []

      // 获取当前的历史记录, 可能从本地存储, 可能直接获取当前的
      let localHistory
      if (this.histories.length > 0) {
        localHistory = [...this.histories]
      } else {
        localHistory = window.localStorage.getItem('history') || '[]'
        localHistory = JSON.parse(localHistory)
      }

      localHistory.forEach(item => {
        let findResult
        if (item.name) {
          findResult = this.getStageByName(item.name)
        } else {
          findResult = this.getStageByRoute(item.routePath)
        }
        if (!findResult) {
          return
        }
        histories.push({
          ...item,
          stageId: findResult.name,
        })
        this.histories = histories
      })
    },
    filterIcon(icon) {
      if (!icon) {
        return false
      }
      return icon.indexOf('/') !== -1
    },
    closeAll() {
      this.histories = []
      this.$router.push(this.defaultRoute)
    },
    closeOthers() {
      this.$router.push(this.histories[this.index].path)
      this.histories = []
    },
    closeLeft() {
      this.histories.splice(0, this.index)
    },
    closeRight() {
      this.histories.splice(this.index + 1, this.histories.length - this.index - 1)
    },
    onTags(index, event) {
      this.closeMenu()
      const menuMinWidth = 126
      const offsetLeft = this.$el.getBoundingClientRect().left
      const { offsetWidth } = this.$el
      const maxLeft = offsetWidth - menuMinWidth
      const left = event.clientX - offsetLeft + 15

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      if (index === 0) {
        this.hasLeft = false
      }

      if (index + 1 === this.histories.length) {
        this.hasRight = false
      }

      this.top = 18
      this.index = index
      this.visible = true
    },
    closeMenu() {
      this.visible = false
      this.hasLeft = true
      this.hasRight = true
    },
    close(index) {
      // 检测是否是当前页, 如果是当前页则自动切换路由
      if (this.$route.path === this.histories[index].path) {
        if (index > 0) {
          this.$router.push(this.histories[index - 1].path)
        } else if (this.histories.length > 1) {
          this.$router.push(this.histories[1].path)
        } else {
          this.$router.push(this.defaultRoute)
        }
      }
      // 删除该历史记录
      this.histories.splice(index, 1)
      this.histories = [...this.histories]
    },
  },
}
</script>

<style lang="scss" scoped>
.swiper-slide {
  width: auto;
  min-width: 126px;
  display: flex;
  height: $reusetab-height;
  flex-direction: column;
  justify-content: center;
  background-color: $reuse-tab-item-background;
  color: $right-side-font-color;
}

.reuse-tab-wrap {
  bottom: 0;
  left: 0;
  user-select: none;
  height: $reusetab-height;
  background: $header-background;
  font-size: 14px;
  color: #8c98ae;
  display: flex;
  align-items: center;
  overflow: hidden;

  .reuse-tab-item {
    box-sizing: border-box;
    width: auto;
    height: $reusetab-height;
    min-width: 126px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1em;
    margin-right: 1px;
    position: relative;
    white-space: nowrap;

    > i {
      color: $theme;
    }

    .el-icon-close {
      opacity: 0;
      position: absolute;
    }

    &:hover {
      background: $theme;
      border: none;
      color: #fff;

      > i {
        color: #fff;
      }

      .el-icon-close {
        position: absolute;
        display: inline-block;
        width: 14px;
        height: 14px;
        top: 0;
        right: 0;
        opacity: 1;
        border-radius: 0 0 0 14px;
        background: rgba(255, 255, 255, 0.3);

        &::before {
          font-size: 12px;
          position: absolute;
          right: -1px;
          transform: scale(0.7);
        }
      }
    }
  }

  .active {
    box-sizing: border-box;
    height: 40px;
    color: #ffffff;
    background: $theme;
    border: none;
    position: relative;

    > i {
      color: #fff;
    }

    .el-icon-close {
      position: absolute;
      display: inline-block;
      width: 14px;
      height: 14px;
      top: 0;
      right: 0;
      opacity: 1;
      border-radius: 0 0 0 14px;
      background: rgba(255, 255, 255, 0.3);

      &::before {
        font-size: 12px;
        position: absolute;
        right: -1px;
        transform: scale(0.7);
      }
    }
  }

  .reuse-tab-wrap {
    height: 100%;
  }
}
.reuse-tab {
  position: relative;
  .contextmenu {
    margin: 0;
    background: #ffffff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #596c8e;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 10px 20px;
      cursor: pointer;
      &:hover {
        background: #ebeff8;
        color: #6182c9;
      }
    }
  }
}
</style>
