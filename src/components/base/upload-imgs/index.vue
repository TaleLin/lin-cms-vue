<!--
 Component: UploadPicture
 Describe: 图像预览上传加排序组件
 Attribute:
 - sortable {Boolean} false 是否可排序
 - preview {Boolean} true 是否可预览
 - multiple {Boolean} false 是否可以一次多选
 - minNum {Number} 0 最少图片数量
 - maxNum {Number} 0 最多图片数量, 0 表示无限制
 - before-upload {Function} null 上传前自定义校验函数
 - remoteFuc {Function} null 重写远程方法
 - accept {String} image/* 运行上传的类型
 - rules {Object} {} 图像规则
 - value {Array} [] 初始化数据
 - fit {String} contain 图像显示形式
 - autoUpload {Boolean} true 新增图片是是否自动上传
 - disabled {Boolean} false 是否禁用
 - width {Nulber|String} 200 宽度
 - height {Number|String} 200 高度
 - clearable {Boolean} true 是否可清空

 Method
 - upload-begin 开始上传
 - upload-abort 终止上传
 - upload-success 上传成功
 - upload-error 上传失败
 - upload-finish 上传结束

{
  ratio: <Array> 比例 [宽，高] 也可传 [宽, 高, 缩放比例], 当仅有宽高比限制时, 用于计算展示宽高. 若不传第三个数则当做1
  width: <Number> 宽度必需等于
  height: <Number> 高度必需等于
  minWidth: <Number> 最小宽
  minHeight: <Number> 最小高
  minSize: <Number> 最小size（Mb）
  maxSize: <Number> 最大size（Mb）
}
-->

<template>
  <div class="imgs-upload-container" v-loading="loading">
    <template v-for="(item, i) in itemList">
      <template v-if="item.display">
        <div class="thumb-item" :key="item.id" :style="boxStyle" v-loading="item.loading">
          <el-image
            class="thumb-item-img"
            :src="item.display"
            :fit="fit"
            style="width: 100%; height: 100%;"></el-image>
          <div class="control">
            <i v-if="!disabled" class="el-icon-close del" @click.prevent.stop="delItem(item.id)" title="删除"></i>
            <div v-if="!disabled" class="preview" title="更换图片" @click.prevent.stop="handleClick(item.id)">
              <i class="el-icon-edit"></i>
            </div>
            <div class="control-bottom" v-if="sortable || preview">
              <i
                v-if="sortable && !disabled"
                title="前移"
                class="control-bottom-btn el-icon-back"
                :class="{disabled: (i === 0)}"
                @click.stop="move(item.id, -1)"></i>
              <i
                v-if="preview"
                class="control-bottom-btn el-icon-view"
                title="预览"
                style="cursor: pointer;"
                @click.stop="previewImg(item, i)"></i>
              <i
                v-if="sortable && !disabled"
                title="后移"
                class="control-bottom-btn el-icon-right"
                :class="{disabled: (i === (itemList.length - 1))}"
                @click.stop="move(item.id, 1)"></i>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="upload-item"
          :class="{'disabled': disabled}"
          :key="item.id"
          :style="boxStyle"
          @click="handleClick(item.id)"
          @keydown="handleKeydown($event, item.id)">
          <i class="el-icon-plus" style="font-size: 3em;"></i>
          <div v-html="rulesTip.join('<br>')" style="margin-top: 1em;"></div>
        </div>
      </template>
    </template>
    <input
      class="item__input"
      type="file"
      ref="input"
      @change="handleChange"
      :multiple="!isStable && multiple"
      :accept="accept" />
  </div>
</template>

<script>
const ONE_KB = 1024
const ONE_MB = ONE_KB * 1024

/** 生成随机字符串 */
function createId() {
  return Math.random().toString(36).substring(2)
}

/**
 * 创建项, 如不传入参数则创建空项
 * @returns {Item}
 */
function createItem(data = null, oldData = null) {
  let item = {
    loading: false,
    id: createId(),
    status: 'input', // new/edit/del/init/input
    display: '',
    src: '',
  }
  // 未传入data, 说明是单纯新建, 单纯新建的值是输入框状态
  if (!data) {
    return item
  }
  // 没有id, 说明是用户点击选择的本地图片
  if (!data.id) {
    if (oldData) {
      // 如果旧数据状态是输入框, 则为新图片
      if (oldData.status === 'input') {
        item.status = 'new'
      }
      // 如果旧数据状态是初始化 init, 则为修改
      if (oldData.status === 'init' || oldData.status === 'edit') {
        item.status = 'edit'
      }
    } else {
      item.status = 'new'
    }

    item.id = oldData.id || item.id
    item.src = ''
    item.display = data.localSrc || item.display
    item = Object.assign({}, data, item)
    return item
  }

  // 存在id, 说明是传入已存在数据
  item.id = data.id
  item.src = data.src || item.src
  item.display = data.display || item.display
  item.status = data.status || 'init'
  item = Object.assign({}, data, item)
  return item
}

/**
 * 获取范围类型限制的提示文本
 * @param {String} prx 提示前缀
 * @param {Number} min 范围下限
 * @param {Number} max 范围上限
 * @param {String} unit 单位
 */
function getRangeTip(prx, min, max, unit = '') {
  let str = prx
  if (min && max) { // 有范围限制
    str += ` ${min}${unit}~${max}${unit}`
  } else if (min) { // 只有最小范围
    str += ` ≥ ${min}${unit}`
  } else if (max) { // 只有最大范围
    str += ` ≤ ${max}${unit}`
  } else { // 无限制
    str += '无限制'
  }
  return str
}

export default {
  name: 'UploadImgs',
  data() {
    return {
      itemList: [],
      loading: false,
      currentId: '', // 正在操作项的id
    }
  },
  props: {
    /** 每一项宽度 */
    width: {
      type: [Number, String],
      default: 160,
    },
    /** 每一项高度 */
    height: {
      type: [Number, String],
      default: 160,
    },
    /** 是否开启自动上传 */
    autoUpload: {
      type: Boolean,
      default: true,
    },
    /** 初始化数据 */
    value: {
      type: Array,
      default: () => [],
    },
    /** 接受的文件类型 */
    accept: {
      type: String,
      default: 'image/*',
    },
    /** 最少图片数量 */
    minNum: {
      type: Number,
      default: 0,
    },
    /** 最多图片数量, 0 表示无限制 */
    maxNum: {
      type: Number,
      default: 0,
    },
    /** 是否可排序 */
    sortable: {
      type: Boolean,
      default: false,
    },
    /** 是否可预览 */
    preview: {
      type: Boolean,
      default: true,
    },
    /** 是否可以一次多选 */
    multiple: {
      type: Boolean,
      default: false,
    },
    /** 图像验证规则 */
    rules: {
      type: [Object, Function],
      default: () => {},
    },
    /** 是否禁用, 禁用后只可展示 不可进行编辑操作, 包括: 新增, 修改, 删除, 改变顺序 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 是否可清空 */
    clearable: {
      type: Boolean,
      default: false,
    },
    /** 上传前插入方法, 属于高级用法 */
    beforeUpload: {
      type: Promise,
      default: null,
    },
    /** 重写上传方法, 如果重写则覆盖组件内上传方法 */
    uploadFuc: {
      type: [Function, Promise],
      default: null,
    },
    /** 图像显示模式 */
    fit: {
      type: String,
      default: 'contain',
    },
    suffix: {
      type: Array,
      default: () => ['jpg', 'jpeg', 'png', 'webp'],
    },
  },
  computed: {
    /** 每项容器样式 */
    boxStyle() {
      const { width, height, disabled } = this
      const style = {}
      if (typeof width === 'number') {
        style.width = `${width}px`
      } else if (typeof width === 'string') {
        style.width = width
      }
      if (typeof height === 'number') {
        style.height = `${height}px`
      } else if (typeof height === 'string') {
        style.height = height
      }
      if (disabled) {
        style.cursor = 'not-allowed'
      } else {
        style.cursor = 'pointer'
      }

      /** 提示字体最大尺寸 */
      let fontSize = 12
      /** 每行提示预设 */
      const maxText = 8
      if (typeof width === 'number' && (width / maxText) < 12) {
        fontSize = (width / 15).toFixed(2)
      }
      style.fontSize = `${fontSize}px`
      style.textAlign = 'center'
      style.position = 'relative'
      style.display = 'flex'
      style.alignItems = 'center'
      style.justifyContent = 'center'
      style.overflow = 'hidden'
      style.lineHeight = '1.3'
      style.flexDirection = 'column'

      return style
    },
    /**
     * 上传图像数量下限
     * @returns {Number}
     */
    min() {
      const { minNum } = this
      return minNum < 0 ? 0 : parseInt(minNum, 10)
    },
    /**
     * 上传图像数量上限
     * @returns {Number}
     */
    max() {
      const { min, maxNum } = this
      // 兼容用最大值小于最小值情况
      return (maxNum < min) ? min : parseInt(maxNum, 10)
    },
    /**
     * 是否是固定数量(最小等于最大)
     * @returns {Boolean}
     */
    isStable() {
      const { min, max } = this
      return (max !== 0) && (min === max)
    },
    /** 构造图像规范提示 */
    rulesTip() {
      const { rules } = this
      const tips = []

      /** 图像验证规则 */
      let basicRule
      // 针对动态规则模式, 获取输入为空时的规则
      // 动态规则 rule 为函数, 当选择图片后根据选择的图片生成校验规则
      if (typeof rules === 'function') {
        try {
          basicRule = rules()
        } catch (err) {
          basicRule = {}
        }
      } else {
        basicRule = rules
      }

      // 宽高限制提示语
      if (basicRule.width && basicRule.height) { // 固定宽高限制
        tips.push(`宽高 ${basicRule.width}x${basicRule.height}`)
      } else if (basicRule.width) { // 固定宽限制
        tips.push(`宽度 ${basicRule.width}`)
        tips.push(`${getRangeTip('高度', basicRule.minHeight, basicRule.maxHeight)}`)
      } else if (basicRule.height) { // 固定高限制
        tips.push(`高度 ${basicRule.height}`)
        tips.push(`${getRangeTip('宽度', basicRule.minWidth, basicRule.maxWidth)}`)
      } else { // 宽高都不固定
        tips.push(`${getRangeTip('宽度', basicRule.minWidth, basicRule.maxWidth)}`)
        tips.push(`${getRangeTip('高度', basicRule.minHeight, basicRule.maxHeight)}`)
      }

      // 宽高比限制提示语
      if (basicRule.ratio) {
        if (Array.isArray(basicRule.ratio)) {
          tips.push(`宽高比 ${basicRule.ratio.join(':')}`)
        } else {
          tips.push(`宽高比 ${basicRule.ratio}`)
        }
      }

      // 文件大小
      if (basicRule.minSize || basicRule.maxSize) {
        tips.push(getRangeTip('文件大小', basicRule.minSize, basicRule.maxSize, 'Mb'))
      }

      return tips
    },
  },
  watch: {
    /** 初始化值修改时重新初始化, 并且清空当前的编辑状态 */
    value(val) {
      // 初始化数据
      this.initAll(val)
      // 清除所有 input 状态
      // 初始化拖拽状态
    },
  },
  mounted() {
    this.initAll(this.value)
    // 初始化 Draggable
  },
  methods: {
    async getValue() {
      const { itemList, isStable, min } = this

      // 检查是否有不符合要求的空项
      const l = isStable ? itemList.length : (itemList.length - 1)
      for (let i = 0; i < l; i += 1) {
        if (itemList[i].status === 'input') {
          this.$message.error('当前存在未选择图片, 请全部选择')
          return false
        }
      }
      if (l < min) {
        this.$message.error(`至少选择${min}张图片`)
        return false
      }
      // 提取需要上传文件
      const asyncList = []
      // 上传文件后获取对应key值
      const getAsyncItem = (item) => {
        if (!item.file) {
          return Promise.resolve(item)
        }
        // eslint-disable-next-line
        item.loading = true
        return this.$axios({
          method: 'post',
          url: '/cms/file/',
          data: {
            file: item.file,
          },
        }).then((res) => {
          if (!Array.isArray(res) || res.length !== 1) {
            throw new Error('upload error')
          }
          // 释放内存
          window.URL.revokeObjectURL(item.display)
          // eslint-disable-next-line
          item.display = res[0].url
          // eslint-disable-next-line
          item.src = res[0].key
          // eslint-disable-next-line
          item.file = null
          // eslint-disable-next-line
          item.loading = false
          return item
        }).catch((err) => {
          // eslint-disable-next-line
          item.loading = false
          console.error(err)
          this.$message.error('图像上传失败, 请重试')
          return false
        })
      }
      for (let i = 0; i < itemList.length; i += 1) {
        // 跳过上传组件
        if (itemList[i].status !== 'input') {
          asyncList.push(getAsyncItem(itemList[i]))
        }
      }
      const imgInfoList = await Promise.all(asyncList)
      // 如果有失败的上传, 则返回错误
      if (imgInfoList.some(item => !item)) {
        return false
      }
      // 如无错误, 表示图像都以上传, 开始构造数据
      return imgInfoList.map(item => ({
        id: item.status === 'new' ? '' : item.id,
        display: item.display,
        src: item.src,
      }))
    },
    /**
     * 删除某项
     */
    delItem(id) {
      const { itemList, isStable } = this
      // 根据id找到对应项
      const index = itemList.findIndex(item => (item.id === id))
      const blobUrl = itemList[index].display
      if (isStable) {
        // 固定数量图片, 删除后留下空项
        itemList[index] = createItem()
        this.itemList = [...itemList]
      } else {
        itemList.splice(index, 1)
      }
      // 释放内存
      window.URL.revokeObjectURL(blobUrl)
    },
    /**
     * 预览图像, 后续预览组件制作后替换
     */
    previewImg(data, index) {
      const images = []
      this.itemList.forEach((element) => {
        if (element.src) {
          images.push(element.src)
        }
      })
      this.$imagePreview({
        images,
        index,
      })
      // this.$confirm(`<img src="${data.display}" style="width: 100%; height: 100%" />`, '预览', {
      //   dangerouslyUseHTMLString: true,
      // })
    },
    /**
     * 移动图像位置
     */
    move(id, step) {
      const { itemList, isStable } = this
      // 找到操作的元素
      const index = itemList.findIndex(item => (item.id === id))
      // 边界检测
      if ((index + step) < 0 || (index + step) >= itemList.length) return
      // 非固定项时, 不可和最后一项输入换位子
      if (!isStable && (index + step) === (itemList.length - 1)) {
        if (itemList[itemList.length - 1].status === 'input') return
      }
      const i = itemList[index]
      const j = itemList[index + step]
      itemList[index] = j
      itemList[index + step] = i
      this.itemList = [...itemList]
    },
    /**
     * 验证上传的图像是否符合要求
     */
    async validateImg(imgInfo) {
      const { rules } = this
      let rule
      // 针对动态规则模式, 获取输入为空时的规则
      // 动态规则 rule 为函数, 当选择图片后根据选择的图片生成校验规则
      if (typeof rules === 'function') {
        try {
          rule = rules(imgInfo)
        } catch (err) {
          rule = {}
        }
      } else {
        rule = rules
      }
      // 宽高限制
      if (rule.width) {
        if (imgInfo.width !== rule.width) {
          throw new Error(`"${imgInfo.name}"图像宽不符合要求, 需为${rule.width}`)
        }
      } else {
        if (rule.minWidth && imgInfo.width < rule.minWidth) {
          throw new Error(`"${imgInfo.name}"图像宽不符合要求, 至少为${rule.minWidth}`)
        }
        if (rule.maxWidth && imgInfo.width > rule.maxWidth) {
          throw new Error(`"${imgInfo.name}"图像宽不符合要求, 至多为${rule.maxWidth}`)
        }
      }
      if (rule.height) {
        if (imgInfo.height !== rule.height) {
          throw new Error(`"${imgInfo.name}"图像高不符合要求, 需为${rule.height}`)
        }
      } else {
        if (rule.minHeight && imgInfo.height < rule.minHeight) {
          throw new Error(`"${imgInfo.name}"图像高不符合要求, 至少为${rule.minHeight}`)
        }
        if (rule.maxHeight && imgInfo.height > rule.maxHeight) {
          throw new Error(`"${imgInfo.name}"图像高不符合要求, 至多为${rule.maxHeight}`)
        }
      }

      // 宽高比限制提示语
      if (rule.ratio) {
        let ratio
        if (Array.isArray(rule.ratio)) {
          ratio = rule.ratio[0] / rule.ratio[1]
        } else {
          // eslint-disable-next-line
          ratio = rule.ratio
        }
        ratio = ratio.toFixed(2)
        if ((imgInfo.width / imgInfo.height).toFixed(2) !== ratio) {
          throw new Error(`"${imgInfo.name}"图像宽高比不符合要求, 需为${ratio}`)
        }
      }

      // 文件大小
      if (rule.minSize && imgInfo.size < rule.minSize * ONE_MB) {
        throw new Error(`"${imgInfo.name}"图像文件大小比不符合要求, 至少为${rule.minSize}Mb`)
      }
      if (rule.maxSize && imgInfo.size > rule.maxSize * ONE_MB) {
        throw new Error(`"${imgInfo.name}"图像文件大小比不符合要求, 至多为${rule.maxSize}Mb`)
      }

      return true
    },
    /**
     * 选择图像文件后处理, 包括获取图像信息, 验证图像等
     */
    async handleChange(e) {
      const { currentId } = this
      const { files } = e.target
      let imgInfoList

      if (!files) return
      /** 中间步骤缓存, 在出错时用于释放 createObjectURL 的内存 */
      let cache = []
      /**
       * 处理单个图片, 返回处理成功的图片数据
       * @param {File} file 图片文件
       */
      const handleImg = async (file) => {
        try {
          // 获取图像信息
          const info = await this.getImgInfo(file)
          cache.push(info)
          // 验证图像信息
          await this.validateImg(info)
          return info
        } catch (err) {
          // 往外抛异常
          throw err
        }
      }
      const asyncList = []
      for (let i = 0; i < files.length; i += 1) {
        asyncList.push(handleImg(files[i]))
      }
      try {
        imgInfoList = await Promise.all(asyncList)
        // 设置图片信息
        await this.setImgInfo(imgInfoList, currentId)
      } catch (err) {
        // 清空缓存
        for (let i = 0; i < cache.length; i += 1) {
          window.URL.revokeObjectURL(cache[i].localSrc)
        }
        cache = null
        console.error(err)
        this.$message.error(err.message)
      }
    },
    /**
     * 用户选择图片, 图片通过验证后设置图像数据
     */
    async setImgInfo(imgInfoList = [], currentId) {
      const { max } = this
      // 找到特定图像位置
      const index = this.itemList.findIndex(item => (item.id === currentId))
      // 释放内存
      window.URL.revokeObjectURL(this.itemList[index].display)
      // 替换图片
      this.itemList[index] = createItem(imgInfoList[0], this.itemList[index])
      // 追加图片
      // 最大图片数量限制
      let l = imgInfoList.length
      if (max && l > max) {
        l = max
      }
      for (let i = 1; i < l; i += 1) {
        this.itemList.push(createItem(imgInfoList[i]))
      }
      // 初始化图片
      this.initAll(this.itemList)
    },
    /**
     * 支持键盘操作
     */
    handleKeydown(e, id) {
      if (e.target !== e.currentTarget) return
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick(id)
      }
    },
    /**
     * 处理点击事件, 并转移到文件上传元素
     */
    handleClick(id) {
      if (!this.disabled) {
        this.currentId = id || ''
        this.$refs.input.value = null
        this.$refs.input.click()
      }
    },
    /**
     * 初始化 itemList
     */
    initItemList(val) {
      const { max, isStable, disabled } = this
      const result = []

      // 初始值不存在情况
      // 包括初始值不合法
      if (!val || !Array.isArray(val) || val.length === 0) {
        // 固定数量图像上传, 直接初始化固定数量的上传控件
        if (isStable) {
          for (let i = 0; i < max; i += 1) {
            result.push(createItem())
          }
          this.itemList = result
          return
        }
        // 如果不是固定上传数量, 则仅创建一个空项
        result.push(createItem())
        this.itemList = result
        return
      }

      // 存在初始值
      for (let i = 0; i < val.length; i += 1) {
        result.push(createItem(val[i]))
      }
      // 初始项小于最大数量限制, 并且处于可编辑状态, 并且最后一项不是input
      if ((max === 0 || val.length < max) && !disabled && val[val.length - 1].status !== 'input') {
        // 后面添加空项
        result.push(createItem())
      }
      this.itemList = result
    },
    /**
     * TODO: 预览初始化方法
     */
    initPreview() {
      // 清除预览实例
      if (!this.preview) {
        return
      }
      // 初始化新预览实例
      console.log('图像预览功能等待上线')
    },
    /**
     * 初始化
     * @param {object} val 初始化数据
     */
    initAll(val) {
      this.initItemList(val)
      this.initPreview()
    },
    /**
     * 获取图像信息
     */
    async getImgInfo(file) {
      const localSrc = window.URL.createObjectURL(file)
      return new Promise((resolve, reject) => {
        let image = new Image()
        image.src = localSrc
        image.onload = () => {
          resolve({
            localSrc,
            file,
            width: image.width,
            height: image.height,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
          })
          image = null
        }
        image.onerror = () => {
          reject(new Error('图像加载失败'))
          image = null
        }
      })
    },
    /** 清空全部图片 */
    clear() {
      this.initAll([])
    },
  },
}
</script>

<style lang="scss" scoped>
.imgs-upload-container {
  display: flex;
  flex-wrap: wrap;

  &:focus {
    outline: none;
  }

  .upload-item,
  .thumb-item {
    border: 1px dashed #d9d9d9;
    border-radius: 3px;
    transition: all .1s;
    color: #666666;
    margin-right: 1em;
    margin-bottom: 1em;

    &.disabled {
      color: #ababab;
    }

    &:not(.disabled):hover {
      border-color: #3963bc;
      color: #3963bc;
    }
  }

  .thumb-item {
    .control {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 0;
      background-color: rgba(0, 0, 0, .3);
      transition: all .3s;
      transition-delay: .1s;

      .del {
        background: #f4516c;
        color: white;
        position: absolute;
        display: inline-block;
        width: 14px;
        height: 14px;
        top: 0;
        right: 0;
        opacity: 0;
        border-radius: 0 0 0 14px;
        transition: all .1s;

        &::before {
          font-size: 12px;
          position: absolute;
          right: -1px;
          transform: scale(0.7);
        }

        &:hover {
          transform: translate(-3px, 3px) scale(1.5);
        }

      }

      .preview {
        color: white;
        font-size: 2em;
        transition: all .2s;

        &:hover {
          transform: scale(1.2);
        }
      }

      .control-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        color: white;
        background-color: rgba(0, 0, 0, .3);
        font-size: 1.5em;
        display: flex;
        justify-content: space-around;
        transform: translate(0, 100%);
        transition: all .2s;
        transition-delay: .1s;
        padding: 5px 0;

        .control-bottom-btn {
          transform: all .2s;

          &.disabled {
            color: #ababab;
            cursor: not-allowed;
          }

          &:not(.disabled):hover {
            transform: scale(1.2);
          }
        }
      }
    }

    &:hover {
      .control {
        opacity: 1;
      }

      .del {
        opacity: 1;

      }

      .control-bottom {
        transform: translate(0, 0);
      }
    }
  }

  .item__input {
    display: none;
  }
}
</style>
