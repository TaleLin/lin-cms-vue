<template>
  <div class="user">
    <el-dropdown>
      <span class="el-dropdown-link">
        <div class="nav-avatar"><img :src="user.avatar || defaultAvatar" alt="头像" /></div>
      </span>
      <template v-slot:dropdown>
        <el-dropdown-menu class="user-box">
          <div class="user-info">
            <div class="avatar" title="点击修改头像">
              <img :src="user.avatar || defaultAvatar" alt="头像" />
              <label class="mask">
                <i class="iconfont icon-icon-test" style="font-size: 20px;"></i>
                <input ref="avatarInput" type="file" accept="image/*" @change="fileChange" />
              </label>
            </div>
            <div class="text">
              <div class="username" @click="changeNickname" v-if="!nicknameChanged">{{ nickname }}</div>
              <el-input
                placeholder="请输入内容"
                size="small"
                v-else
                v-model="nickname"
                ref="input"
                @blur="blur"
              ></el-input>
              <div class="desc" v-if="!nicknameChanged">{{ groupName }}</div>
            </div>
            <img src="../../assets/image/user/corner.png" class="corner" />
          </div>
          <ul class="dropdown-box">
            <li class="password" @click="goToCenter">
              <i class="iconfont icon-weibaoxitongshangchuanlogo-"></i> <span>个人中心</span>
            </li>
            <li class="account" @click="outLogin"><i class="iconfont icon-tuichu"></i> <span>退出账户</span></li>
          </ul>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- 修改头像 -->
    <avatar :originalImage="cropImg" :cropVisible="cropVisible" @switchCropVisible="switchCropVisible"></avatar>
  </div>
</template>

<script>
import User from 'lin/model/user'
import axios from 'lin/plugin/axios'
import { mapActions, mapGetters } from 'vuex'
import defaultAvatar from '@/assets/image/user/user.png'
import Avatar from './avatar.vue'

export default {
  name: 'User',
  components: { Avatar },
  data() {
    return {
      cropImg: '',
      defaultAvatar,
      username: null,
      nickname: null,
      groupName: null,
      cropVisible: false,
      nicknameChanged: false,
      dialogFormVisible: false,
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    cropVisible(val) {
      if (!val) {
        this.cropImg = ''
      }
    },
  },
  created() {
    const { user } = this.$store.state
    this.nickname = user?.nickname ? user.nickname : '佚名'
    this.username = user?.username ? user.username : '未登录'
  },
  methods: {
    ...mapActions(['loginOut', 'setUserAndState']),
    fileChange(event) {
      if (event.target.files.length !== 1) {
        return
      }

      const imgFile = event.target.files[0]
      // 验证文件大小是否符合要求, 不大于 5M
      if (imgFile.size > 1024 * 1024 * 5) {
        this.$message.error('文件过大超过5M')
        // 清空输入框
        this.clearFileInput(this.$refs.avatarInput)
        return
      }

      // 验证图像是否符合要求
      const imgSrc = window.URL.createObjectURL(imgFile)
      const image = new Image()
      image.src = imgSrc
      image.onload = () => {
        const w = image.width
        const h = image.height
        if (w < 50) {
          this.$message.error('图像宽度过小, 请选择大于50px的图像')
          // 清空输入框
          this.clearFileInput(this.$refs.avatarInput)
          return
        }
        if (h < 50) {
          this.$message.error('图像高度过小, 请选择大于50px的图像')
          // 清空输入框
          this.clearFileInput(this.$refs.avatarInput)
          return
        }
        // 验证通过, 打开裁剪框
        this.cropImg = imgSrc
        this.cropVisible = true
      }
      image.onerror = () => {
        this.$message.error('获取本地图片出现错误, 请重试')
        // 清空输入框
        this.clearFileInput(this.$refs.avatarInput)
      }
    },
    switchCropVisible(flag) {
      this.cropVisible = flag
    },
    changeNickname() {
      this.nicknameChanged = true
      setTimeout(() => {
        this.$refs.input.focus()
      }, 200)
    },
    async blur() {
      if (this.nickname) {
        const { user } = this.$store.state
        if (this.nickname !== user.nickname && this.nickname !== '佚名') {
          axios({
            method: 'put',
            url: '/cms/user',
            data: {
              nickname: this.nickname,
            },
            showBackend: true,
          })
            .then(res => {
              if (res.code < window.MAX_SUCCESS_CODE) {
                this.$message({
                  type: 'success',
                  message: '更新昵称成功',
                })
                // 触发重新获取用户信息
                return User.getInformation()
              }
            })
            .then(res => {
              this.setUserAndState(res)
              this.nickname = res.nickname
            })
        }
      }
      this.nicknameChanged = false
    },
    goToCenter() {
      this.$router.push('/center')
    },
    outLogin() {
      this.loginOut()
      window.location.reload()
    },
    clearFileInput(ele) {
      ele.value = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.user {
  height: 40px;

  .el-dropdown-link {
    cursor: pointer;

    .nav-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      margin-right: 10px;
    }
  }
}

.user-box {
  width: 326px;
  background-color: none;
  background: transparent;
  margin-bottom: 0;
  padding-bottom: 0;
  border: none;

  .user-info {
    background-image: url('../../assets/image/user/user-bg.png');
    background-size: 100% 100%;
    transform: translateY(-10px);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    flex-direction: row;
    padding: 35px 20px 25px 30px;
    z-index: 100;
    position: relative;

    .corner {
      position: absolute;
      right: 18px;
      top: -9px;
      width: 27px;
      height: 10px;
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
        margin-bottom: 10px;
        font-size: 16px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
      }

      .desc {
        font-size: 14px;
        color: rgba(222, 226, 230, 1);
      }
    }

    .info {
      position: absolute;
      bottom: 10px;
      right: 10px;
      display: flex;
      color: #fff;
      font-size: 14px;
      height: 20px;
      line-height: 20px;

      .mid {
        padding: 0 5px;
      }
    }
  }

  .dropdown-box {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding-left: 35px;
    height: 122px;
    color: #596c8e;
    font-size: 14px;
    background: white;
    margin-top: -10px;

    li {
      cursor: pointer;

      &:nth-child(1) {
        margin-top: 20px;
      }

      &:nth-child(2) {
        margin-bottom: 20px;
      }

      i {
        margin-right: 10px;
      }

      &:hover {
        color: $theme !important;

        i {
          color: $theme !important;
        }
      }
    }
  }
}

.popper__arrow {
  display: none !important;
}

.avatar-croppa-container {
  display: inline-block;
  border-color: #3862bc;
  border-style: dashed;
  font-size: 0;
  border-width: 2px;
}
</style>
