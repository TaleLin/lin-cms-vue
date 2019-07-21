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
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autolink'
// import 'tinymce/plugins/autoresize'
// import 'tinymce/plugins/autosave'
// import 'tinymce/plugins/bbcode'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/code'
import 'tinymce/plugins/codesample'
// import 'tinymce/plugins/colorpicker'
// import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/directionality'
// import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/help'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/image'
import 'tinymce/plugins/imagetools'
// import 'tinymce/plugins/importcss'
import 'tinymce/plugins/insertdatetime'
// import 'tinymce/plugins/legacyoutput'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
// import 'tinymce/plugins/media'
import 'tinymce/plugins/nonbreaking'
// import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/print'
// import 'tinymce/plugins/quickbars'
// import 'tinymce/plugins/save'
import 'tinymce/plugins/searchreplace'
// import 'tinymce/plugins/spellchecker'
// import 'tinymce/plugins/tabfocus'
import 'tinymce/plugins/table'
import 'tinymce/plugins/template'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/wordcount'

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
