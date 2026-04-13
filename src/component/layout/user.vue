<template>
  <div class="user-menu">
    <el-dropdown>
      <span class="el-dropdown-link">
        <div class="nav-avatar"><img :src="avatarSrc" alt="头像" /></div>
      </span>

      <template #dropdown>
        <el-dropdown-menu class="user-box">
          <div class="user-info">
            <div class="avatar" title="点击修改头像">
              <img :src="avatarSrc" alt="头像" />
              <label class="mask">
                <Camera class="mask-icon" />
                <input
                  ref="avatarInput"
                  accept="image/*"
                  aria-label="上传头像"
                  type="file"
                  @change="handleAvatarFileChange"
                />
              </label>
            </div>

            <div class="text">
              <button v-if="showNicknameDisplay" class="username" type="button" @click="startNicknameEdit">
                {{ displayNickname }}
              </button>
              <el-input
                v-else
                ref="nicknameInput"
                v-model="editingNickname"
                placeholder="请输入内容"
                size="small"
                @blur="submitNicknameEdit"
              />
              <div v-if="showNicknameDisplay" class="desc">{{ groupName }}</div>
            </div>

            <img class="corner" src="../../assets/image/user/corner.png" alt="" />
          </div>

          <ul class="dropdown-box">
            <li class="dropdown-box__item">
              <button class="dropdown-box__action" type="button" @click="goToCenter">
                <User class="dropdown-box__icon" /> <span>个人中心</span>
              </button>
            </li>
            <li class="dropdown-box__item">
              <button class="dropdown-box__action" type="button" @click="logout">
                <SwitchButton class="dropdown-box__icon" /> <span>退出账户</span>
              </button>
            </li>
          </ul>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <Avatar v-model:visible="cropVisible" :original-image="cropImg" :user-store="userStore" />
  </div>
</template>

<script setup>
import { Camera, SwitchButton, User } from '@element-plus/icons-vue'
import { computed, useTemplateRef } from 'vue'

import Avatar from './avatar.vue'
import defaultAvatar from '@/assets/image/user/user.png'
import { useUserMenu } from './use-user-menu'

defineOptions({
  name: 'UserMenu',
})

const { logoutAction, navigateToCenter, userStore } = defineProps({
  logoutAction: {
    type: Function,
    required: true,
  },
  navigateToCenter: {
    type: Function,
    required: true,
  },
  userStore: {
    type: Object,
    required: true,
  },
})
const avatarInput = useTemplateRef('avatarInput')
const nicknameInput = useTemplateRef('nicknameInput')
const {
  avatarSrc,
  displayNickname,
  editingNickname,
  isEditingNickname,
  groupName,
  cropImg,
  cropVisible,
  handleAvatarFileChange,
  startNicknameEdit,
  submitNicknameEdit,
  goToCenter,
  logout,
} = useUserMenu({
  avatarInput,
  defaultAvatar,
  logoutAction,
  navigateToCenterAction: navigateToCenter,
  nicknameInput,
  userStore,
})

const showNicknameDisplay = computed(() => !isEditingNickname.value)
</script>

<style lang="scss" scoped>
.user-menu {
  height: 36px;
  display: flex;
  align-items: center;

  .el-dropdown-link {
    display: flex;
    align-items: center;
    cursor: pointer;

    .nav-avatar {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}

.user-box {
  width: 326px;
  background: transparent;
  margin-bottom: 0;
  padding-bottom: 0;
  border: none;

  .user-info {
    background: linear-gradient(135deg, var(--theme-sidebar-panel), var(--theme-sidebar-bg));
    box-shadow: var(--theme-panel-shadow);
    transform: translateY(-10px);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    flex-direction: row;
    padding: 35px 20px 25px 30px;
    z-index: 100;
    position: relative;

    .corner {
      display: none;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
      position: relative;

      .mask {
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

        .mask-icon {
          font-size: 20px;
        }

        input {
          display: none;
        }
      }

      &:hover {
        .mask {
          opacity: 1;
        }
      }
    }

    .text {
      margin-left: 20px;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .username {
        border: none;
        background: transparent;
        font: inherit;
        padding: 0;
        margin-bottom: 10px;
        font-size: 16px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        color: #fff;
        text-align: left;
      }

      .desc {
        font-size: 14px;
        color: rgba(222, 226, 230, 1);
      }
    }
  }

  .dropdown-box {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 35px;
    height: 122px;
    color: var(--theme-text-muted);
    font-size: 14px;
    background: var(--theme-surface-raised);
    border: 1px solid var(--theme-border);
    border-top: none;
    margin-top: -10px;
    list-style: none;

    &__item {
      margin: 0;
      padding: 0;

      &:nth-child(1) {
        margin-top: 20px;
      }

      &:nth-child(2) {
        margin-bottom: 20px;
      }
    }

    &__action {
      width: 100%;
      border: none;
      background: transparent;
      cursor: pointer;
      color: inherit;
      font-size: inherit;
      display: flex;
      align-items: center;
      text-align: left;
      padding: 0;

      .dropdown-box__icon {
        width: 16px;
        height: 16px;
        font-size: 16px;
        flex-shrink: 0;
        margin-right: 10px;
      }

      &:hover {
        color: $theme !important;

        .dropdown-box__icon {
          color: $theme !important;
        }
      }
    }
  }
}

.avatar-croppa-container {
  display: inline-block;
  border-color: #3862bc;
  border-style: dashed;
}
</style>
