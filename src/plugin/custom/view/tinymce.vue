<template>
  <div class="lin-container">
    <div class="lin-title">富文本舞台页面</div>
    <div class="lin-wrap"><tinymce @change="change" upload_url="http://dev.lin.colorful3.com/cms/file/" /></div>
  </div>
</template>

<script>
import Tinymce from '@/component/base/tinymce'

export default {
  data() {
    return {
      text: 'this is default content',
    }
  },
  components: {
    Tinymce,
  },
  methods: {
    change(val) {
      console.log(val)
    },
  },
}
</script>

<style scoped lang="scss"></style>
