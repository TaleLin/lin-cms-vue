<template>
  <el-dialog
    v-model="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    center
    custom-class="croppa-dialog"
    title="裁剪"
    width="300px"
  >
    <div class="cropper-content">
      <div class="avatar-croppa-container">
        <VuePictureCropper
          ref="pictureCropper"
          :boxStyle="{
            width: '100%',
            height: '100%',
            margin: 'auto',
            backgroundColor: '#f8f8f8',
          }"
          :img="originalImage"
          :options="{
            viewMode: 1,
            aspectRatio: 1,
          }"
        />
      </div>
      <div class="cropper-tip">通过鼠标滚轮调节头像大小</div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="closeCropper">取 消</el-button>
        <el-button size="small" type="primary" @click="handleCrop">确 定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import 'cropperjs/dist/cropper.css'
import '@/assets/style/realize/vue-picture-cropper.css'

import { useTemplateRef } from 'vue'
import VuePictureCropper from 'vue-picture-cropper'

import { useCurrentUserProfile } from './use-current-user-profile'
import { useAvatarCrop } from './use-avatar-crop'

defineOptions({
  name: 'AvatarCropDialog',
})

const { originalImage, userStore } = defineProps({
  originalImage: {
    type: String,
    default: '',
  },
  userStore: {
    type: Object,
    default: null,
  },
})

const visible = defineModel('visible', {
  type: Boolean,
  default: false,
})

const pictureCropper = useTemplateRef('pictureCropper')
const { updateProfile } = useCurrentUserProfile({ userStore })
const { closeCropper, handleCrop } = useAvatarCrop({
  close: () => {
    visible.value = false
  },
  pictureCropper,
  updateProfile,
})
</script>

<style scoped>
.cropper-content {
  text-align: center;
}

.cropper-tip {
  margin-top: 1em;
}
</style>
