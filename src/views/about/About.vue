<template>
  <div class="container">
    <div class="lin-info">
      <div class="lin-info-left">
        <div class="welcome">
          <img src="../../assets/img/about/welcome.png" class="welcome-title" alt="">
          <div class="subtitle">
            <div class="guide">您还可以点击林间有风官方网站，查看更多作品</div>
            <div class="link"><a href="http://www.7yue.pro" target="_blank">http://www.7yue.pro</a></div>
          </div>
        </div>
        <img class="welcome-bg" src="../../assets/img/about/header-bg.png" alt="">
      </div>
      <div class="lin-info-right">
        <div class="team-detail">
          <div class="team-box">
            <div class="team-title">产品团队</div>
            <ul class="team-ul">
              <li>
                <span class="shadow-box">
                  <i class="team-shadow"></i>
                </span>
                <span class="team-role">策划</span>
                <span class="team-name">七月</span>
              </li>
              <li>
                <span class="shadow-box">
                  <i class="team-shadow"></i>
                </span>
                <span class="team-role">研发</span>
                <span class="team-name">
                  <ul>
                    <li>Pedro</li>
                    <li>一飞</li>
                    <li>凉面</li>
                    <li>圈圈</li>
                    <li>家乐</li>
                    <li>jokky</li>
                  </ul>
                </span>
              </li>
              <li>
                <span class="shadow-box">
                  <i class="team-shadow"></i>
                </span>
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
    <div class="quantity-statistics">
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总访问量</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">711,590</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/img/about/icon1.png" alt="">
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">总用户数</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">51,862</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/img/about/icon2.png" alt="">
        </div>
      </div>
      <div class="quantity-item">
        <div class="quantity-detail">
          <div class="quantity-detail-box">
            <div class="quantity-title">新增访问量 (月)</div>
            <div class="quantity-border-line"></div>
            <div class="quantity">31,862</div>
          </div>
        </div>
        <div class="quantity-icon">
          <img src="../../assets/img/about/icon3.png" alt="">
        </div>
      </div>
    </div>
    <div class="information">
      <div class="personal">
        <div class="personal-title">个人信息</div>
        <img src="../../assets/img/about/avatar.png" class="personal-avatar" />
        <div class="personal-influence">
          <div class="personal-influence-item">
            <div class="personal-influence-num color1">5411</div>
            <div class="personal-influece-label">总访问量</div>
          </div>
          <div class="personal-influence-item">
            <div class="personal-influence-num color2">913</div>
            <div class="personal-influece-label">粉丝</div>
          </div>
          <div class="personal-influence-item">
            <div class="personal-influence-num color3">72</div>
            <div class="personal-influece-label">作品</div>
          </div>
        </div>
        <el-tabs v-model="activeName" class="personal-tabs">
            <el-tab-pane label="最新作品" name="first">
              <div class="content">How to Contribute to Open Source?</div>
            </el-tab-pane>
            <el-tab-pane label="最热作品" name="second">
              <div class="content">为什么程序员们愿意在GitHub上开源...</div>
            </el-tab-pane>
        </el-tabs>
      </div>
      <div class="article">
        <div class="article-title">文章</div>
        <div class="article-list">
          <div class="article-item" @click="handleArticle('https://opensource.guide/how-to-contribute/')">
            <img class="article-thumb" src="../../assets/img/about/open-source.jpg" alt="">
            <div class="article-detail">
              <p class="article-detail-title">How to Contribute to Open Source?</p>
              <div class="article-detail-content">
                Whether you just made your first open source contribution, or you’re looking for new ways to contribute, we hope you’re inspired to take action.
                Even if your contribution wasn’t accepted, don’t forget to say thanks when a maintainer put effort into helping you.
                Open source is made by people like you: one issue, pull request, comment, or high-five at a time.
              </div>
              <div class="article-tool">
                <div class="pubdate">一天前</div>
                <div class="article-about">
                    <span><i class="iconfont icon-shoucang"></i>37</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i class="iconfont icon-pinglun"></i>2384</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i class="iconfont icon-fenxiang"></i>56</span>
                </div>
              </div>
            </div>
          </div>
          <div class="article-item" @click="handleArticle('https://www.zhihu.com/question/269033309')">
            <img class="article-thumb" src="../../assets/img/about/open-source.jpg" alt="">
            <div class="article-detail article-last">
              <p class="article-detail-title">为什么程序员们愿意在GitHub上开源自己的成果给别人免费使用和学习？</p>
              <div class="article-detail-content">
                “Git的精髓在于让所有人的贡献无缝合并。而GitHub的天才之处，在于理解了Git的精髓。”来一句我们程序员们接地气的话：分享是一种快乐~
              </div>
              <div class="article-tool">
                <div class="pubdate">2019年5月26日</div>
                <div class="article-about">
                    <span><i class="iconfont icon-shoucang"></i>37</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i class="iconfont icon-pinglun"></i>2384</span>
                    <el-divider direction="vertical"></el-divider>
                    <span><i class="iconfont icon-fenxiang"></i>56</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
    }
  },
  methods: {
    handleArticle(link) {
      window.open(link)
    },
  },
}
</script>

<style scoped lang="scss">
.container {
  padding: 20px;
  .lin-info {
    display: flex;
    flex: 1;
    height: 320px;
    width: 100%;
    .lin-info-left {
      position: relative;
      width: 700px;
      height: 100%;
      background:rgba(69,119,255,1);
      box-shadow:0px 2px 14px 0px rgba(243,243,243,1);
      border-radius:8px;
      .welcome {
        margin: 40px 0 0 120px;
        .welcome-title{
          width: 366px;
          height: 31px;
        }
        .subtitle {
          display: flex;
          margin-top: 9px;
          color: #fff;
          .guide {
            margin-right: 20px;
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
          }
          .link {
            width:160px;
            height:22px;
            background:rgba(44,95,233,1);
            border-radius:11px;
            text-align: center;
            line-height: 20px;
            color:rgba(255,255,255,1);
          }
        }
      }
      .welcome-bg {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 527px;
        height: 161px;
      }
    }
    .lin-info-right {
      flex: 1;
      margin-left: 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      .team-detail {
        position: relative;
        height: 170px;
        background:rgba(255,176,139,1);
        box-shadow:0px 2px 14px 0px rgba(243,243,243,1);
        border-radius:8px;

        .team-box {
          padding: 20px 22px;

          .team-ul {
            margin-top: 20px;

            li {
              height: 20px;
              line-height: 20px;
              margin-bottom: 15px;
              font-size: 14px;

              .shadow-box {
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
                  background-color: #FFB9A4;
                }
              }

              .team-role {
                display: inline-block;
                width: 30px;
                margin-right: 15px;
                font-weight: 400;
                color: #45526B;
              }

              .team-name {
                font-weight: 400;
                color: #fff;

                ul {
                  display: inline;

                  li {
                    display: inline;
                    margin-right: 20px;
                  }
                }
              }
            }
          }

        }

        .team-icon {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 80px;
          height: 80px;
          background-color: #fff;
          border-radius: 40px;
          box-shadow: 0 0 30px 0 #CFD5E3;

          img {
            position: absolute;
            top: 14px;
            left: 20px;
            width: 40px;
            height: 46px;
          }
        }
      }
      .official-account {
        margin-top: 20px;
        flex-direction: column;
        justify-content: center;
        background:rgba(255,176,139,1);
        box-shadow:0px 2px 14px 0px rgba(243,243,243,1);
        border-radius:8px;
        height: 130px;

        .official-account-box {
          padding: 0 35px;
          margin: 0 auto;

          img {
            width: 80px;
            height: 80px;
            margin: 10px auto;
          }

          p {
            height: 20px;
            line-height: 20px;
            margin-top: 10px;
            font-size: 14px;
            font-weight: 400;
            color: #45526B;
            text-align: center;
          }
        }
      }
    }
  }
  .quantity-statistics {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    height: 140px;
    .quantity-item {
      display: flex;
      width: 32%;
      height:100%;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 14px 0px rgba(243,243,243,1);
      border-radius:8px;
      .quantity-detail {
        flex: 1;
        .quantity-detail-box{
          margin: 30px 0 0 30px;
          .quantity-title {
            margin-bottom: 2px;
            height: 20px;
            line-height: 20px;
            color: #495468;
            font-size: 14px;
            font-weight: 400;
          }
          .quantity-border-line {
            width:46px;
            height:2px;
            background:rgba(73,84,104,1);
          }
          .quantity {
            margin-top: 7px;
            height:48px;
            font-size:40px;
            color:rgba(73,84,104,1);
            line-height:48px;
            letter-spacing:2px
          }
        }
      }
      .quantity-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width:140px;
        height:100%;
        background:rgba(69,119,255,0.1);
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        img {
          width: 60px;
          height: 60px;
        }
      }
    }
  }
  .information {
    margin-top: 20px;
    display: flex;
    .personal {
      width: 320px;
      height: 100%;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 14px 0px rgba(243,243,243,1);
      border-radius:8px;
      .personal-title {
        margin: 20px 0 10px 20px;
        height: 22px;
        line-height: 22px;
        font-weight: 500;
        color: #596C8E;
        font-size: 16px;
      }
      .personal-avatar {
        width: 140px;
        height: 140px;
        margin: 0 auto 40px;
        border-radius: 75px;
        box-shadow: 0 0 30px 0 #CFD5E3;
      }
      .personal-influence {
        display: flex;
        justify-content: space-between;
        padding: 0 30px 40px;
        .personal-influence-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          .personal-influence-num {
            font-size: 28px;
            line-height: 34px;
            &.color1 {
              color: #00C292;
            }
            &.color2 {
              color: #FEC108;
            }
            &.color3 {
              color: #03A9F3;
            }
          }
          .personal-influece-label {
            font-size: 12px;
            font-weight: 400;
            color: #8C98AE;
            line-height: 17px;
          }
        }
      }
      .personal-tabs {
        margin-bottom: 20px;
      }
      .personal-tabs /deep/ .is-top {
        width: 320px;
        display: flex;
        justify-content: space-around;
      }
      .personal-tabs /deep/ .el-tabs__content {
        text-indent: 20px;
      }
    }
    .article {
      flex: 1;
      height: 100%;
      margin-left: 20px;
      padding: 20px;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 14px 0px rgba(243,243,243,1);
      border-radius:8px;
      .article-title {
        height: 22px;
        line-height: 22px;
        font-weight: 500;
        color: #596C8E;
        font-size: 16px;
        margin-bottom: 20px;
      }
      .article-list {
        cursor: pointer;
        .article-item {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;

          .article-thumb {
            width: 120px;
            height: 120px;
            border-radius: 8px;
            margin-right: 30px;
          }
          .article-detail {
            flex: 1;
            border-bottom: 1px #ECEDEF solid;
            margin-bottom: 20px;
            &.article-last {
              border-bottom: none;
              margin-bottom: 0;
            }
            .article-detail-title {
              height:22px;
              font-size:16px;
              font-weight:400;
              color:rgba(69,82,107,1);
              line-height:22px;
            }
            .article-detail-content {
              margin-top: 10px;
              font-size:14px;
              font-weight:400;
              color:rgba(140,152,174,1);
              line-height:22px;
            }
          }
          .article-tool {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 10px 0 20px 0;
            font-size:12px;
            line-height: 17px;
            font-weight: 400;
            color: #808DA3;
            .article-about {
              .iconfont {
                line-height: 17px;
                margin-right: 6px;
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
