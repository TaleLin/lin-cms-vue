<template>
  <div v-if="tabs.length">
    <swiper :options="swiperOption"
            class="reuse-tab-wrap">
      <swiper-slide v-for="(tag, index) in tabs"
                    :key="tag.path">
        <router-link class="reuse-tab-item"
                     ref="tag"
                     v-ripple
                     :class="tag.path === $route.path? 'active':'' "
                     :to="tag.path"
                     @contextmenu.prevent.native="onTags">
          <i v-if="test(tabIconList[tag.title])"
             :class="tabIconList[tag.title]"></i>
          <img v-else
               :src="tabIconList[tag.title]"
               style="width:16px;">
          <span style="padding: 0 5px;">{{ tag.title | filterTitle }}</span>
          <span class="el-icon-close reMove"
                @click.prevent.stop="clean(index)" />
        </router-link>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import ripple from 'lin/directives/ripple'

import "swiper/dist/css/swiper.css" // eslint-disable-line

export default {
  components: { swiper, swiperSlide },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      swiperOption: {
        slidesPerView: 'auto',
        initialSlide: 0,
        effect: 'slide',
        spaceBetween: 10,
        preventClicks: false,
        freeMode: true,
        mousewheel: {
          sensitivity: 1.5,
        },
      },
    }
  },
  created() { },
  computed: {
    ...mapGetters(['tabs', 'tabIconList', 'sideBarList']),
  },
  watch: {
    $route(to) {
      const o = {
        path: to.path,
        title: to.meta.title,
        icon: to.meta.icon,
        src: to.meta.src,
      }

      const has = this.hasChildren(to.path)
      if (has) {
        return
      }

      this.ADD_TAB(o)
    },
  },
  mounted() { },
  methods: {
    test() {
      // if (icon.slice(0, 8)) {
      //   return true
      // }
      return true
    },
    hasChildren(path) {
      let has = false
      this.sideBarList.forEach((element) => {
        if (
          element.path === path
          && element.children
          && element.children.length > 0
        ) {
          has = true
        } else if (element.children && element.children.length > 0) {
          element.children.forEach((el) => {
            if (el.path === path && el.children && el.children.length) {
              has = true
            }
          })
        }
      })
      return has
    },
    clean(index) {
      this.REMOVE_TAB(index)
    },
    ...mapMutations(['ADD_TAB', 'REMOVE_TAB']),
  },
  directives: {
    ripple,
  },
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "~assets/styles/variable.scss";

.swiper-slide {
  width: 130px;
  display: flex;
  height: 30px;
  flex-direction: column;
  justify-content: center;
}
.reuse-tab-wrap {
  width: calc(100% -40px);
  margin: 0 20px;
  height: 30px;
  padding: 20px 0 0;
  background: #2b3b71;
  font-size: 14px;
  color: #8c98ae;
  display: flex;
  align-items: center;
  overflow: hidden;
  .reuse-tab-item {
    box-sizing: border-box;
    width: auto;
    border: 1px solid;
    border-radius: 2px;
    height: 30px;
    width: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1em;
    margin-right: 10px;
    position: relative;
    .el-icon-close {
      opacity: 0;
      position: absolute;
    }
    &:hover {
      background: $theme;
      border: none;
      color: #fff;
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
    height: 30px;
    color: #ffffff;
    background: $theme;
    border: none;
    position: relative;
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
</style>
