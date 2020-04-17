<template>
  <div class="container">
    <div class="left">
      <div class="l-side">
        <div class="title">6月新增订单</div>
        <div class="num-box">
          <div class="shape"></div>
          <div class="num">1274</div>
          <i class="iconfont icon-jiantou up"></i>
          <div class="percent">-72%</div>
        </div>
      </div>
      <div class="r-side">
        <canvas id="circle1" height="70px" width="70px"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TinyArea',
  mounted() {
    this.circle()
  },
  methods: {
    circle() {
      const canvas = document.getElementById('circle1')
      const ctx = canvas.getContext('2d')

      /* 填充文字 */
      /* 文字颜色 */
      ctx.fillStyle = '#4577FF'
      const ratioStr = '31%'
      const text = ctx.measureText(ratioStr)
      ctx.fillText(ratioStr, (70 - text.width) / 2, 39)

      /* 开始圆环 */
      const circleObj = {
        ctx,
        /* 圆心 */
        x: 35,
        y: 35,
        /* 半径 */
        radius: 32,
        /* 环的宽度 */
        lineWidth: 5,
      }

      /* 灰色的圆环 */
      /* 开始的度数-从上一个结束的位置开始 */
      circleObj.startAngle = Math.PI * 0.1
      /* 结束的度数 */
      circleObj.endAngle = Math.PI * 2
      circleObj.color = '#e9e9e9'
      this.drawCircle(circleObj)

      /* 有色的圆环 */
      /* 从-90度的地方开始画 */
      circleObj.startAngle = Math.PI * 1.5
      /* 从当前度数减去-90度 */
      circleObj.endAngle = Math.PI * 0.1
      circleObj.color = '#4577FF'
      this.drawCircle(circleObj)
    },
    drawCircle(circleObj) {
      const { ctx } = circleObj
      ctx.beginPath()
      ctx.arc(circleObj.x, circleObj.y, circleObj.radius, circleObj.startAngle, circleObj.endAngle, false)
      // 设定曲线粗细度
      ctx.lineWidth = circleObj.lineWidth
      // 给曲线着色
      ctx.strokeStyle = circleObj.color
      // 连接处样式
      ctx.lineCap = 'round'
      // 给环着色
      ctx.stroke()
      ctx.closePath()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  .left {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .l-side {
      display: flex;
      flex-direction: column;
      .title {
        font-size: 14px;
        color: #596c8e;
        margin-bottom: 12px;
      }
      .num-box {
        display: flex;
        flex-direction: row;
        height: 30px;
        .shape {
          width: 2px;
          height: 100%;
          background-color: #4577ff;
          border-radius: 14px;
        }
        .num {
          color: #596c8e;
          font-size: 32px;
          letter-spacing: 2px;
          margin-left: 14px;
          margin-right: 4px;
          line-height: 30px;
        }
        .up {
          font-size: 26px;
          color: #e46a76;
          transform: rotate(135deg);
          line-height: 30px;
          margin-right: 10px;
        }
        .percent {
          color: #c4c9d2;
          font-size: 20px;
          line-height: 30px;
        }
      }
    }
  }
  .right {
    height: 100%;
  }
}
</style>
