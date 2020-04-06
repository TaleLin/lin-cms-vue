<template>
  <div id="line"></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { Line } from '@antv/g2plot'

export default {
  name: 'Line',
  data() {
    return {
      data: [
        { month: '1月', value: 100, type: '东区' },
        { month: '2月', value: 80, type: '东区' },
        { month: '3月', value: 100, type: '东区' },
        { month: '4月', value: 70, type: '东区' },
        { month: '5月', value: 120, type: '东区' },
        { month: '6月', value: 80, type: '东区' },
        { month: '7月', value: 60, type: '东区' },
        { month: '1月', value: 50, type: '南区' },
        { month: '2月', value: 186, type: '南区' },
        { month: '3月', value: 180, type: '南区' },
        { month: '4月', value: 160, type: '南区' },
        { month: '5月', value: 167, type: '南区' },
        { month: '6月', value: 90, type: '南区' },
        { month: '7月', value: 100, type: '南区' },
        { month: '1月', value: 90, type: '北区' },
        { month: '2月', value: 136, type: '北区' },
        { month: '3月', value: 140, type: '北区' },
        { month: '4月', value: 123, type: '北区' },
        { month: '5月', value: 87, type: '北区' },
        { month: '6月', value: 90, type: '北区' },
        { month: '7月', value: 112, type: '北区' },
      ],
    }
  },
  mounted() {
    new Line('line', {
      title: {
        visible: true,
        text: '各区域趋势分析',
      },
      data: this.data,
      forceFit: true,
      seriesField: 'type',
      xField: 'month',
      yField: 'value',
      smooth: true,
      color: ['#4577FF', '#00C292', '#FEC108'],
      legend: {
        visible: true,
        position: 'top-right',
      },
    }).render()
  },
}
</script>

<style scoped></style>
