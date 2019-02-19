<template>
  <div class="box">
    <div class="header">
      <p>慕课网精品课程</p>
    </div>
    <div class="course-box">
      <div class="course">
        <div class="mark">
          <div class="banner">
            <img class="" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/CMS-1.png" alt="">
          </div>
          <div class="content">
            <div class="title">微信小程序入门与实战 常用组件API开发技巧项目实战</div>
            <p>随着小程序生态的逐渐形成，小程序越来越多的出现在万千百姓的生活中，日活用户量高达两亿。门槛低、更易学、对个人开发者更加包容开放的特点也吸引了越来越多的人加入到“小程序程序员”的行列，尤其是解决“跨系统开发”这个难题之后，小程序也更多的吸引到了国内外更多的开发者。</p>
            <course-data></course-data>
          </div>
        </div>
        <div class="flag"></div>
      </div>
      <div class="course">
        <div class="mark">
          <div class="banner">
            <img class="" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/CMS-2.png" alt="">
          </div>
          <div class="content">
            <div class="title">全面系统 Python3入门+进阶课程 更快上手实际开发</div>
            <p>无论是大数据、人工智能还是机器学习，Python都是最热门的首选语言 ，这次课程，就将带你从基础入门Python3，掌握Python3.x 版本语法，并结合讲师实际工作经验讲解Python使用技巧以及数据结构等相关知识，并为你精心配套了练习题目及实战案例。巧妙的课程设计，在项目实践中学习Python编程本质。</p>
            <course-data></course-data>
          </div>
        </div>
        <div class="flag"></div>
      </div>
      <div class="course">
        <div class="row">
          <div class="banner">
            <img class="" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/CMS-3.png" alt="">
          </div>
          <div class="content">
            <div class="title">纯正商业级应用-微信小程序开发实战</div>
            <p>小程序的成功，让广大程序员早已不再纠结该不该学习小程序开发 ，但会纠结如何学习小程序开发，直到他们遇到了 “七月”老师，你可以自行看看七月老师其它课程的学员对他课程的真实评价，选择他的课，不需要纠结，更不需要犹豫</p>
            <course-data></course-data>
          </div>
        </div>
        <div class="flag"></div>
      </div>
      <div class="course">
        <div class="row">
        <div class="banner">
          <img class="" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/CMS-4.png" alt="">
        </div>
        <div class="content">
          <div class="title">Python Flask构建可扩展的RESTful API</div>
          <p>前后端分离大势所趋，本课程将构建一套优秀的RESTful API，可以适配小程序、App 、wap 、web前端页面，除此之外，课程扩展了Flask框架机制，培养编程思维，随心所欲玩转Flask</p>
          <course-data></course-data>
        </div>
        </div>
        <div class="flag"></div>
      </div>
      <div class="course">
        <div class="row">
        <div class="banner">
          <img class="" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/CMS-5.png" alt="">
        </div>
        <div class="content">
          <div class="title">微信小程序商城构建全栈应用</div>
          <p>通过开发一个已上线的小程序商城全栈应用，学会如何打造iOS，Android，Web多端适配的服务端标准API，掌握三端分离开发方式，理解现代Web的基本架构思想</p>
          <course-data></course-data>
        </div>
        </div>
        <div class="flag"></div>
      </div>
      <div class="course">
        <div class="row">
        <div class="banner">
          <img class="" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/CMS-6.png" alt="">
        </div>
        <div class="content">
          <div class="title">Python Flask高级编程</div>
          <p>通过一个项目的实践，深入浅出讲解Flask核心原理、剖析Flask源码，在解读Flask的同时，学习Python高级编程、培养面向对象思维，是市面上稀缺的优质课程</p>
          <course-data></course-data>
        </div>
        </div>
        <div class="flag"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import CourseData from '@/base/course-data/course-data'

export default {
  data() {
    return {

    }
  },
  components: {
    CourseData,
  },
}
</script>

<style scoped lang="scss">
.box {
  width: 100%;
  .header {
    color: #fff;
    margin-bottom: 30px;
    p {
      text-align: center;
      font-size: 24px;
    }
  }
  .course-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .course {
      width: 49%;
      background:#fff;
      border-radius:8px;
      margin-bottom: 20px;
      overflow: hidden;
      position: relative;
      .flag {
        position: absolute;
        left: 20px;
        top: 0;
        width:54px;
        height:66px;
        background:rgba(255,182,62,1);
        box-shadow:0px 2px 10px 0px rgba(68,83,132,0.5);
        border-radius:0px 0px 8px 8px;
      }
      .mark {
        max-height: 510px;
        .banner {
          width: 100%;
        }
        .content {
          padding: 30px 30px 20px 30px;
          .title {
            font-size:18px;
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:25px;
            letter-spacing:1px;
            margin-bottom: 19px;
          }
          p {
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(89,108,142,1);
            line-height:24px;
            margin-bottom: 60px;
          }
        }
      }
      .row {
        width: 100%;
        height: 240px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        .banner {
          width: 31%;
          img {
            width: 100%;
            height: 240px;
          }
        }
        .content {
          width: 70%;
          padding: 20px 30px;
          .title {
            font-size:18px;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:25px;
            letter-spacing:1px;
            margin-bottom: 19px;
          }
          p {
            height: 126px;
            overflow: hidden;
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(89,108,142,1);
            line-height:24px;
          }
        }
      }
    }
  }
}

</style>
