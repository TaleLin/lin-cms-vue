<template>
  <div class="lin-container">
    <div class="lin-title">画廊插件演示</div>
    <div class="lin-wrap container">
      <div class="imgs-upload-container">
        <div class="img-box" @click="preview(index)" v-for="(url, index) in thumbs" :key="index">
          <el-image class="thumb-item-img" :src="url" fit="cover" style="width: 100%; height: 100%;"></el-image>
          <div class="control">
            <div class="preview"><i class="el-icon-view"></i></div>
          </div>
        </div>
      </div>
    </div>
    <source-code
      link="https://github.com/TaleLin/lin-cms-vue/blob/master/src/plugins/LinCmsUi/views/table/TableCombo.vue"
    ></source-code>
  </div>
</template>

<script>
export default {
  data() {
    return {
      urls: [
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/gallery1.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/gallery2.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/gallery3.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/gallery4.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/gallery5.jpg',
      ],
      thumbs: [
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/thumb/gallery1.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/thumb/gallery2.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/thumb/gallery3.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/thumb/gallery4.jpg',
        'https://consumerminiaclprd01.blob.core.chinacloudapi.cn/miniappbackground/sfgmember/lin/gallery/thumb/gallery5.jpg',
      ],
    }
  },
  methods: {
    preview(index) {
      this.$imagePreview({
        images: this.urls,
        index,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px 30px;

  .imgs-upload-container {
    display: flex;
    flex-wrap: wrap;

    .img-box {
      border: 1px dashed #d9d9d9;
      border-radius: 3px;
      -webkit-transition: all 0.1s;
      transition: all 0.1s;
      color: #666666;
      margin-right: 1em;
      margin-bottom: 1em;
      width: 200px;
      height: 150px;
      cursor: pointer;
      font-size: 12px;
      text-align: center;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      line-height: 1.3;
      flex-direction: column;

      .el-image {
        width: 100%;
        height: 100%;
      }

      .control {
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
        background-color: rgba(0, 0, 0, 0.3);
        -webkit-transition: all 0.3s;
        transition: all 0.3s;
        -webkit-transition-delay: 0.1s;
        transition-delay: 0.1s;

        .preview {
          color: white;
          font-size: 2em;
          transition: all 0.2s;
        }
      }

      &:hover {
        .control {
          opacity: 1;
        }
      }
    }
  }
}
</style>
