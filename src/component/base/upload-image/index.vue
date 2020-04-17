<!--
 Component: UploadImgs
 Describe: 多图片上传组件, 附有预览, 排序, 验证等功能

todo: 使用中间件模式优化信息装载和验证功能
todo: 文件判断使用 serveWorker 优化性能
-->

<template>
  <div class="upload-imgs-container" v-loading="loading">
    <template v-for="(item, i) in itemList">
      <template v-if="item.display">
        <div class="thumb-item" :key="item.id" :style="boxStyle" v-loading="item.loading">
          <el-image class="thumb-item-img" :src="item.display" :fit="fit" style="width: 100%; height: 100%;"></el-image>
          <div class="info">
            <i
              v-if="item.file"
              class="el-icon-upload wait-upload"
              @click.prevent.stop="delItem(item.id)"
              title="等待上传"
            ></i>
          </div>
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
                :class="{ disabled: i === 0 }"
                @click.stop="move(item.id, -1)"
              ></i>
              <i
                v-if="preview"
                class="control-bottom-btn el-icon-view"
                title="预览"
                style="cursor: pointer;"
                @click.stop="previewImg(item, i)"
              ></i>
              <i
                v-if="sortable && !disabled"
                title="后移"
                class="control-bottom-btn el-icon-right"
                :class="{ disabled: i === itemList.length - 1 }"
                @click.stop="move(item.id, 1)"
              ></i>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div
          class="upload-item"
          :class="{ disabled: disabled }"
          :key="item.id"
          :style="boxStyle"
          @click="handleClick(item.id)"
          @keydown="handleKeydown($event, item.id)"
        >
          <i class="el-icon-plus" style="font-size: 3em;"></i>
          <div v-html="rulesTip.join('<br>')" style="margin-top: 1em;"></div>
        </div>
      </template>
    </template>
    <input
      class="upload-imgs__input"
      type="file"
      ref="input"
      @change="handleChange"
      :multiple="multiple"
      :accept="accept"
    />
  </div>
</template>

<script>
import { getFileType, checkIsAnimated, isEmptyObj, createId } from './utils'

/**
 * 本地图像通过验证后构造的信息对象
 * @typedef {Object<string, number, any>} LocalFileInfo
 * @property {string} localSrc 本地图像预览地址
 * @property {File} file 本地图像文件
 * @property {number} width 宽
 * @property {number} height 高
 * @property {string} name 文件名
 * @property {number} size 文件大小
 * @property {string} type 文件的媒体类型 (MIME)
 * @property {Date} lastModified 文件最后修改时间
 * @property {boolean} isAnimated 是否是动态图, 如果不进行检测则为 null
 */

/**
 * 返回数据对象
 * 初始化的图片如果没有传入字段, 则值为空 null
 * @typedef {Object<string, number>} ReturnItem
 * @property {number|string} id 初始化数据的 id
 * @property {number|string} imgId 图像资源 id
 * @property {string} src 文件相对路径
 * @property {string} display 图像完整地址
 * @property {number} height 高
 * @property {number} width 宽
 * @property {string} fileName 文件名
 * @property {string} fileType 文件的媒体类型 (MIME), 针对部分文件类型做了检测
 * @property {boolean} isAnimated 是否是动态图, 如果不进行检测则为 null
 */

/**
 * 返回数据对象
 * @typedef {Object} ValidateRule
 * @property {array|number} ratio 比例 [宽，高], 或者 宽/高 的数值
 * @property {number} width 宽度必需等于
 * @property {number} height 高度必需等于
 * @property {number} minWidth 最小宽
 * @property {number} minHeight 最小高
 * @property {number} minSize 最小 size（Mb)
 * @property {number} maxSize 最大 size（Mb)
 * @property {number} allowAnimated 是否允许上传动图, 0 不检测, 1 不允许动图, 2 只允许动图. 要检查此项, 需设置属性 animated-check 为 true
 */

const ONE_KB = 1024
const ONE_MB = ONE_KB * 1024

/**
 * 创建项, 如不传入参数则创建空项
 * status 状态转换说明:
 *  - 如果不传入参数, 创建上传空项, status: input
 *  - 如果只传入 data, 不传入 oldData
 *    - data 是本地数据(数据中是否携带id), status: new
 *    - data 不是本地数据(来源可能是初始化或是其他), status 与原状态保持一致, 如果没有原状态就是 init
 *  - data 与 oldData 都传入
 *    - data 为本地数据, oldData 是 input/new, status: new
 *    - data 为本地数据, oldData 是 init/edit, status: edit
 *    - data 不是本地数据, status 与原状态保持一致, 如果没有原状态就是 init
 * @returns {Item}
 */
function createItem(data = null, oldData = {}) {
  let item = {
    loading: false,
    id: createId(),
    status: 'input', // new/edit/del/init/input
    src: '', // 图像相对地址
    display: '', // 图像完整地址, 用于显示
    imgId: '', // 图像资源 id
  }
  // 未传入data, 说明是单纯新建, 单纯新建的值是输入框状态
  if (!data) {
    return item
  }
  // 判断是否是本地图片
  if (data.file && !data.id) {
    if (!isEmptyObj(oldData)) {
      // 如果旧数据状态是输入框, 则为新图片
      if (oldData.status === 'input' || oldData.status === 'new') {
        item.status = 'new'
      }
      // 如果旧数据状态是初始化 init, 则为修改
      if (oldData.status === 'init' || oldData.status === 'edit') {
        item.status = 'edit'
      }
    } else {
      item.status = 'new'
    }

    // 本地数据初始化
    item.id = oldData.id || item.id
    item.src = ''
    item.imgId = ''
    item.display = data.localSrc || item.display
    item = Object.assign({}, data, item)
    return item
  }

  // 存在id, 说明是传入已存在数据
  item.id = data.id || createId()
  item.imgId = data.imgId || item.imgId
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
  if (min && max) {
    // 有范围限制
    str += ` ${min}${unit}~${max}${unit}`
  } else if (min) {
    // 只有最小范围
    str += ` ≥ ${min}${unit}`
  } else if (max) {
    // 只有最大范围
    str += ` ≤ ${max}${unit}`
  } else {
    // 无限制
    str += '无限制'
  }
  return str
}

/** for originUpload: 一次请求最多的文件数量 */
const uploadLimit = 10
/** for originUpload: 文件对象缓存 */
let catchData = []
/** for originUpload: 计时器缓存 */
let time

export default {
  name: 'UploadImgs',
  data() {
    return {
      itemList: [],
      loading: false,
      currentId: '', // 正在操作项的id
      globalImgPriview: '$imagePreview', // 全局图片预览方法名
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
      default: () => ({
        maxSize: 2,
      }),
    },
    /** 是否禁用, 禁用后只可展示 不可进行编辑操作, 包括: 新增, 修改, 删除, 改变顺序 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 上传前插入方法, 属于高级用法 */
    beforeUpload: {
      type: Function,
      default: null,
    },
    /** 重写上传方法, 如果重写则覆盖组件内上传方法 */
    remoteFuc: {
      type: Function,
      default: null,
    },
    /** 图像显示模式 */
    fit: {
      type: String,
      default: 'contain',
    },
    /** 检测是否是动图 */
    animatedCheck: {
      type: Boolean,
      default: false,
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
      if (typeof width === 'number' && width / maxText < fontSize) {
        fontSize = (width / maxText).toFixed(2)
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
      return maxNum < min ? min : parseInt(maxNum, 10)
    },
    /**
     * 是否是固定数量(最小等于最大)
     * @returns {Boolean}
     */
    isStable() {
      const { min, max } = this
      return max !== 0 && min === max
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
        basicRule = rules || {}
      }

      // 宽高限制提示语
      if (basicRule.width && basicRule.height) {
        // 固定宽高限制
        tips.push(`宽高 ${basicRule.width}x${basicRule.height}`)
      } else if (basicRule.width) {
        // 固定宽限制
        tips.push(`宽度 ${basicRule.width}`)
        tips.push(`${getRangeTip('高度', basicRule.minHeight, basicRule.maxHeight)}`)
      } else if (basicRule.height) {
        // 固定高限制
        tips.push(`高度 ${basicRule.height}`)
        tips.push(`${getRangeTip('宽度', basicRule.minWidth, basicRule.maxWidth)}`)
      } else {
        // 宽高都不固定
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

      // 是否动态图
      if (basicRule.allowAnimated && basicRule.allowAnimated > 0) {
        if (basicRule.allowAnimated === 1) {
          tips.push('不允许上传动图')
        } else if (basicRule.allowAnimated === 1) {
          tips.push('只允许上传动图')
        }
      }

      return tips
    },
  },
  watch: {
    /** 初始化值修改时重新初始化, 并且清空当前的编辑状态 */
    value(val) {
      // 初始化数据
      this.initItemList(val)
    },
  },
  mounted() {
    this.initItemList(this.value)
  },
  methods: {
    /**
     * 上传缓存中的图片
     * @param {Array} uploadList 需要上传的缓存集合, 集合中包含回调函数
     */
    uploadCatch(uploadList) {
      const data = {}
      uploadList.forEach((item, index) => {
        data[`file_${index}`] = item.img.file
      })
      return this.$axios({
        method: 'post',
        url: '/cms/file',
        data,
      })
        .then(res => {
          if (!Array.isArray(res) || res.length === 0) {
            throw new Error('图像上传失败')
          }

          const resObj = res.reduce((acc, item) => {
            acc[item.key] = item
            return acc
          }, {})

          uploadList.forEach((item, index) => {
            const remoteData = resObj[`file_${index}`]
            item.cb(remoteData)
          })
        })
        .catch(err => {
          uploadList.forEach(item => {
            item.cb(false)
          })
          let msg = '图像上传失败, 请重试'
          if (err.message) {
            // eslint-disable-next-line
            msg = err.message
          }
          console.error(err)
          this.$message.error(msg)
        })
    },
    /**
     * 内置上传文件方法, 使用 debounce 优化提交效率
     * 此处只能使用回调模式, 因为涉及 debounce 处理, promise 不可在外部改变其状态
     * @param {Object} img 需要上传的数据项
     * @param {Function} cb 回调函数
     */
    originUpload(img, cb) {
      // 并且一次最多上传文件数量设为可配置
      // 添加缓存
      catchData.push({
        img,
        cb,
      })

      // 等于上限, 立即上传
      if (catchData.length === uploadLimit) {
        const data = [...catchData]
        catchData = []
        clearTimeout(time)
        time = null
        return this.uploadCatch(data)
      }

      // 清除上次一的定时器
      if (time && catchData.length < uploadLimit) {
        clearTimeout(time)
        // 此时修改上一个 promise 状态为reslove
      }

      // 等待100ms
      time = setTimeout(() => {
        this.uploadCatch([...catchData])
        catchData = []
        time = null
      }, 50)
    },
    /**
     * 上传图像文件
     * @param {Object} 需要上传的项, 包含文化和其它信息
     */
    async uploadImg(item) {
      // 远程结果处理
      const reduceResult = (imgItem, res) => {
        // eslint-disable-next-line
        imgItem.loading = false
        if (!res) {
          return
        }
        // eslint-disable-next-line
        imgItem.display = res.url
        // eslint-disable-next-line
        imgItem.src = res.path
        // eslint-disable-next-line
        imgItem.imgId = res.id
        // eslint-disable-next-line
        imgItem.file = null
        window.URL.revokeObjectURL(imgItem.display)
      }

      if (item.status === 'input' || !item.file) {
        return
      }
      // eslint-disable-next-line
      item.loading = true
      if (this.beforeUpload && typeof this.beforeUpload === 'function') {
        if (typeof this.beforeUpload === 'function') {
          const result = await new Promise(resolve => {
            let beforeUploadResult
            try {
              beforeUploadResult = this.beforeUpload(item, data => {
                resolve(!!data)
              })
            } catch (err) {
              resolve(false)
            }
            // promise 模式
            if (beforeUploadResult != null && typeof beforeUploadResult.then === 'function') {
              beforeUploadResult
                .then(remoteData => {
                  resolve(!!remoteData)
                })
                .catch(() => {
                  resolve(false)
                })
            }
          })
          if (!result) {
            reduceResult(item, false)
            return false
          }
        }
      }
      // 如果是用户自定义方法
      // 出于简化 api 的考虑, 只允许单个文件上传, 不进行代理
      if (this.remoteFuc && typeof this.remoteFuc === 'function') {
        const result = await new Promise(resolve => {
          let remoteFucResult
          try {
            remoteFucResult = this.remoteFuc(item.file, remoteData => {
              resolve(remoteData || false)
            })
          } catch (err) {
            this.$message.error('执行自定义上传出错')
            resolve(false)
          }
          // promise 模式
          if (remoteFucResult != null && typeof remoteFucResult.then === 'function') {
            remoteFucResult
              .then(remoteData => {
                resolve(remoteData || false)
              })
              .catch(() => {
                resolve(false)
              })
          }
        })
        reduceResult(item, result)
        if (!result) {
          return false
        }
        return item
      }

      // 使用内置上传
      return new Promise(resolve => {
        this.originUpload(item, data => {
          reduceResult(item, data)
          if (!data) {
            resolve(false)
          } else {
            resolve(item)
          }
        })
      })
    },
    /**
     * 获取当前组件数据
     */
    async getValue() {
      const { itemList, isStable, min } = this

      // 检查是否有不符合要求的空项
      const l = isStable ? itemList.length : itemList.length - 1
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

      for (let i = 0; i < itemList.length; i += 1) {
        // 跳过上传组件
        if (itemList[i].status !== 'input') {
          if (!itemList[i].file) {
            asyncList.push(Promise.resolve(itemList[i]))
          } else {
            // 上传文件后获取对应key值
            asyncList.push(this.uploadImg(itemList[i]))
          }
        }
      }
      const imgInfoList = await Promise.all(asyncList)
      // const imgInfoList = this.itemList.filter(item => (item.status !== 'input'))

      // 检查是否有上传失败的图像
      // 如果有失败的上传, 则返回错误
      if (imgInfoList.some(item => !item)) {
        return false
      }

      // 如无错误, 表示图像都以上传, 开始构造数据
      /**
       * @type {array<ReturnItem>}
       */
      const result = imgInfoList.map(item => {
        /** @type {ReturnItem} */
        const val = {
          id: item.status === 'new' ? '' : item.id,
          imgId: item.imgId || null,
          src: item.src || null,
          display: item.display,
          width: item.width || null,
          height: item.height || null,
          fileSize: item.size || null,
          fileName: item.name || null,
          fileType: item.type || null,
          isAnimated: item.isAnimated || null,
        }
        return val
      })
      // 获取数据成功后发出
      this.$emit('upload', result)
      return result
    },
    /**
     * 删除某项
     * @param {Number|String} id 删除项 id
     */
    delItem(id) {
      const { itemList, isStable } = this
      // 根据id找到对应项
      const index = itemList.findIndex(item => item.id === id)
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
      this.initItemList(this.itemList)
    },
    /**
     * 预览图像
     * @param {Object} data 需要预览的项的数据
     * @param {Number} index 索引序号
     */
    previewImg(data, index) {
      // 如果有全局预览方法
      if (this[this.globalImgPriview]) {
        const images = []
        this.itemList.forEach(element => {
          if (element.display) {
            images.push(element.display)
          }
        })
        this[this.globalImgPriview]({
          images,
          index,
        })
      } else {
        // element 原生粗糙模式
        this.$confirm(`<img src="${data.display}" style="width: 100%;" />`, '预览', {
          dangerouslyUseHTMLString: true,
        })
      }
    },
    /**
     * 移动图像位置
     * @param {Number|String} id 操作项的 id
     * @param {Number} step 移动的偏移量
     */
    move(id, step) {
      const { itemList, isStable } = this
      // 找到操作的元素
      const index = itemList.findIndex(item => item.id === id)
      // 边界检测
      if (index + step < 0 || index + step >= itemList.length) return
      // 非固定项时, 不可和最后一项输入换位子
      if (!isStable && index + step === itemList.length - 1) {
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
     * @param {LocalFileInfo} imgInfo 图像信息, 包括文件名, 宽高
     */
    async validateImg(imgInfo) {
      const { rules } = this
      /** @type ValidateRule */
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

      if (rule.allowAnimated && rule.allowAnimated > 0) {
        if (imgInfo.isAnimated === null) {
          this.$message.error('要进行是否动图验证需要配置 "animated-check" 属性为 true')
        } else {
          if (rule.allowAnimated === 1 && imgInfo.isAnimated) {
            throw new Error(`"${imgInfo.name}"为动态图, 不允许上传`)
          }
          if (rule.allowAnimated === 2 && !imgInfo.isAnimated) {
            throw new Error(`"${imgInfo.name}"为静态图, 只允许上传动态图`)
          }
        }
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
     * @param {Event} e input change 事件对象
     */
    async handleChange(e) {
      const { currentId, autoUpload } = this
      const { files } = e.target
      let imgInfoList

      if (!files) return
      /** 中间步骤缓存, 在出错时用于释放 createObjectURL 的内存 */
      let cache = []
      /**
       * 处理单个图片, 返回处理成功的图片数据
       * @param {File} file 图片文件
       */
      const handleImg = async file => {
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
        this.setImgInfo(imgInfoList, currentId)
        // 开启自动上传
        if (autoUpload) {
          this.itemList.forEach(ele => {
            this.uploadImg(ele)
          })
        }
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
     * 根据信息列表设置图像信息
     * 用户选择图片, 图片通过验证后可获取到图像信息数组
     * 将这一组图像信息数据设置在 itemList 中
     * @param {Array<LocalFileInfo>} imgInfoList 需要设置的图像数组
     * @param {Number|String} id 操作项的 id
     */
    setImgInfo(imgInfoList = [], currentId) {
      const { max, itemList } = this
      // 找到特定图像位置
      const index = this.itemList.findIndex(item => item.id === currentId)
      // 释放内存
      window.URL.revokeObjectURL(this.itemList[index].display)
      // 替换图片
      this.itemList[index] = createItem(imgInfoList[0], this.itemList[index])

      // 如果需要设置的图像数量大于1, 需要执行追加图片逻辑
      if (imgInfoList.length > 1) {
        // 最大图片数量限制
        let l = imgInfoList.length
        if (this.isStable) {
          // 固定数量模式, 按次序插入空项
          for (let i = 0, k = 1; i < max && k < l; i += 1) {
            if (itemList[i].status === 'input') {
              this.itemList[i] = createItem(imgInfoList[k])
              k += 1
            }
          }
        } else {
          const empty = max - itemList.length
          if (max && l > empty) {
            l = empty
          }
          if (itemList[itemList.length - 1].status === 'input') {
            this.itemList.pop()
          }
          for (let i = 1; i <= l; i += 1) {
            this.itemList.push(createItem(imgInfoList[i]))
          }
        }
      }

      // 初始化图片
      this.initItemList(this.itemList)
    },
    /**
     * 支持键盘操作
     * @param {Event} e 键盘事件对象
     * @param {Number|String} id 操作项的 id
     */
    handleKeydown(e, id) {
      if (e.target !== e.currentTarget) return
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick(id)
      }
    },
    /**
     * 处理点击事件, 并转移到文件上传元素
     * 并记录当前操作元素 id
     * @param {Number|String} id 操作项的 id
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
     * @param {Array} val 初始化的数据数组
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
     * 获取图像信息
     * @param {File} file 文件对象
     * @returns {LocalFileInfo} 信息对象
     */
    async getImgInfo(file) {
      const { animatedCheck } = this
      const localSrc = window.URL.createObjectURL(file)
      // 严格检测文件类型
      const fileType = await getFileType(file)
      // 检测是否是动图
      let isAnimated = null
      if (animatedCheck) {
        isAnimated = await checkIsAnimated({ file, fileType, fileUrl: localSrc })
      }
      return new Promise((resolve, reject) => {
        let image = new Image()
        image.src = localSrc
        image.onload = () => {
          /**
           * @type {LocalFileInfo}
           */
          const localFileInfo = {
            localSrc,
            file,
            width: image.width,
            height: image.height,
            name: file.name,
            size: file.size,
            type: fileType === 'unknow' ? file.type : fileType,
            lastModified: file.lastModified,
            isAnimated,
          }
          resolve(localFileInfo)
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
      this.initItemList([])
      this.getValue()
    },
    /** 重置图片数据传入属性 */
    reset() {
      this.initItemList(this.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-imgs-container {
  display: flex;
  flex-wrap: wrap;

  &:focus {
    outline: none;
  }

  .upload-item,
  .thumb-item {
    border: 1px dashed #d9d9d9;
    border-radius: 3px;
    transition: all 0.1s;
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
    .info {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transition: all 0.3s;
      transition-delay: 0.1s;

      .wait-upload {
        background: #ffcb71;
        color: white;
        position: absolute;
        display: inline-block;
        width: 1.7em;
        height: 1.5em;
        top: 0;
        right: 0;
        border-radius: 0 0 0 1.4em;
        transition: all 0.1s;

        &::before {
          font-size: 1.4em;
          position: absolute;
          right: -1px;
          transform: scale(0.7);
        }
      }
    }

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
      background-color: rgba(0, 0, 0, 0.3);
      transition: all 0.3s;
      transition-delay: 0.1s;

      .del {
        background: #f4516c;
        color: white;
        position: absolute;
        display: inline-block;
        width: 1.7em;
        height: 1.5em;
        top: 0;
        right: 0;
        opacity: 0;
        border-radius: 0 0 0 1.4em;
        transition: all 0.1s;

        &::before {
          font-size: 1.4em;
          position: absolute;
          right: -1px;
          transform: scale(0.7);
        }

        &:hover {
          transform: translate(-0.5em, 0.4em) scale(1.5);
        }
      }

      .preview {
        color: white;
        font-size: 2em;
        transition: all 0.2s;

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
        background-color: rgba(0, 0, 0, 0.3);
        font-size: 1.5em;
        display: flex;
        justify-content: space-around;
        transform: translate(0, 100%);
        transition: all 0.2s;
        transition-delay: 0.1s;
        padding: 5px 0;

        .control-bottom-btn {
          transform: all 0.2s;

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

  .upload-imgs__input {
    display: none;
  }
}
</style>
