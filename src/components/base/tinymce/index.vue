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
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/image'
import 'tinymce/plugins/code'
import 'tinymce/plugins/link'

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
      plugins: 'advlist table lists paste preview fullscreen image code link',
      // eslint-disable-next-line
      toolbar:' undo redo |fontselect fontsizeselect forecolor backcolor bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | link image | h1 h2 h3 blockquote table numlist bullist | preview fullscreen code',
      // eslint-disable-next-line
      images_upload_handler: async function(blobInfo, success, failure) {
        // eslint-disable-next-line
        let json
        const xhr = new XMLHttpRequest()
        xhr.withCredentials = false
        xhr.open('POST', `${_this.upload_url}`)
        // eslint-disable-next-line
        xhr.onload = function() {
          if (xhr.status !== 200) {
            failure(`HTTP Error: ${xhr.status}`)
            return
          }
          json = JSON.parse(xhr.responseText)
          if (json[0] && json[0].url) {
            success(json[0].url)
          } else {
            failure(`Invalid JSON: ${xhr.responseText}`)
          }
        }
        const formData = new FormData()
        formData.append('file', blobInfo.blob(), blobInfo.filename())
        xhr.send(formData)
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
