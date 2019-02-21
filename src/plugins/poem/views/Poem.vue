<template>
  <div class="container">
    <sticky-top>
      <div class="header">
        <div class="header-left">
          <p class="title">唐诗宋词</p>
        </div>
      </div>
      <lin-1px :addWidth="40"></lin-1px>
    </sticky-top>
    <div class="body">
      <p class="status" v-if="poems.length===0">加载中...</p>
      <div class="poems" v-else>
        <div class="poems-container" v-for="poem in poems" :key="poem.author">
            <div class="poems-title">
              <img :src="poem.image" alt="诗词图标"/>
              <div class="poems-name">
                <span class="name-text">{{poem.title}}</span>
                <span class="name-author"><div class="line"/>{{poem.author}}·{{poem.dynasty}}</span>
              </div>
            </div>
            <div v-for="(items,index) in poem.content" :key="index" class="poems-body">
              <div v-for="(item,index) in items" :key="index" class="poems-content">{{item}}</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import poem from '@/plugins/poem/models/poem'
import StickyTop from '@/base/sticky-top/sticky-top'

export default {
  components: {
    StickyTop,
  },
  data() {
    return {
      poems: [],
    }
  },
  mounted() {
    this.fetchPoem()
  },
  methods: {
    async fetchPoem() {
      const poems = await poem.fetchPoem()
      this.poems = poems
    },
  },
}
</script>

<style scoped lang="scss">
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
      }
    }
  }
  .body{
    .status{
      text-align: center;
      font-size: 12px;
      color: #7f8c8d;
    }
    .poems{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      width: 100%;
      padding-bottom: 20px;
      .poems-container{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background:url('../assets/images/bg.png');
        width: 47%;
        margin-left: 0.5%;
        margin-right: 0.5%;
        padding: 1%;
        margin-top: 1%;
        .poems-title{
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 120px;
          .poems-name{
            display:flex;
            flex-direction: row;
            align-items:flex-end;
            font-family: 'Source Han Serif';
            margin-top: 20px;
            line-height: 30px;
            width: 30px;
            text-align: center;
            color: #45526B;
            .name-text{
              font-size: 24px;
            }
            .name-author{
              font-size: 12px;
              line-height: 16px;
              margin-left:8px;
              .line{
                width: 1px;
                height: 40px;
                margin: 0 auto;
                background: #45526B;
              }
            }
          }
        }
        .poems-body{
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: flex-start;
          margin: 0 30px;
          .poems-content{
            width: 14px;
            font-size: 14px;
            line-height: 22px;
            padding: 0 7px;
          }
        }
      }
    }
  }
}
</style>
