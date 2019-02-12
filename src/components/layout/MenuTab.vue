 <template>
  <div>
    <div v-if="menuTabs.length || show"  style="margin-bottom:20px">

      <ul class="menu-tab">
        <router-link :to="tab.path"
                     v-for="(tab) in menuTabs"
                     :key="tab.path"
                     ref="menuTabs">
          <li ref="tabList"
              class="menu-li">
            <img v-if="tab.src"
                 :src="tab.src"
                 class="imgIcon" />
            <i v-else
               :class="tab.icon"></i>
            <span class="title">{{tab.title | filterTitle}}</span>
          </li>
        </router-link>
      </ul>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'

export default {
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapGetters(['sideBarList', 'menuTabs']),
  },
  watch: {
    $route(to) {
      if (this.menuTabs.find(tab => tab.path === to.path)) {
        this.show = true
        return
      }
      const res = []

      // 这里一定要深拷贝
      const [...matchedArr] = to.matched
      const recursionPath = matchedArr.pop()
      // 当此路由是三级路由（从历史菜单）
      if (recursionPath.parent && recursionPath.parent.parent && recursionPath.parent.parent.parent) { // eslint-disable-line
        this.sideBarList.forEach((element) => {
          const child = element.children
          if (child && child.length && !element.meta.menuTab) {
            // 遍历二级导航
            child.forEach((el) => {
              // 如果与此三级路由的父级路由相同，遍历此二级路由
              if (el.path === recursionPath.parent.path && el.children && el.children.length) {
                el.children.forEach((tab) => {
                  res.push({
                    path: tab.path,
                    title: tab.meta.title,
                    icon: tab.meta.icon,
                    src: tab.meta.src,
                  })
                })
              }
            })
          }
        })
      } else if (recursionPath.parent && recursionPath.parent.parent && recursionPath.parent.meta.menuTab) { // eslint-disable-line 
      // 如果是二级在右侧（从历史菜单）
        this.sideBarList.forEach((element) => {
          if (element.path === recursionPath.parent.path && element.children && element.children.length) { // eslint-disable-line
            element.children.forEach((tab) => {
              res.push({
                path: tab.path,
                title: tab.meta.title,
                icon: tab.meta.icon,
                src: tab.meta.src,
              })
            })
          }
        })
      }

      // 从sidebar
      this.sideBarList.forEach((element) => {
        const child = element.children
        if (child && child.length && !element.meta.menuTab) {
          // 三级导航
          child.forEach((el) => {
            if (el.path === to.path && el.children && el.children.length) {
              el.children.forEach((tab) => {
                res.push({
                  path: tab.path,
                  title: tab.meta.title,
                  icon: tab.meta.icon,
                  src: tab.meta.src,
                })
              })
            }
          })
        } else if (element.path === to.path && child && child.length) {
          // 二级导航放在右侧
          child.forEach((tab) => {
            res.push({
              path: tab.path,
              title: tab.meta.title,
              icon: tab.meta.icon,
              src: tab.meta.src,
            })
          })
        }
      })
      this.ADD_MENU_TAB(res)
      this.show = false

      if (res.length) {
        // 从历史记录跳转
        for (let i = 0; i < res.length; i++) { // eslint-disable-line
          const element = res[i]
          if (element.path === to.path) {
            this.$router.push(to.path)
            return
          }
        }
        // 从sidebar跳转默认跳转到第一个
        this.$router.push(res[0].path)
      }
    },
  },
  methods: {
    go(path, index) {
      this.$refs.tabList[index].classList.add('active')
      this.$router.push(path)
    },
    clone(obj) {
      if (obj === null) return null
      if (typeof obj !== 'object') return obj
      if (obj.constructor === Date) return new Date(obj)
      if (obj.constructor === RegExp) return new RegExp(obj)
      const newObj = new obj.constructor() // 保持继承链
      /* eslint-disable */
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) { // 不遍历其原型链上的属性
          const val = obj[key]
          newObj[key] = typeof val === 'object' ? arguments.callee(val) : val // 使用arguments.callee解除与函数名的耦合
        }
      }
      /* eslint-enable */
      return newObj
    },
    ...mapMutations(['ADD_MENU_TAB']),
  },
}
</script>

<style scoped lang="scss">
@import '~assets/styles/variable.scss';

.router-link-active {
  background: black;
}
.menu-tab {
  width: 100%;
  height: 50px;
  background: rgba(25, 42, 94, 0.5);
  font-size: 14px;
  font-family: "PingFangSC-Regular";
  font-weight: 400;
  color: rgba(140, 152, 174, 1);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  .router-link-exact-active,
  .router-link-active {
    height: 47px;
    border-top: 3px solid $theme;
    background: rgba(255, 255, 255, 1);
    color: rgba(57, 99, 188, 1);
     .menu-li {
      margin-top: -3px;
    }
  }
  .menu-li {
    width: 120px;
    height: 50px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .imgIcon {
      width: 16px;
      height: 16px;
      margin: 0 auto;
    }
    .title{
      margin-top: -9px;
    }
  }
}
</style>
