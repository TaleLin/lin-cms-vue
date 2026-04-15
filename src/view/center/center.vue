<template>
  <PagePanel title="个人中心">
    <div class="center-content">
      <el-row>
        <el-col :lg="16" :md="20" :sm="24" :xs="24">
          <div class="user-section">
            <div class="section-title">用户信息</div>
            <div class="content">
              <div class="name-wrapper">
                <div class="label">昵称</div>
                <div class="name">
                  <el-input
                    v-model="editingNickname"
                    :suffix-icon="Edit"
                    placeholder="请输入内容"
                    size="small"
                    @blur="submitNicknameEdit"
                  />
                </div>
              </div>
              <div class="avatar" title="点击修改头像">
                <img :src="avatarSrc" alt="头像" />
                <label class="mask">
                  <Camera class="mask-icon" />
                  <input ref="avatarInput" accept="image/*" type="file" @change="handleAvatarFileChange" />
                </label>
              </div>
            </div>
          </div>

          <div class="password-section">
            <div class="section-title">修改密码</div>
            <el-form
              ref="formRef"
              v-loading="loading"
              :model="form"
              :rules="rules"
              label-position="left"
              label-width="90px"
              status-icon
              @submit.prevent
            >
              <el-form-item label="原始密码" prop="oldPassword">
                <el-input v-model="form.oldPassword" autocomplete="off" type="password" />
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" autocomplete="off" type="password" />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="form.confirmPassword" autocomplete="off" type="password" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitPasswordForm">保存</el-button>
                <el-button @click="resetPasswordForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>

    <Avatar v-model:visible="cropVisible" :original-image="cropImg" :user-store="userStore" />
  </PagePanel>
</template>

<script setup>
import { useTemplateRef } from 'vue'
import { Camera, Edit } from '@element-plus/icons-vue'

import defaultAvatar from '@/assets/image/user/user.png'
import PagePanel from '@/component/base/page-panel.vue'
import Avatar from '@/component/layout/avatar.vue'
import { useUserStore } from '@/store/modules/user'
import { useCenterProfile } from './use-center-profile'
import { useCenterPasswordForm } from './use-center-password-form'

defineOptions({
  name: 'CenterView',
})

const userStore = useUserStore()
const avatarInput = useTemplateRef('avatarInput')
const formRef = useTemplateRef('formRef')
const { form, loading, resetPasswordForm, rules, submitPasswordForm } = useCenterPasswordForm({
  formRef,
  userStore,
})
const { avatarSrc, cropImg, cropVisible, handleAvatarFileChange, editingNickname, submitNicknameEdit } =
  useCenterProfile({
    avatarInput,
    defaultAvatar,
    userStore,
  })
</script>

<style lang="scss" scoped>
.center-content {
  max-width: 800px;
}

.user-section {
  padding: 0 20px 25px 0;
  z-index: 100;
  position: relative;
  border-bottom: 1px solid #dae1ec;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name-wrapper {
  display: flex;
  align-items: center;
}

.label {
  margin-right: 20px;
  color: #333;
  font-weight: bold;
  font-size: 14px;
}

.name {
  font-weight: 500;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.avatar .mask {
  opacity: 0;
  transition: all 0.2s;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
}

.avatar .mask-icon {
  font-size: 20px;
}

.avatar .mask input {
  display: none;
}

.avatar:hover .mask {
  opacity: 1;
}

.password-section {
  padding: 25px 20px 25px 0;
}

.section-title {
  margin-bottom: 20px;
  color: #3a3a3a;
  font-weight: bold;
  font-size: 16px;
}

@media screen and (width <= 680px) {
  .content {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
