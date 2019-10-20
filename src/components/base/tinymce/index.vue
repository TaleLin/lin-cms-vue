<template>
  <div>
    <editor id="tinymceEditor" :init="tinymceInit" v-model="content" :key="tinymceFlag"></editor>
  </div>
</template>
<script>
// eslint-disable-next-line
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme'
import './importAll'

export default {
  name: 'TinymceEditor',
  props: {
    height: {
      type: Number,
      default: 500,
    },
    width: {
      type: Number,
      default: undefined,
    },
    upload_url: {
      type: String,
      default: '',
    },
    showMenubar: {
      type: Boolean,
      default: true,
    },
    toolbar: {
      type: String,
      // eslint-disable-next-line
      default: ' undo redo |formatselect | bold italic strikethrough forecolor backcolor formatpainter | link image | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | preview fullscreen code',
    },
  },
  components: {
    Editor,
  },
  data() {
    return {
      tinymceFlag: 1,
      tinymceInit: {},
      content: '',
    }
  },
  created() {
    const _this = this
    this.tinymceInit = {
      skin_url: '/tinymce/skins/ui/oxide',
      language_url: '/tinymce/langs/zh_CN.js',
      language: 'zh_CN',
      height: this.height,
      width: undefined,
      browser_spellcheck: true, // 拼写检查
      branding: false, // 去水印
      elementpath: false, // 禁用编辑器底部的状态栏
      statusbar: false, // 隐藏编辑器底部的状态栏
      paste_data_images: true, // 允许粘贴图像
      menubar: this.showMenubar, // 隐藏最上方menu
      // eslint-disable-next-line
      plugins: 'print fullpage searchreplace autolink directionality visualblocks visualchars template codesample charmap hr pagebreak nonbreaking anchor toc insertdatetime wordcount textpattern help advlist table lists paste preview fullscreen image imagetools code link',
      toolbar: this.toolbar,
      // eslint-disable-next-line
      images_upload_handler: async function(blobInfo, success, failure) {
        const file = new File([blobInfo.blob()], blobInfo.filename(), {
          type: 'image/*',
        })
        _this.$axios({
          method: 'post',
          url: '/cms/file',
          data: {
            file,
          },
        }).then((res) => {
          if (res[0] && res[0].url) {
            success(res[0].url)
          }
        }).catch(err => failure(err))
      },
    }
  },
  watch: {
    // eslint-disable-next-line
    content: function() {
      this.$emit('change', this.content)
    },
  },
  activated() {
    this.tinymceFlag++
  },
}
</script>
