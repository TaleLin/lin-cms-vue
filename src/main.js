import '@babel/polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'

import StickyTop from '@/components/base/sticky-top/sticky-top'
import SourceCode from '@/components/base/source-code/source-code'

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

Vue.component('sticky-top', StickyTop)
Vue.component('source-code', SourceCode)

Vue.use(GlobalMixin)
Vue.use(AuthorizeDirective)
Vue.prototype.$XLSX = Window.XLSX

/* eslint no-unused-vars: 0 */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
