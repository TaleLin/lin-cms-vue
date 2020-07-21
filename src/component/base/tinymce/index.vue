<template>
  <div>
    <editor id="tinymceEditor" :init="tinymceInit" v-model="content" :key="tinymceFlag"></editor>
  </div>
</template>
<script>
// eslint-disable-next-line
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
import './import-all'

export default {
  name: 'TinymceEditor',
  props: {
    defaultContent: {
      type: String,
      default: '',
    },
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
      default: ` undo redo 
      | formatselect 
      | bold italic strikethrough forecolor backcolor formatpainter 
      | link image | alignleft aligncenter alignright alignjustify 
      | numlist bullist outdent indent 
      | removeformat 
      | preview fullscreen code`,
    },
    baseUrl: {
      type: String,
      default: '',
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
      language_url: `${this.baseUrl}/tinymce/langs/zh_CN.js`,
      skin_url: `${this.baseUrl}/tinymce/skins/ui/oxide`,
      content_css: `${this.baseUrl}/tinymce/skins/content/default/content.css`,
      language: 'zh_CN',
      height: this.height,
      width: undefined,
      browser_spellcheck: true, // 拼写检查
      branding: false, // 去水印
      elementpath: false, // 禁用编辑器底部的状态栏
      statusbar: false, // 隐藏编辑器底部的状态栏
      paste_data_images: true, // 允许粘贴图像
      menubar: this.showMenubar, // 隐藏最上方menu
      plugins: `print fullpage searchreplace autolink directionality visualblocks 
        visualchars template codesample charmap hr pagebreak nonbreaking anchor toc insertdatetime 
        wordcount textpattern help advlist table lists paste preview fullscreen image imagetools code link`,
      toolbar: this.toolbar,
      async images_upload_handler(blobInfo, success, failure) {
        const file = new File([blobInfo.blob()], blobInfo.filename(), {
          type: 'image/*',
        })
        _this
          .$axios({
            method: 'post',
            url: '/cms/file',
            data: {
              file,
            },
          })
          .then(res => {
            if (res[0] && res[0].url) {
              success(res[0].url)
            }
          })
          .catch(err => failure(err))
      },
    }
  },
  mounted() {
    if (this.defaultContent) {
      this.content = this.defaultContent
    }
  },
  watch: {
    content: {
      handler() {
        this.$emit('change', this.content)
      },
    },
    defaultContent: {
      handler() {
        this.content = this.defaultContent
      },
      immediate: true,
    },
  },
  activated() {
    this.tinymceFlag++
  },
}
</script>
