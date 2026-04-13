<template>
  <div class="login">
    <div class="team-name hidden-sm-and-down"><img src="@/assets/image/login/team-name.png" alt="logo" /></div>
    <div class="form-box" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
      <div class="title"><h1 title="Lin">Lin CMS</h1></div>
      <form class="login-form" autocomplete="off" @submit.prevent="submitLogin">
        <div class="form-item nickname">
          <span class="icon account-icon"></span>
          <input type="text" v-model="account.username" autocomplete="off" placeholder="请填写用户名" />
        </div>
        <div class="form-item password">
          <span class="icon secret-icon"></span>
          <input type="password" v-model="account.password" autocomplete="off" placeholder="请填写用户登录密码" />
        </div>
        <div class="form-item password" v-if="captchaImage">
          <img class="captcha" :src="captchaImage" @click.stop="fetchCaptcha" />
          <input type="text" v-model="account.captcha" autocomplete="off" placeholder="请填写验证码" />
        </div>
        <button class="submit-btn" type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { createThrottledHandler } from '@/lin/util/rate-limit'
import { notifyRequestError } from '@/lin/util/request-error'
import { useUserStore } from '@/store/modules/user'
import { useLogin } from './use-login'

defineOptions({
  name: 'LoginPage',
})

const LOGIN_THROTTLE_WAIT = 2000

const userStore = useUserStore()
const router = useRouter()
const {
  account,
  captchaImage,
  fetchCaptcha: fetchCaptchaRaw,
  loading,
  login,
} = useLogin({
  router,
  userStore,
})

async function fetchCaptcha() {
  try {
    return await fetchCaptchaRaw()
  } catch {
    return null
  }
}

const submitLogin = createThrottledHandler(() => {
  void login().catch(error => {
    notifyRequestError(ElMessage, error, '登录失败')
  })
}, LOGIN_THROTTLE_WAIT)

onMounted(() => {
  void fetchCaptcha()
})
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background: #1b2c5f url('../../assets/image/login/login-ba.png') no-repeat center center;
  background-size: cover;

  .team-name {
    position: fixed;
    left: 40px;
    top: 50%;
    width: 50px;
    transform: translateY(-50%);
  }

  .form-box {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 445px;

    .title {
      height: 37px;
      font-size: 30px;
      line-height: 37px;
      margin-bottom: 15%;

      h1 {
        padding-left: 74px;
        box-sizing: border-box;
        text-align: left;
        color: #8c98ae;
      }
    }

    .login-form {
      width: 100%;

      .form-item {
        position: relative;
        width: 100%;
        height: 40px;
        box-sizing: border-box;
        padding-bottom: 13px;
        margin-bottom: 34px;

        input {
          width: 100%;
          height: 100%;
          background: transparent;
          color: #c4c9d2;
          font-size: 14px;
          padding-left: 74px;
          box-sizing: border-box;
        }

        .captcha {
          position: absolute;
          width: 80px;
          right: 30px;
          top: -22px;
          cursor: pointer;
        }
      }

      .form-item.nickname {
        background: url('../../assets/image/login/nickname.png') no-repeat;
        background-size: 100% auto;
        background-position: left bottom;
      }

      .form-item.password {
        background: url('../../assets/image/login/password.png') no-repeat;
        background-size: 100% auto;
        background-position: left bottom;
      }

      .submit-btn {
        width: 100%;
        height: 70px;
        color: #c4c9d2;
        font-size: 16px;
        text-align: left;
        box-sizing: border-box;
        padding: 0 10px;
        padding-left: 74px;
        background: url('../../assets/image/login/login-btn.png') no-repeat;
        background-size: 90% auto;
        background-position: center bottom;
        border: none;
        cursor: pointer;
      }
    }
  }
}
</style>
