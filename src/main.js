import { createApp } from 'vue'

import '@/config/global'
import '@/lin/plugin'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import directives from '@/lin/directive'

import App from '@/app.vue'
import store from '@/store'
import router from '@/router'

import LIcon from '@/component/base/icon/lin-icon'
import StickyTop from '@/component/base/sticky-top/sticky-top'
import SourceCode from '@/component/base/source-code/source-code'

import '@/assets/style/index.scss' // eslint-disable-line
import '@/assets/style/realize/element-variable.scss'
import 'element-ui/lib/theme-chalk/display.css'

const app = createApp(App)

app.component(CollapseTransition.name, CollapseTransition)

// base 组件注册
app.component('l-icon', LIcon)
app.component('sticky-top', StickyTop)
app.component('source-code', SourceCode)

app.use(router)
app.use(store)
app.directive(directives)
app.mount('#app')

// 设置 App 实例
window.App = app
