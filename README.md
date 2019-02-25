
<p align="center">
  <a href="http://doc.cms.7yue.pro/">
    <img width="200" src="https://consumervssalonqa01.blob.core.chinacloudapi.cn/vssaloncontainer/lin/left-logo.png">
  </a>
</p>

<p align="center">
  <a href="#简介">简介</a>&nbsp;|&nbsp;<a href="#快速上手">快速上手</a>&nbsp;|&nbsp;<a href="#下个版本开发计划">下个版本开发计划</a>
</p>

![](https://img.shields.io/badge/版本-0.0.1.alpha.1-3963bc.svg)
![](https://img.shields.io/badge/node-8.11.0+-3963bc.svg)
![](https://img.shields.io/badge/vue-~2.5.17-3963bc.svg)
![](https://img.shields.io/badge/脚手架-vuecli3-3963bc.svg)
![](https://img.shields.io/badge/element-~2.4.6-3963bc.svg)
![](https://img.shields.io/badge/license-MIT-3963bc.svg)
![](https://img.shields.io/badge/developer-@vanoneang-3963bc.svg)
![](https://img.shields.io/badge/developer-@GongJS-3963bc.svg)


## 简介

Lin-CMS 是林间有风团队经过大量项目实践所提炼出的一套**内容管理系统框架**。

Lin-CMS 可以有效的帮助开发者提高 CMS 的开发效率。

Lin-CMS 是一套前后端完整的解决方案，后端部署请移步[后端仓库](https://github.com/TaleLin/lin-cms-flask)。

### 文档地址

[http://doc.cms.7yue.pro/](http://doc.cms.7yue.pro/)

### 线上 Demo

[http://face.cms.7yue.pro/](http://face.cms.7yue.pro/)

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

## 下个版本开发计划

- [ ]  完成插件机制
- [ ]  添加消息推送机制
- [ ]  完善表单组件

