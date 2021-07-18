<template>
  <el-dialog
    center
    title="裁剪"
    width="300px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :model-value="cropVisible"
    custom-class="croppa-dialog"
  >
    <div style="text-align: center;">
      <div class="avatar-croppa-container">
        <vue-picture-cropper
          :boxStyle="{
            width: '100%',
            height: '100%',
            margin: 'auto',
            backgroundColor: '#f8f8f8',
          }"
          :img="originalImage"
          :options="{
            viewMode: 1, // 限制裁剪框不超过画布的大小
            aspectRatio: 1, // 头像使用长宽比为 1 裁剪
          }"
        />
      </div>
      <div style="margin-top: 1em;">通过鼠标滚轮调节头像大小</div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="switchStatus" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCrop" size="small">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import User from 'lin/model/user'
import { mapActions } from 'vuex'
import { post, put } from 'lin/plugin/axios'
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

export default {
  components: { VuePictureCropper },
  props: {
    originalImage: {
      type: String,
    },
    cropVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['switchCropVisible'],
  methods: {
    ...mapActions(['setUserAndState']),
    handleCrop() {
      // 获取裁剪数据
      const blob = cropper.getBlob()
      // 构造为文件对象
      const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })

      return post('/cms/file', {
        file,
      }).then(res => {
        // 清空输入框
        if (!Array.isArray(res) || res.length !== 1) {
          this.$message.error('头像上传失败, 请重试')
          return false
        }
        return put('/cms/user', {
          avatar: res[0].path,
        })
          .then(putRes => {
            if (putRes.code < window.MAX_SUCCESS_CODE) {
              this.$message({
                type: 'success',
                message: '更新头像成功',
              })
              this.switchStatus()
              // 触发重新获取用户信息
              return User.getInformation()
            }
            return Promise.reject(new Error('更新头像失败'))
          })
          .then(infoRes => {
            // eslint-disable-line
            // 尝试获取当前用户信息
            const user = infoRes
            this.setUserAndState(user)
          })
      })
    },
    switchStatus() {
      this.$emit('switchCropVisible', false)
    },
  },
}
</script>
