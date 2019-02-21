<template>
  <div class="about">
    <div class="header">
      <div class="title">
        <div class="welcome">
          <img src="../../assets/img/about/welcome.png" alt="">
          <!-- <span class="version">当前版本0.0.1-alpha1</span> -->
        </div>
        <p class="desc">您还可以通过 GitHub 地址下载源码:
          <span><a href="https://github.com/TaleLin/lin-cms-vue" target="block">前端仓库</a></span>
          <span><a href="https://github.com/TaleLin/lin-cms-flask" target="block">后端仓库</a></span></p>
      </div>
    </div>
    <div class="team">
      <div class="team-detail">
        <div class="team-box">
          <div class="team-title">产品团队</div>
          <ul class="team-ul">
            <li>
              <span class="shadow-box"><i class="team-shadow"></i></span>
              <span class="team-role">策划</span>
              <span class="team-name">七月</span>
            </li>
            <li>
              <span class="shadow-box"><i class="team-shadow"></i></span>
              <span class="team-role">研发</span>
              <span class="team-name">
                <ul>
                  <li>Pedro</li>
                  <li>一飞同学</li>
                  <li>凉面</li>
                </ul>
              </span>
            </li>
            <li>
              <span class="shadow-box"><i class="team-shadow"></i></span>
              <span class="team-role">设计</span>
              <span class="team-name">瓜瓜</span>
            </li>
          </ul>
        </div>
        <div class="team-icon">
          <img src="../../assets/img/about/team-icon.png" alt="">
        </div>
      </div>
      <div class="official-account">
        <div class="official-account-box">
          <img src="../../assets/img/about/qrcode.jpg" alt="">
          <p>扫码关注林间有风公众号</p>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
@import '~assets/styles/variable.scss';

.about {
  padding: 30px;
  .header {
    width: 100%;
    height: 180px;
    background-color: #F3F6FF;
    background-image: url('../../assets/img/about/header-bg.png');
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: 34% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .title {
      padding: 52px 0 52px 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .welcome {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 31px;
        cursor: pointer;
        img {
          width: 356px;
          height: 31px;
        }
        .version {
          display: inline-block;
          margin-left: 15px;
          height: 12px;
          line-height: 12px;
          font-size: 12px;
          color:#8C98AE;
          text-indent: 5px;
          border-left: 1px solid #8C98AE;
          transform: translateY(15px);
        }
      }
      .desc {
        margin-top: 14px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        color: #8C98AE;
        font-family: 'PingFangSC-Regular';
        span {
          color: $theme;
          margin-left: 10px;
        }
      }
    }
  }
  .team {
    margin-top: 30px;
    height: 200px;
    width: 100%;
    display: flex;
    flex: 1;
    .team-detail {
      position: relative;
      background-color: #F3F6FF;
      width: 600px;
      height: 100%;
      .team-box {
        padding: 35px 42px;
        .team-ul {
          margin-top: 20px;
          li {
            height: 20px;
            line-height: 20px;
            margin-bottom: 15px;
            font-size: 14px;
            .shadow-box{
              position: relative;
              display: inline-block;
              margin-right: 10px;
              width: 14px;
              height: 14px;
              border-radius: 14px;
              background-color: #DCE7FF;
              transform: translateY(2px);
              .team-shadow {
                position: absolute;
                top: 25%;
                left: 25%;
                display: inline-block;
                width: 6px;
                height: 6px;
                border-radius: 6px;
                background-color: #75A1FF;
              }
            }
            .team-role {
              display: inline-block;
              width: 30px;
              margin-right: 15px;
              font-family:'PingFangSC-Regular';
              font-weight:400;
              color:#45526B;
            }
            .team-name {
              font-family:'PingFangSC-Regular';
              font-weight:400;
              color: #8C98AE;
              ul{
                display: inline;
                li{
                  display: inline;
                  margin-right: 20px;
                }
              }
            }
          }
        }

      }
      .team-icon{
        position: absolute;
        top: 20px;
        right: 20px;
        width: 80px;
        height: 80px;
        background-color: #fff;
        border-radius: 40px;
        box-shadow: 0 0 30px 0 #CFD5E3;
        img{
          position: absolute;
          top: 14px;
          left: 20px;
          width: 40px;
          height: 46px;
        }
      }
    }
    .official-account {
      margin-left: 30px;
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: center;
      background-color: #F3F6FF;
      height: 100%;
      .official-account-box {
        padding: 0 35px;
        margin: 0 auto;
        img {
          width: 100px;
          height: 100px;
          margin: 0 auto;
        }
        p{
          height: 20xp;
          line-height: 20px;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 400px;
          color: #45526B;
        }
      }
    }
  }
}
</style>
