import Vue from 'vue'
import stateCode from '@/config/error-code'
import User from '../models/user'

export default function tip(params) {
  let { error_code, msg } = params // eslint-disable-line
  if (msg instanceof Object) {
    let showMsg = ''
    Object.getOwnPropertyNames(msg).forEach((key, index) => {
      if (index === 0) {
        showMsg = msg[key]
      }
    })
    msg = showMsg
  }
  console.log('error 参数', params)
  switch (error_code) {
    case 10040: // 无效token
      User.getRefreshToken()
      break
    case 10050: // 令牌过期
      User.getRefreshToken()
      break
    case 1004: // 无效token
      console.warn('无效token', params)
      break
    case 10020: // 没有找到相关日志
      Vue.prototype.$notify({
        title: '提示',
        dangerouslyUseHTMLString: true,
        message: `<strong class="my-notify">${msg}</strong>`,
      })
      break
    case 10000: // 无权限
      Vue.prototype.$notify({
        title: '无权限',
        dangerouslyUseHTMLString: true,
        message: `<strong class="my-notify">${msg}</strong>`,
      })
      throw new Error(msg)
    case 10030: // 参数错误
      Vue.prototype.$message({
        type: 'error',
        message: `${msg}`,
      })
      throw new Error(msg)
    case 10060: // 字段重复
      Vue.prototype.$message({
        type: 'error',
        message: `${msg}`,
      })
      throw new Error(msg)
    case 10070: // 不可操作
      Vue.prototype.$message({
        type: 'error',
        message: `${msg}`,
      })
      throw new Error(msg)
    default:
      Vue.prototype.$message({
        message: stateCode[error_code] || '未知的error_code',
        type: 'error',
      })
  }
}
