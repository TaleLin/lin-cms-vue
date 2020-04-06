# 图片预览插件

## methods

```
this.$imagePreview(options = {})
```

options有三个参数

参数 | 默认值 | 说明
--- | ---| ---
images | 空数组 | 图片的url数组
index | 0 | 预览图片的索引值, 默认是0
defaultOpt | {} | 配置项

defaultOpt 的配置项请参考[photoswipe配置项](http://photoswipe.com/documentation/options.html)，

```
defaultOpt: {
  fullscreenEl: true,
  shareEl: false,
  arrowEl: true,
  preloaderEl: true,
  loop: false,
  bgOpacity: 0.85,
  showHideOpacity: true,
  errorMsg: '<div class="pswp__error-msg">图片加载失败</div>',
}
```