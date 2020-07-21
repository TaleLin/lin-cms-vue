import Vue from 'vue'
import Utils from '../util/util'
/*
 * 全局的过滤函数
 * */
function checkAddZone(num) {
  return num < 10 ? `0${num.toString()}` : num
}

const globalFilter = {
  filterAddress(value) {
    // 过滤地址
    if (!value) return value
    const obj = value
    return `${obj.provinceName}${obj.cityName}${obj.countyName} ${obj.detailInfo}`
  },

  filterTime(value) {
    // 过滤时间戳，返回值yyyy-mm-dd
    if (!value) {
      return value
    }
    const date = new Date(value * 1000)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    return val
  },

  filterTimeYmdHms(value) {
    // 过滤时间戳，返回值yyyy-mm-dd ss
    if (!value) {
      return value
    }
    const date = new Date(value * 1000)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const hh = date.getHours()
    const mm = `${date.getMinutes()}`
    const ss = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}  ${hh}:${mm}:${ss}`
    return val
  },

  filterTimeYear(value) {
    // 过滤时间戳, 返回值 今年:mm-dd 往年:yyyy-mm-dd
    const jy = 1900 + new Date().getYear()
    const date = new Date(value * 1000)
    const y = 1900 + date.getYear()
    const m = `0${date.getMonth() + 1}`
    const d = `0${date.getDate()}`
    const val = `${y}-${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    const thisYear = `${m.substring(m.length - 2, m.length)}-${d.substring(d.length - 2, d.length)}`
    if (jy === y) {
      return thisYear
    }
    return val
  },

  dateFormatter(nows) {
    if (!nows) return ''
    const now = new Date(nows)
    const year = now.getFullYear()

    let month = now.getMonth() + 1
    month = checkAddZone(month)

    let date = now.getDate()
    date = checkAddZone(date)
    return `${year}-${month}-${date}`
  },

  dateTimeFormatter(t) {
    if (!t) return ''
    t = new Date(t).getTime() // eslint-disable-line
    t = new Date(t) // eslint-disable-line
    const year = t.getFullYear()
    let month = t.getMonth() + 1
    month = checkAddZone(month)

    let date = t.getDate()
    date = checkAddZone(date)

    let hour = t.getHours()
    hour = checkAddZone(hour)

    let min = t.getMinutes()
    min = checkAddZone(min)

    let se = t.getSeconds()
    se = checkAddZone(se)

    return `${year}-${month}-${date} ${hour}:${min}:${se}`
  },

  filterTitle(value, len = 9) {
    return Utils.cutString(value, len)
  },
}

// 全局过滤器
Object.keys(globalFilter).forEach(k => Vue.filter(k, globalFilter[k]))

export default globalFilter
