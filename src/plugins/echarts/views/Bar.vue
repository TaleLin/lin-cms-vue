<template>
    <div class="container">
      <sticky-top>
       <div class="header">
        <div class="header-left">
          <p class="title">图表</p>
        </div>
       </div>
       <lin-1px :addWidth="40"></lin-1px>
      </sticky-top>
        <div id="myChart" class="echarts"></div>
    </div>
</template>

<script>
import StickyTop from '@/base/sticky-top/sticky-top'
// 按需加载
import echarts from 'echarts/lib/echarts'
import theme from './../echartsTheme'
// 引入折线图组件
import 'echarts/lib/chart/line'
// 引入提示框组件、标题组件、工具箱组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/legend'
export default {
  components: {
      StickyTop,
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'),theme)
      // 绘制图表
      myChart.setOption({
        title: {
        text: '未来一周气温变化',
        subtext: '纯属虚构'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:['最高气温','最低气温']
    },
    xAxis:  {
        type: 'category',
        boundaryGap: false,
        data: ['周一','周二','周三','周四','周五','周六','周日']
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    series: [
        {
            name:'最高气温',
            type:'line',
            data:[11, 11, 15, 13, 12, 13, 10],
            markPoint: {
                data: [
                    {type: 'max', name: '最大值'},
                    {type: 'min', name: '最小值'}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'}
                ]
            }
        },
        {
            name:'最低气温',
            type:'line',
            data:[1, -2, 2, 5, 3, 2, 0],
            markPoint: {
                data: [
                    {name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
                ]
            },
            markLine: {
                data: [
                    {type: 'average', name: '平均值'},
                    [{
                        symbol: 'none',
                        x: '90%',
                        yAxis: 'max'
                    }, {
                        symbol: 'circle',
                        label: {
                            normal: {
                                position: 'start',
                                formatter: '最大值'
                            }
                        },
                        type: 'max',
                        name: '最高点'
                    }]
                ]
            }
        }
    ]
    });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 20px;
  background:#ffffff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left {
      float: left;
      .title {
        height: 59px;
        line-height: 59px;
        color: #4c76af;
        font-size: 16px;
        font-family: 'PingFangSC-Medium';
        font-weight: 500;
        img{
          width: 90px;
        }
      }
    }
  }
  .echarts{
        width: 800px;
        height: 650px;
        margin: 5px auto;
    }
}
</style>



