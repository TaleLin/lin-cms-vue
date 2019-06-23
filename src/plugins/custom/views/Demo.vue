<template>
  <div class="lin-container">
    <div class="lin-title">插件ImgsUpload舞台页面</div>
    <div class="lin-wrap">
      <el-form label-width="220px">
        <el-form-item label="带初始化至少4张, 至多5张">
          <upload-imgs
            ref="uploadEle"
            :value="initData"
            :rules="rules"
            :multiple="true"
            :max-num="5"
            :min-num="4" />
            <div>
              <el-button @click="getValue">获取数据</el-button>
            </div>
        </el-form-item>
        <el-form-item label="普通示例">
          <upload-imgs :rules="rules" :multiple="true" />
        </el-form-item>
        <el-form-item label="禁用">
          <upload-imgs :rules="rules2" :multiple="true" :disabled="true" />
        </el-form-item>
        <el-form-item label="禁用+初始化">
          <upload-imgs :rules="rules2" :multiple="true" :disabled="true" :value="initData" />
        </el-form-item>
        <el-form-item label="禁用+初始化+不预览">
          <upload-imgs :rules="rules2" :multiple="true" :disabled="true" :value="initData" :preview="false" />
        </el-form-item>
        <el-form-item label="排序+固定数量">
          <upload-imgs
            :rules="rules2"
            :multiple="true"
            :min-num="3"
            :max-num="3"
            :sortable="true" />
        </el-form-item>
        <el-form-item label="最大数量">
          <upload-imgs :rules="rules" :multiple="true" :max-num="3" />
        </el-form-item>
        <el-form-item label="定制宽高-排序">
          <upload-imgs :rules="rules" :width="200" :height="150" :value="initData" :sortable="true" />
        </el-form-item>
        <el-form-item label="重新初始化">
          <upload-imgs :rules="rules" :width="200" :height="150" :value="initData1" :sortable="true" />
          <div>
            <el-button @click="changeData">重新初始化</el-button>
          </div>
        </el-form-item>
        <el-form-item label="图像缩略图展示模式">
          <upload-imgs :rules="rules" :width="200" :height="150" fit="cover" :value="initData" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import UploadImgs from '@/components/base/upload-imgs'

export default {
  name: 'ImgsUploadStage1',
  components: {
    UploadImgs,
  },
  data() {
    return {
      rules: {
        minWidth: 100,
        minHeight: 100,
        maxSize: 5,
      },
      rules2: {
        minWidth: 100,
        maxWidth: 2000,
      },
      initData1: [{
        id: '123',
        display: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        src: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
      }, {
        id: '12d3',
        display: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
        src: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
      }, {
        id: 'hahah',
        display: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
        src: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
      }],
      initData: [{
        id: '123',
        display: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
        src: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
      }, {
        id: '12d3',
        display: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
        src: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
      }, {
        id: 'hahah',
        display: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
        src: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
      }],
    }
  },
  // 计算属性设置
  computed: {},
  // 数据变更监听
  watch: {},
  mounted() {},
  // 当页面使用路由参数时, 参数部分变化触发的动作在本函数中操作
  // https://router.vuejs.org/zh/guide/advanced/navigation-guards.htmll#组件内的守卫
  // beforeRouteUpdate(to, from, next) {
  //   // this.name = to.params.name
  //   // this.init()
  //   // next()
  // },
  methods: {
    async getValue() {
      console.log(await this.$refs.uploadEle.getValue())
    },
    changeData() {
      this.initData1 = [{
        id: 'hahah',
        display: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
        src: 'http://img-home.7yue.pro/images/index/Lin_UI_%E5%B0%81%E9%9D%A2.png',
      }, {
        id: '12d3',
        display: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
        src: 'http://img-home.7yue.pro/images/index/Lin_cms_%E5%B0%81%E9%9D%A2.png',
      }]
    },
  },
}
</script>

<style scoped lang="scss">
</style>
