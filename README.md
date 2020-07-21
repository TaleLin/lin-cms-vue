
<p align="center">
  <a href="http://doc.cms.7yue.pro/">
    <img width="200" src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/left-logo.png">
  </a>
</p>

<p align="center">
  <a href="#简介">简介</a>&nbsp;|&nbsp;<a href="#快速上手">快速上手</a>&nbsp;|&nbsp;<a href="#版本日志">版本日志</a>
</p>

![](https://img.shields.io/badge/版本-0.3.5-3963bc.svg)
![](https://img.shields.io/badge/node-8.11.0+-3963bc.svg)
![](https://img.shields.io/badge/脚手架-vuecli3-3963bc.svg)
![](https://img.shields.io/badge/license-MIT-3963bc.svg)
![](https://img.shields.io/badge/developer-@vanoneang-3963bc.svg)
![](https://img.shields.io/badge/developer-@GongJS-3963bc.svg)
![](https://img.shields.io/badge/developer-@quanquan-3963bc.svg)

## 简介

Lin-CMS 是林间有风团队经过大量项目实践所提炼出的一套**内容管理系统框架**。

Lin-CMS 可以有效的帮助开发者提高 CMS 的开发效率。

Lin-CMS 是一套前后端完整的解决方案，后端部署请移步：

[lin-cms-koa](https://github.com/TaleLin/lin-cms-koa)

[lin-cms-flask](https://github.com/TaleLin/lin-cms-flask)

[lin-cms-spring-boot](https://github.com/TaleLin/lin-cms-spring-boot)

### 注意

**Lin-CMS 是工程类开源项目，不能保证无缝升级**

### 文档地址

[http://doc.cms.talelin.com/](http://doc.cms.talelin.com/)

### 线上 Demo

[http://face.cms.7yue.pro/](http://face.cms.7yue.pro/)

### 案例

[http://sleeve.7yue.pro/](http://sleeve.7yue.pro/)


### Lin CMS 的特点

Lin CMS 的构筑思想是有其自身特点的。下面我们阐述一些 Lin 的主要特点。

#### Lin CMS 是一个前后端分离的 CMS 解决方案

这意味着，Lin 既提供后台的支撑，也有一套对应的前端系统，当然双端分离的好处不仅仅在于此，我们会在后续提供`NodeJS`和`PHP`版本的 Lin。如果你心仪 Lin，却又因为技术栈的原因无法即可使用，没关系，我们会在后续提供更多的语言版本。为什么 Lin 要选择前后端分离的单页面架构呢？

首先，传统的网站开发更多的是采用服务端渲染的方式，需用使用一种模板语言在服务端完成页面渲染：比如 JinJa2、Jade 等。
服务端渲染的好处在于可以比较好的支持 SEO，但作为内部使用的 CMS 管理系统，SEO 并不重要。

但一个不可忽视的事实是，服务器渲染的页面到底是由前端开发者来完成，还是由服务器开发者来完成？其实都不太合适。现在已经没有多少前端开发者是了解这些服务端模板语言的，而服务器开发者本身是不太擅长开发页面的。那还是分开吧，前端用最熟悉的 Vue 写 JS 和 CSS，而服务器只关注自己的 API 即可。

其次，单页面应用程序的体验本身就要好于传统网站。

#### 框架本身已内置了 CMS 常用的功能

Lin 已经内置了 CMS 中最为常见的需求：用户管理、权限管理、日志系统等。开发者只需要集中精力开发自己的 CMS 业务即可

#### Lin CMS 本身也是一套开发规范

Lin CMS 除了内置常见的功能外，还提供了一套开发规范与工具类。换句话说，开发者无需再纠结如何验证参数？如何操作数据库？如何做全局的异常处理？API 的结构如何？前端结构应该如何组织？这些问题 Lin CMS 已经给出了解决方案。当然，如果你不喜欢 Lin 给出的架构，那么自己去实现自己的 CMS 架构也是可以的。但通常情况下，你确实无需再做出架构上的改动，Lin 可以满足绝大多数中小型的 CMS 需求。

举例来说，每个 API 都需要校验客户端传递的参数。但校验的方法有很多种，不同的开发者会有不同的构筑方案。但 Lin 提供了一套验证机制，开发者无需再纠结如何校验参数，只需模仿 Lin 的校验方案去写自己的业务即可。

还是基于这样的一个原则：**Lin CMS 只需要开发者关注自己的业务开发，它已经内置了很多机制帮助开发者快速开发自己的业务**。

## 快速上手

```sh
# clone the project
git clone https://github.com/TaleLin/lin-cms-vue.git

# install dependency
npm install or yarn

# develop
npm run serve or yarn (run) serve
```

## 讨论交流
微信公众号搜索：林间有风
<br>
<img class="QR-img" src="http://i1.sleeve.7yue.pro/wechat-account.jpeg" width="150" height="150">

QQ群搜索：Lin CMS 官方交流群 或 814597236

<img src="https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/lin-cms.png" width="150" height="205" >

## 版本日志

最新版本 `0.3.6`

### 0.3.6

1. `F` 修复一级菜单双击报错
2. `U` 统一不同编辑器换行符
3. `U` 内容提交使用“加载中”按钮
4. `F` 修复Table组件不能居中问题
5. `F` 编辑用户时，至少选择一个分组

### 0.3.5

1. `F` 统一前端规范，文件夹、文件名统一用单数和小写字母中划线形式
2. `A` 新增右键关闭历史记录
3. `F` 调整默认 dialog 样式

### 0.3.4

1. `U` 优化变量命名，升级 `element-ui` 版本，
2. `F` `Home` 组件改为异步加载

### 0.3.3

1. `A` 新增消息中心组件

### 0.3.2

1. `A` 新增图表插件

### 0.3.1

1. `F` 增加历史栏高度

### 0.3.0

1. `A` 新增一个用户可以属于多个分组
2. `F` 权限相关 auth right 统一替换为 permission

### 0.2.2

1. `F` 修复 tinymce 富文本动态绑定问题
2. `U` 保持代码风格一致优化

### 0.2.1

1. `A` 新增一键清除 reuse tab
2. `A` 新增侧边导航搜索，可在 config 配置是否启用
3. `F` 修复 post put 等请求不能自动重发问题
4. `U` 优化异常处理，框架默认弹出前端配置异常信息，可通过 handleError 和 showBackend 控制本次请求是否开发者自行处理和是否直接展示后端返回异常信息
5. `C` 登录用户名字段由 nickname -> username，同时新增 nickname 为昵称字段，可以更新昵称(需后端同步修改)
6. `U` 优化了一些移动端适配
7. `C` 列表信息字段由 collection -> items, total_nums -> total, 增加 count、page、total_page字段（需后端同步修改）

### 0.2.0

1. `A` 新增图像上传、图像预览、富文本等自定义组件
2. `A` 新增 lin-cms-ui 多个基础组件

### 0.1.0-beta.3

1. `U` 首页更新为 card 设计
2. `A` 新增头像上传
3. `A` 新增单元测试
2. `A` 新增switch、rate、tabs、link、tag组件

### 0.1.0-beta.2

1. `F` 修复无感知刷新令牌异常
2. `A` 新增入场动画
3. `A` 新增全屏功能
2. `A` 新增Icon、Form组件

### 0.1.0-beta.1

1. `U` 新UI界面
2. `A` button组件、table组件
3. `F` 修复令牌刷新异常

### 0.0.1-alpha.3

1.  `A` 添加插件机制
2.  `U` 重构路由设计
2.  `A` 可配置三级路由导航

### 0.0.1-alpha.2

1.  `U` 升级到 `vue-cli3.4` 
2.  `A` 慕课网专题插件

### 0.0.1-alpha.1

1.  `A` 初始化内测版

