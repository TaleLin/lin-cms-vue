<template>
  <div id="Radar"></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { Radar } from '@antv/g2plot'

export default {
  name: 'Radar',
  data() {
    return {
      data: [
        { type: '品牌', mark: '东区', value: 80 },
        { type: '外观', mark: '东区', value: 20 },
        { type: '质量', mark: '东区', value: 60 },
        { type: '实用', mark: '东区', value: 40 },
        { type: '设计', mark: '东区', value: 70 },
        { type: '品牌', mark: '北区', value: 70 },
        { type: '外观', mark: '北区', value: 50 },
        { type: '质量', mark: '北区', value: 90 },
        { type: '实用', mark: '北区', value: 80 },
        { type: '设计', mark: '北区', value: 20 },
      ],
    }
  },
  mounted() {
    new Radar('Radar', {
      title: {
        text: '东、北区对比分析',
        visible: true,
      },
      data: this.data,
      radiusField: 'value',
      angleField: 'type',
      seriesField: 'mark',
      color: ['#4577FF', '#FEC108'],
      legend: {
        visible: true,
        position: 'top-right',
      },
    }).render()
  },
}
</script>

<style scoped></style>
