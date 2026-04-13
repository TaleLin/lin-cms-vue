function groupByOrder(source) {
  const orderMap = {}
  const noOrderList = []

  source.forEach(item => {
    const { order } = item

    if (typeof order !== 'number') {
      noOrderList.push(item)
      return
    }

    if (!orderMap[order]) {
      orderMap[order] = []
    }

    orderMap[order].push(item)
  })

  return {
    orderMap,
    noOrderList,
  }
}

export function sortByOrder(source = []) {
  if (!Array.isArray(source)) {
    throw new Error('sortByOrder 传入参数不符合要求, 应为数组')
  }

  if (!source.length) {
    return source
  }

  const { orderMap, noOrderList } = groupByOrder(source)
  const orders = Object.keys(orderMap)
    .map(Number)
    .sort((left, right) => left - right)
  const negativeOrders = orders.filter(order => order < 0)
  const nonNegativeItems = orders
    .filter(order => order >= 0)
    .map(order => orderMap[order])
    .flat()
  const result = [...nonNegativeItems, ...noOrderList]

  negativeOrders.reverse().forEach(order => {
    let index = result.length + order + 1

    if (index < 0) {
      index = 0
    }

    result.splice(index, 0, ...orderMap[order])
  })

  return result
}
