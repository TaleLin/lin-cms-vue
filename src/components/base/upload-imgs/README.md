# 多图上传

多图片上传组件 `UploadImgs`, 附有预览, 排序, 验证等功能 [演示效果](http://face.cms.7yue.pro/#/imgs-upload/stage1)

## 基础示例

```vue
<upload-imgs ref="uploadEle" :value="initData" />

<script>
import UploadImgs from "@/components/base/upload-imgs";

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

### 返回值说明

新上传的图像会有完整的图像信息

|    属性    |  类型   | 默认 |    说明    |
| :--------: | :-----: | :--: | :--------: |
|   width    | Number  | null |  图像宽度  |
|   height   | Number  | null |  图像高度  |
|    size    | Number  | null |  文件大小  |
| isAnimated | Boolean | null | 是否是动图 |

## props

|     参数      |     类型      |  默认值  |            说明            |
| :-----------: | :-----------: | :------: | :------------------------: |
|     value     |     Array     |    []    |         初始化数据         |
|  auto-upload  |    Boolean    |   true   |   新增图片是是否自动上传   |
|   disabled    |    Boolean    |  false   |          是否禁用          |
|    preview    |    Boolean    |   true   |         是否可预览         |
|   multiple    |    Boolean    |  false   |      是否可以一次多选      |
|    min-num    |    Number     |    0     |        最少图片数量        |
|    max-num    |    Number     |    0     | 最多图片数量, 0 表示无限制 |
| before-upload |   Function    |   null   |    上传前自定义校验函数    |
|  remote-fuc   |   Function    |   null   |        重写远程方法        |
|   sortable    |    Boolean    |  false   |         是否可排序         |
|    accept     |    String     | image/\* |       运行上传的类型       |
|  is-animated  |    Boolean    |  false   |   是否需要检测是否是动图   |
|     rules     |    Object     |    {}    |          图像规则          |
|      fit      |    String     | contain  |        图像显示形式        |
|     width     | Nulber/String |   200    |            宽度            |
|    height     | Number/String |   200    |            高度            |

图像验证规则属性 rule 支持的验证规则有:

|     属性      |  类型   | 默认 |      说明       |
| :-----------: | :-----: | :--: | :-------------: |
|     ratio     |  Array  | null |  比例 [宽，高]  |
|     width     | Number  | null |  宽度必需等于   |
|    height     | Number  | null |  高度必需等于   |
|   minWidth    | Number  | null |     最小宽      |
|   minHeight   | Number  | null |     最小高      |
|    minSize    | Number  | null | 最小 size（Mb） |
|    maxSize    | Number  | null | 最大 size（Mb） |
| allowAnimated | Boolean | true | 最大 size（Mb） |

默认值为 `{ maxSize: 2 }` 图片文件大小限制 2M 内. 这与 lin-cms 服务端文件上传接口默认限制一致

## methods

|  方法名  | 参数 |                     说明                     |
| :------: | :--: | :------------------------------------------: |
| getValue |  无  | 获取当前组件的值, 如果验证不通过则返回 false |
|  clear   |  无  |               清空当前所选图片               |
