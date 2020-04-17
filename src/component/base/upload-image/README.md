# 多图上传

多图片上传组件 `UploadImgs`, 附有预览, 排序, 验证等功能 [演示效果](http://face.cms.7yue.pro/#/imgs-upload/stage1)

- 开箱即用
- 支持固定上传数量图片上传和不定数量图片上传
- 支持预览
- 支持排序
- 内置图像验证机制
- 内置支持 Lin-CMS 上传接口

## 基础示例

```vue
<upload-imgs ref="uploadEle" :value="initData" />

<script>
import UploadImgs from "@/component/base/upload-imgs";

export default {
  components: {
    UploadImgs
  },
  data() {
    return {
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5
      },
      initData: []
    };
  },
  methods: {
    getValue() {
      this.$refs.uploadEle.getValue();
    }
  }
};
</script>
```

### 初始化说明

初始化时传入数组, 如果初始化为空则传入空数组 `[]`, 如果已经存在内容, 内容结构要求如下:

|  属性   |     类型      | 是否必填 |             说明              |
| :-----: | :-----------: | :------: | :---------------------------: |
|   id    | String/Nuber  |    否    | 初始化数据的 id, 推荐有该数据 |
|  imgId  | String/Number |    否    |          图像资源 id          |
|   src   |    String     |    否    |         图像相对地址          |
| display |    String     |    是    |    图像完整地址, 用于展示     |

示例:

```js
const initData = [{
  id: '12d3',
  display: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
  src: '/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
  imgId: '238287',
}, {
  id: '17qr',
  display: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
  src: '/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
  imgId: '1232323',
}];
```

### 返回值说明

新上传的图像会有完整的图像信息

|    属性    |     类型      | 默认 |                         说明                          |
| :--------: | :-----------: | :--: | :---------------------------------------------------: |
|     id     | String/Nuber  | null |                    初始化数据的 id                    |
|   imgId    | String/Number | null |                      图像资源 id                      |
|    src     |    String     | null |                     图像相对地址                      |
|  display   |    String     | null |                     图像完整地址                      |
|   width    |    Number     | null |                       图像宽度                        |
|   height   |    Number     | null |                       图像高度                        |
|  fileName  |    String     | null |                        文件名                         |
|  fileSize  |     Numbr     | null |                       文件大小                        |
|  fileType  |    String     | null |    文件的媒体类型 (MIME), 针对部分文件类型做了检测    |
| isAnimated |    Boolean    | null | 是否是动图, 只有开启动图检测, 本值才有效, 否则为 null |

**注意:** 以上字段只针对新上传的图片, 初始化的图片如果没有传入字段, 则值为空

## props

|      参数      |     类型      |  默认值  |                                            说明                                            |
| :------------: | :-----------: | :------: | :----------------------------------------------------------------------------------------: |
|     value      |     Array     |    []    |                                         初始化数据                                         |
|  auto-upload   |    Boolean    |   true   |                                   新增图片是是否自动上传                                   |
|    disabled    |    Boolean    |  false   |                                          是否禁用                                          |
|    preview     |    Boolean    |   true   |                                         是否可预览                                         |
|    multiple    |    Boolean    |  false   |                                      是否可以一次多选                                      |
|    min-num     |    Number     |    0     |                                        最少图片数量                                        |
|    max-num     |    Number     |    0     |                                 最多图片数量, 0 表示无限制                                 |
| before-upload  |   Function    |   null   | 上传前自定义校验函数, 返回 true 表示校验成功, 否则校验失败不进行后续上传, 支持返回 Promise |
|   remote-fuc   |   Function    |   null   |                               重写远程方法, 支持返回 Promise                               |
|    sortable    |    Boolean    |  false   |                                         是否可排序                                         |
|     accept     |    String     | image/\* |                        允许上传的类型, 同 input 的 accept 属性配置                         |
| animated-check |    Boolean    |  false   |             是否需要检测是否是动图, 开启后返回数据中 isAnimated 表示是否是动图             |
|     rules      |    Object     |    {}    |                                          图像规则                                          |
|      fit       |    String     | contain  |                                        图像显示形式                                        |
|     width      | Nulber/String |   200    |                                       组件每项的宽度                                       |
|     height     | Number/String |   200    |                                       组件每项的高度                                       |

图像验证规则属性 rule 支持的验证规则有:

|     属性      |     类型     | 默认 |                                                 说明                                                  |
| :-----------: | :----------: | :--: | :---------------------------------------------------------------------------------------------------: |
|     ratio     | Array/Number | null |                                   比例 [宽，高], 或者 宽/高 的数值                                    |
|     width     |    Number    | null |                                             宽度必需等于                                              |
|    height     |    Number    | null |                                             高度必需等于                                              |
|   minWidth    |    Number    | null |                                                最小宽                                                 |
|   minHeight   |    Number    | null |                                                最小高                                                 |
|    minSize    |    Number    | null |                                            最小 size（Mb）                                            |
|    maxSize    |    Number    | null |                                            最大 size（Mb）                                            |
| allowAnimated |    Number    | null | 是否允许上传动图, 0 不检测, 1 不允许动图, 2 只允许动图. 要检查此项, 需设置属性 animated-check 为 true |

默认值为 `{ maxSize: 2 }` 图片文件大小限制 2M 内. 这与 lin-cms 服务端文件上传接口默认限制一致

## methods

|  方法名  | 参数 |                     说明                     |
| :------: | :--: | :------------------------------------------: |
| getValue |  无  | 获取当前组件的值, 如果验证不通过则返回 false |
|  clear   |  无  |               清空当前所选图片               |
|  reset   |  无  |     重置图片, 回到初始化数据状态(value)      |
