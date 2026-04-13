import { describe, expect, it } from 'vitest'
import dayjs from 'dayjs'

import {
  DATE_FORMAT,
  DATE_TIME_FORMAT,
  checkAddZone,
  formatAddress,
  formatDate,
  formatDateTime,
  formatUnixDate,
  formatUnixDateByCurrentYear,
  formatUnixDateTime,
  truncateTitle,
} from '@/lin/filter/filter-helpers'

describe('filter helpers', () => {
  it('formats address and date values with explicit helper outputs', () => {
    expect(checkAddZone(3)).toBe('03')
    expect(checkAddZone(12)).toBe(12)
    expect(
      formatAddress({
        provinceName: '浙江省',
        cityName: '杭州市',
        countyName: '西湖区',
        detailInfo: '文三路 1 号',
      }),
    ).toBe('浙江省杭州市西湖区 文三路 1 号')
    expect(formatDate('2026-04-12T08:30:45')).toBe('2026-04-12')
    expect(formatDateTime('2026-04-12T08:30:45')).toBe('2026-04-12 08:30:45')
  })

  it('formats unix timestamps and truncates long titles', () => {
    const timestamp = dayjs('2024-04-12 08:30:45').unix()
    const now = {
      year: () => 2026,
    }

    expect(DATE_FORMAT).toBe('YYYY-MM-DD')
    expect(DATE_TIME_FORMAT).toBe('YYYY-MM-DD HH:mm:ss')
    expect(formatUnixDate(timestamp)).toBe('2024-04-12')
    expect(formatUnixDateTime(timestamp)).toBe('2024-04-12 08:30:45')
    expect(formatUnixDateByCurrentYear(dayjs('2026-04-12 08:30:45').unix(), now)).toBe('04-12')
    expect(truncateTitle('这是一个很长的标题', 8)).toBe('这是一...')
  })
})
