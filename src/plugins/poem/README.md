# 唐诗宋词:poem
唐诗宋词插件,是一个``AB型插件``,主要用于制作一个唐诗宋词展示页面,插件中为用户提供了获取唐诗宋词内容的api——``fetchPoem``。

## 插件文件目录

```
.
|——assets # 静态资源文件
|  └──images # 静态资源图片
|
|——models # 业务逻辑,api
|
|——views # 视图文件
|
|——config.js # 配置文件
|
|——router.js # 路由文件
|
└──info.json # 插件信息
```

## 事件:

|    Name   |   Argument   |      Desc      |
|   :----:  |:------------:|     :----:     |
| fetchPoem |    无参数     | 获取唐诗宋词的api|