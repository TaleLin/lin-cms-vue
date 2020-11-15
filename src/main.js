import { createApp } from 'vue'
import ElementPlus from 'element-plus'

import '@/config/global'
import '@/lin/plugin'
import permissionDirective from '@/lin/directive/authorize'

import App from '@/app.vue'
import store from '@/store'
import router from '@/router'

import LIcon from '@/component/base/icon/lin-icon'
import StickyTop from '@/component/base/sticky-top/sticky-top'
import SourceCode from '@/component/base/source-code/source-code'

import '@/assets/style/index.scss'
import '@/assets/style/realize/element-variable.scss'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)

// base 组件注册
app.component('l-icon', LIcon)
app.component('sticky-top', StickyTop)
app.component('source-code', SourceCode)

app.directive('permission', permissionDirective)

app.mount('#app')

app.config.devtools = true

// 设置 App 实例
window.App = app
