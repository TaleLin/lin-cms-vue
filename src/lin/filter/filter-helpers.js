import dayjs from 'dayjs'

import { cutString } from '@/lin/util/text'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export function checkAddZone(num) {
  return num < 10 ? `0${num.toString()}` : num
}

export function formatAddress(value) {
  if (!value) {
    return value
  }

  return `${value.provinceName}${value.cityName}${value.countyName} ${value.detailInfo}`
}

export function formatUnixDate(value) {
  if (!value) {
    return value
  }

  return dayjs.unix(value).format(DATE_FORMAT)
}

export function formatUnixDateTime(value) {
  if (!value) {
    return value
  }

  return dayjs.unix(value).format(DATE_TIME_FORMAT)
}

export function formatUnixDateByCurrentYear(value, now = dayjs()) {
  if (!value) {
    return value
  }

  const targetDate = dayjs.unix(value)

  if (targetDate.year() === now.year()) {
    return targetDate.format('MM-DD')
  }

  return targetDate.format(DATE_FORMAT)
}

export function formatDate(value) {
  if (!value) {
    return ''
  }

  return dayjs(value).format(DATE_FORMAT)
}

export function formatDateTime(value) {
  if (!value) {
    return ''
  }

  return dayjs(value).format(DATE_TIME_FORMAT)
}

export function truncateTitle(value, len = 9) {
  if (!value) {
    return value
  }

  return cutString(value, len)
}
