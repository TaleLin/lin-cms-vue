import { cloneDeep, throttle, debounce } from 'lodash'

/* eslint-disable */
const Utils = {}

/** 参数说明：
 * 根据长度截取先使用字符串，超长部分追加…
 * str 对象字符串
 * len 目标字节长度
 * 返回值： 处理结果字符串
 */
Utils.cutString = (str, len) => {
  if (str.length * 2 <= len) {
    return str
  }
  let strlen = 0
  let s = ''
  for (let i = 0; i < str.length; i++) {
    // eslint-disable-line
    s += str.charAt(i)
    if (str.charCodeAt(i) > 128) {
      strlen += 2
      if (strlen >= len) {
        return `${s.substring(0, s.length - 1)}...`
      }
    } else {
      strlen += 1
      if (strlen >= len) {
        return `${s.substring(0, s.length - 2)}...`
      }
    }
  }
  return s
}

/**
 * 简单数组的交集
 * @param {Array} a
 * @param {Array} b
 */
Utils.getIntersect = (a, b) => {
  if (a.constructor === Array && b.constructor === Array) {
    const set1 = new Set(a)
    const set2 = new Set(b)
    return Array.from(new Set([...set1].filter(x => set2.has(x))))
  }
  return null
}

/**
 * 防抖函数
 * @param {*} func 函数体
 * @param {*} wait 延时
 */
Utils.debounce = (func, wait = 50) => debounce(func, wait)

/**
 * 节流函数
 * @param {*} func 函数体
 * @param {*} wait 延时
 */
Utils.throttle = (func, wait = 50) => throttle(func, wait)

/**
 * 返回 n 位的随机字符串
 * @param {Number} n
 */
Utils.getRandomStr = (n = 6) => {
  let str = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  for (let i = 0; i < n; i += 1) {
    str += chars.charAt(Math.floor(Math.random() * 62))
  }
  return str
}

function getTypeOf(obj) {
  const { toString } = Object.prototype
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
    '[object Symbol]': 'symbol',
  }
  return map[toString.call(obj)]
}

function groupByOrder(source) {
  // 有order的放这里
  const map = {}
  // 没有order放这里
  const noOrderList = []

  source.forEach(s => {
    const { order } = s
    if (typeof order !== 'number') {
      noOrderList.push(s)
      return
    }

    const list = map[order]
    if (list) {
      list.push(s)
    } else {
      map[order] = [s]
    }
  })

  return {
    orderMap: map,
    noOrderList,
  }
}

/**
 * 根据数组的 order 字段排序
 * @param {Array} source
 */
Utils.sortByOrder = (source = []) => {
  if (!Array.isArray(source)) {
    const message = 'sortByOrder 传入参数不符合要求, 应为数组'
    console.error(message)
    throw new Error(message)
  }

  if (!source.length) {
    return source
  }

  // 1.根据order对数据进行分组
  const { orderMap, noOrderList } = groupByOrder(source)

  // 2.获取已存在的order
  const orders = Object.keys(orderMap).map(o => Number(o))

  // 对order进行排序
  orders.sort((a, b) => a - b)

  // 小于0的order
  const ltZeroOrders = orders.filter(o => o < 0)

  // 大于等于0的order
  const gteZeroOrders = orders.filter(o => o >= 0)

  const finallyArr = []
  const gteZeroItemList = gteZeroOrders.map(o => orderMap[o]).flat()

  finallyArr.push(...gteZeroItemList)
  finallyArr.push(...noOrderList)

  // 如果没有小于0的order，则直接拼接
  if (!ltZeroOrders.length) {
    return finallyArr
  }

  // 将小于0的order的item插入到数组中
  ltZeroOrders.reverse().forEach(o => {
    let index = finallyArr.length + o + 1
    if (index < 0) {
      index = 0
    }

    const arr = orderMap[o]
    finallyArr.splice(index, 0, ...arr)
  })

  return finallyArr
}

/**
 * 深度遍历，深拷贝
 * @param {*} data
 */
Utils.deepClone = data => cloneDeep(data)

/**
 * 中划线转驼峰
 */
Utils.came = str => {
  return `${str}`.replace(/-\D/g, match => match.charAt(1).toUpperCase())
}

/**
 * 判断权限
 */
Utils.hasPermission = (permissions, route, user) => {
  // eslint-disable-line
  if (user?.admin) {
    return true
  }
  if (route.permission) {
    return permissions.some(permission => route.permission.indexOf(permission) > -1)
  }
  return true
}

let cached
/**
 * 获取窗口滚动条大小, From: https://github.com/react-component/util/blob/master/src/getScrollBarSize.js
 * @param {boolean} fresh 强制重新计算
 * @returns {number}
 */
export function getScrollBarSize(fresh) {
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

export default Utils
