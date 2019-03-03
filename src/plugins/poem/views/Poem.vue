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
              <div class="poems-title" v-if="poem.title.length>6&&poem.title.indexOf('·')!=-1">
                <img :src="poem.image" />
                <div class="poems-name">
                  <span class="song-lyrics">
                    <span v-for="title in poem.title.split('·')" :key="title.key">{{title}}</span>
                  </span>
                  <span class="name-author"><div class="line"/>
                    {{poem.author}}·{{poem.dynasty}}
                  </span>
                </div>
            </div>
            <div v-else class="tang-dynasty-title">
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
      poems: []
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
  .poems>div:nth-child(1){
    width: 40%;
  }
  .poems>div:nth-child(2){
    width: 54%;
  }
  .poems>div:nth-child(3){
    width: 50%;
  }
  .poems>div:nth-child(4){
    width: 44%;
  }
  .poems>div:nth-child(5){
    width: 25%;
  }
  .poems>div:nth-child(6){
    width: 33%;
  }
  .poems>div:nth-child(7){
    width: 33%;
  }
  .poems>div:nth-child(8){
    width: 45%;
  }
}

@media screen and(max-width:1500px)and(min-width: 1200px){
  .poems>div:nth-child(1){
    width: 44%;
  }
  .poems>div:nth-child(2){
    width: 50%;
  }
  .poems>div:nth-child(3){
    width: 97%;
  }
  .poems>div:nth-child(4){
    width: 52%;
  }
  .poems>div:nth-child(5){
    width: 42%;
  }
  .poems>div:nth-child(6){
    width: 47%;
  }
  .poems>div:nth-child(7){
    width: 47%;
  }
  .poems>div:nth-child(8){
    width: 55%;
  }
}

@media screen and(max-width:1200px){
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
      padding-bottom: 20px;
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
        padding: 1%;
        margin-top: 1%;
        font-family: 'SimSun';
        .poems-title{
          display: flex;
          flex-direction: column;
          width: 110px;
          align-items: center;
          margin-right: 15px;
          img{
            width: 90px;
            margin-bottom: 20px;
          }
          .poems-name{
            display:flex;
            flex-direction: row;
            align-items:flex-start;
            line-height: 30px;
            width: 30px;
            text-align: center;
            color: #45526B;
            .song-lyrics{
               display: flex;
               flex-direction: row;
               align-items: flex-start;
               margin-left: -13px;
            }
            .song-lyrics :nth-child(1){
              font-size: 20px;
              margin-right: 14px;
            }
            .song-lyrics :nth-child(2){
              font-size: 14px;
              line-height: 28px;
            }
            .name-author{
              font-size: 12px;
              line-height: 16px;
              margin-left:8px;
              .line{
                width: 1px;
                height: 40px;
                margin: 6px auto 0 auto;
                background: #45526B;
              }
            }
          }
        }
        .tang-dynasty-title{
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 90px;
          img{
            width: 90px;
            margin-bottom: 20px;
          }
          .tang-dynasty{
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            .tang-dynasty-name{
            line-height: 30px;
            width: 25px;
            text-align: center;
            color: #45526B;
            font-size: 20px;
            }
            .tang-dynasty-author{
              width: 12px;
              font-size: 12px;
              line-height: 16px;
              margin-left:8px;
              text-align: center;
              .line{
                width: 1px;
                height: 40px;
                margin: 6px auto 0 auto;
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
          margin: 110px 30px 0 30px;
          .poems-content{
            width: 16px;
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
