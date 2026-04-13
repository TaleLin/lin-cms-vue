import 'dayjs/locale/zh-cn'
import { createApp } from 'vue'
import dayjs from 'dayjs'
import { provideGlobalConfig } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import 'lin/plugin'
import permissionDirective from 'lin/directive/authorize'

import App from '@/app.vue'
import pinia from '@/store'
import router from '@/router'

import '@/assets/style/china-theme.scss'
import '@/assets/style/index.scss'
import '@/assets/style/realize/element-variable.scss'

dayjs.locale('zh-cn')

const app = createApp(App)

app.use(pinia)
app.use(router)
provideGlobalConfig(
  {
    locale: zhCn,
  },
  app,
  true,
)

app.directive('permission', permissionDirective)

app.mount('#app')
