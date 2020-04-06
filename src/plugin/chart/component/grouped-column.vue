<template>
  <div id="grouped-column"></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { GroupColumn } from '@antv/g2plot'

export default {
  name: 'GroupedColumn',
  data() {
    return {
      data: [
        { month: '1月', area: '东区', value: 1200 },
        { month: '1月', area: '南区', value: 800 },
        { month: '1月', area: '北区', value: 900 },
        { month: '2月', area: '东区', value: 800 },
        { month: '2月', area: '南区', value: 1000 },
        { month: '2月', area: '北区', value: 1100 },
        { month: '3月', area: '东区', value: 600 },
        { month: '3月', area: '南区', value: 988 },
        { month: '3月', area: '北区', value: 866 },
        { month: '4月', area: '东区', value: 1140 },
        { month: '4月', area: '南区', value: 900 },
        { month: '4月', area: '北区', value: 870 },
        { month: '5月', area: '东区', value: 880 },
        { month: '5月', area: '南区', value: 780 },
        { month: '5月', area: '北区', value: 1168 },
        { month: '6月', area: '东区', value: 800 },
        { month: '6月', area: '南区', value: 840 },
        { month: '6月', area: '北区', value: 850 },
        { month: '7月', area: '东区', value: 900 },
        { month: '7月', area: '南区', value: 890 },
        { month: '7月', area: '北区', value: 1000 },
      ],
    }
  },
  mounted() {
    const canvas = new GroupColumn('grouped-column', {
      title: {
        text: '月销售各区域对比',
        visible: true,
      },
      data: this.data,
      groupField: 'area',
      xField: 'month',
      yField: 'value',
      meta: {
        month: {
          alias: '月份',
        },
        value: {
          alias: '数量',
        },
      },
      forceFit: true,
      color: ['#4577FF', '#00C292', '#FEC108'],
      columnSize: 12,
      legend: {
        visible: true,
        position: 'top-right',
      },
    })
    canvas.render()
  },
}
</script>

<style scoped></style>
