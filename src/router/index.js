import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from '../store'

Vue.use(Router)

const notLoginComponents = ['login']

function isLoginRequired(name) {
  const matched = notLoginComponents.find(el => el === name)
  if (matched) {
    return false
  }
  return true
}

function hasPermission(router) {
  if (router.meta && router.meta.auths) {
    return store.state.auths.some(auth => router.meta.auths.indexOf(auth) >= 0)
  }
  return true
}

const router = new Router({
  // mode: 'history',
  scrollBehavior: () => ({
    y: 0,
  }),
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化重新计时 */
  store.commit('SET_STOP_TIME', new Date().getTime())
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  // 判断哪些页面不需登陆便可进入
  if (isLoginRequired(to.name) && !store.state.logined) {
    next({ path: '/login' })
  } else {
    // // 判断权限
    if (store && store.state && store.state.user) {
      const { isSuper } = store.state.user
      if (to.path !== '/about' && !isSuper && !hasPermission(to)) {
        Vue.prototype.$notify({
          title: '无权限',
          dangerouslyUseHTMLString: true,
          message: '<strong class="my-notify">您无此页面的权限哟</strong>',
        })
        next({ path: '/about' })
      }
    }
    next()
  }
})

export default router
