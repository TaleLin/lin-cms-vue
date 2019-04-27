import '@babel/polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'

import Lin1px from '@/components/base/line/lin-1px'
import StickyTop from '@/components/base/sticky-top/sticky-top'
import LButton from '@/components/base/button/lin-button'
import LButtonGroup from '@/components/base/button/lin-button-group'
import LIcon from '@/components/base/icon/lin-icon'

import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import GlobalMixin from 'lin/mixin/global'
import AuthorizeDirective from 'lin/directives/authorize'
import filters from 'lin/filter'

import plugins from 'lin/utils/plugins'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/styles/index.scss' // eslint-disable-line
import '@/assets/styles/realize/element-variables.scss'

// 全局过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(plugins)

Vue.component(CollapseTransition.name, CollapseTransition)

Vue.component('lin-1px', Lin1px)
Vue.component('sticky-top', StickyTop)
Vue.component('l-button', LButton)
Vue.component('l-button-group', LButtonGroup)
Vue.component('l-icon', LIcon)

Vue.use(GlobalMixin)
Vue.use(AuthorizeDirective)
Vue.prototype.$XLSX = Window.XLSX

/* eslint no-unused-vars: 0 */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
