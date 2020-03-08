<template>
  <div id="rose"></div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { Rose } from '@antv/g2plot'

export default {
  name: 'Rose',
  data() {
    return {
      data: [
        {
          type: '服装',
          value: 2700,
        },
        {
          type: '游戏',
          value: 2500,
        },
        {
          type: '数码',
          value: 1898,
        },
        {
          type: '食品',
          value: 2376,
        },
        {
          type: '书籍',
          value: 1760,
        },
        {
          type: '其他',
          value: 1500,
        },
      ],
    }
  },
  mounted() {
    new Rose('rose', {
      title: {
        text: '品类分析',
        visible: true,
      },
      data: this.data,
      radiusField: 'value',
      categoryField: 'type',
      colorField: 'type',
    }).render()
  },
}
</script>

<style scoped></style>
