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
            <div class="poems-container" v-for="poem in poems" :key="poem.id">
            <div class="tang-dynasty-title">
              <img :src="poem.image" />
              <div class="tang-dynasty">
                <span class="tang-dynasty-name">{{poem.title}}</span>
                <span class="tang-dynasty-author"><div class="line"/>
                  {{poem.author}}·{{poem.dynasty}}
                </span>
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
      const poems = await poem.fetchPoem({ count: 8 })
      this.poems = poems
    },
  },
}
</script>

<style scoped lang="scss">

@media screen and(min-width: 1500px){
  .poems{
    font-size: 20px;
  }
  .poems>div:nth-child(1){
    width: 37%;
  }
  .poems>div:nth-child(2){
    width: 49%;
  }
  .poems>div:nth-child(3){
    width: 48%;
  }
  .poems>div:nth-child(4){
    width: 38%;
  }
  .poems>div:nth-child(5){
    width: 21%;
  }
  .poems>div:nth-child(6){
    width: 29%;
  }
  .poems>div:nth-child(7){
    width: 29%;
  }
  .poems>div:nth-child(8){
    width: 39%;
  }
}

@media screen and(max-width:1500px)and(min-width: 1200px){
  .poems{
    font-size: 18px;
  }
  .poems>div:nth-child(1){
    width: 39%;
  }
  .poems>div:nth-child(2){
    width: 47%;
  }
  .poems>div:nth-child(3){
    width: 97%;
  }
  .poems>div:nth-child(4){
    width: 47%;
  }
  .poems>div:nth-child(5){
    width: 39%;
  }
  .poems>div:nth-child(6){
    width: 43%;
  }
  .poems>div:nth-child(7){
    width: 43%;
  }
  .poems>div:nth-child(8){
    width: 50%;
  }
}

@media screen and(max-width:1200px)and(min-width:1100px){
  .poems{
    font-size: 16px;
  }
  .poems>div:nth-child(1){
    width: 40%;
  }
  .poems>div:nth-child(2){
    width: 46%;
  }
  .poems>div:nth-child(3){
    width: 97%;
  }
  .poems>div:nth-child(4){
    width: 48%;
  }
  .poems>div:nth-child(5){
    width: 38%;
  }
  .poems>div:nth-child(6){
    width: 43%;
  }
  .poems>div:nth-child(7){
    width: 43%;
  }
  .poems>div:nth-child(8){
    width: 50%;
  }
}

@media screen and(max-width:1100px){
  .poems{
    font-size: 20px;
  }
  .poems>div{
    width: 97%;
  }
}


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
      padding-bottom: 1em;
      .poems-container{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
        background:url('https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/bg.png') no-repeat;
        background-size: 100%;
        background-position-y: 100%;
        background-color: #f8f8f8;
        margin-left: 0.5%;
        margin-right: 0.5%;
        padding: 3%;
        margin-top: 1%;
        font-family: 'SimSun';
        .tang-dynasty-title{
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 4.5em;
          img{
            width: 4.5em;
            margin-bottom: 1em;
          }
          .tang-dynasty{
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            .tang-dynasty-name{
              line-height: 1.5em;
              width: 1.25em;
              color: #45526B;
              font-size: 1em;
              text-align: center
            }
            .tang-dynasty-author{
              width: 1em;
              font-size: .6em;
              line-height: 1.3em;
              margin-left:.4em;
              text-align: center;
              .line{
                width: 1px;
                height: 3em;
                margin: .6em auto 0 auto;
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
          margin: 5.5em 1.5em 0 1.5em;
          color: #06266F;
          .poems-content{
            width: .875em;
            font-size: 14px;
            line-height: 24px;
            padding: 0 7px;
          }
        }
      }
    }
  }
}
</style>
