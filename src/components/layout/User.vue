<template>
  <div class="user">
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <div class="nav-avatar">
          <img src="../../assets/img/user/user.jpg" alt="头像">
        </div>
      </span>
      <el-dropdown-menu slot="dropdown" class="user-box">
        <div class="user-info">
          <div class="avatar" title="点击修改头像">
            <img src="../../assets/img/user/user.jpg" alt="头像">
            <label class="mask">
              <i class="iconfont icon-icon-test" style="font-size: 20px;"></i>
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                @change="fileChange" />
            </label>
          </div>
          <div class="text">
            <div class="username">{{ nickname }}</div>
            <div class="desc">{{ title }}</div>
          </div>
          <img src="../../assets/img/user/corner.png" class="corner">
        </div>
        <ul class="dropdown-box">
          <li class="password" @click="changePassword">
            <i class="iconfont icon-weibaoxitongshangchuanlogo-"></i>
            <span>修改登录密码</span>
          </li>
          <li class="account" @click="outLogin">
            <i class="iconfont icon-tuichu"></i>
            <span>退出账户</span>
          </li>
        </ul>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改头像 -->
    <el-dialog
      title="裁剪"
      :visible.sync="cropVisible"
      width="300px"
      :append-to-body="true"
      :close-on-click-modal="false"
      custom-class="croppa-dialog"
      center>
      <div style="text-align: center;">
        <div class="avatar-croppa-container">
          <croppa
            ref="croppa"
            :width="cropRule.width"
            :height="cropRule.height"
            :placeholder="'loading'"
            :zoom-speed="30"
            :disable-drag-and-drop="false"
            :show-remove-button="false"
            :prevent-white-space="true"
            :disable-click-to-choose="false"
            :disable-scroll-to-zoom="false"
            :show-loading="true"
            :quality="quality"
            :initial-image="cropImg">
          </croppa>
        </div>
        <div style="margin-top: 1em;">通过鼠标滚轮调节头像大小</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCrop" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :append-to-body="true"
      :before-close="handleClose"
      :visible.sync="dialogFormVisible"
      class="user-dialog">
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        label-position="left"
        ref="form"
        label-width="90px"
        @submit.native.prevent>
        <el-form-item label="原始密码" prop="old_password">
          <el-input type="password" v-model="form.old_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input type="password" v-model="form.new_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password" label-position="top">
          <el-input type="password" v-model="form.confirm_password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import User from '@/lin/models/user'
import Vue from 'vue'
import Croppa from 'vue-croppa'
import 'vue-croppa/dist/vue-croppa.css'
import Config from '@/config'

Vue.use(Croppa)

const width = 150
const height = 150

export default {
  name: 'user',
  components: {},
  data() {
    const oldPassword = (rule, value, callback) => {
      // eslint-disable-line
      if (!value) {
        return callback(new Error('原始密码不能为空'))
      }
      callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位数'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('confirm_password')
        }
        callback()
      }
    }
    const validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      nickname: null,
      dialogFormVisible: false,
      form: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
      rules: {
        old_password: [
          { validator: oldPassword, trigger: 'blur', required: true },
        ],
        new_password: [
          { validator: validatePassword, trigger: 'blur', required: true },
        ],
        confirm_password: [
          { validator: validatePassword2, trigger: 'blur', required: true },
        ],
      },
      cropRule: {
        width,
        height,
      },
      imgRule: {
        minWidth: width,
        minHeight: height,
      },
      cropVisible: false,
      cropImg: '',
      croppa: {},
      imgInfo: null,
      quality: 1,
    }
  },
  computed: {
    title() {
      const { isSuper } = this.user || {}
      if (isSuper) {
        return '超级管理员'
      }
      return '管理员'
    },
    ...mapGetters(['user']),
  },
  watch: {
    cropVisible(val) {
      if (!val) {
        this.$refs.croppa.remove()
        this.cropImg = ''
        this.imgInfo = null
      }
    },
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions(['loginOut']),
    fileChange(evt) {
      if (evt.target.files.length !== 1) {
        return
      }
      const imgFile = evt.target.files[0]
      // 验证文件大小是否符合要求, 不大于2M
      if (imgFile.size > 1024 * 1024 * 3) {
        this.$message.error('文件过大超过3M')
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
        if (this.$refs.croppa) {
          this.$refs.croppa.refresh()
        }
      }
      image.onerror = () => {
        this.$message.error('获取本地图片出现错误, 请重试')
        // 清空输入框
        this.clearFileInput(this.$refs.avatarInput)
      }
    },
    async handleCrop() {
      // console.log(this.$refs.croppa)
      const blob = await this.$refs.croppa.promisedBlob('image/jpeg', 0.8)

      // debugger
      // const res = await http({
      const res = await this.$axios({
        method: 'post',
        url: `${Config.baseUrl}cms/file/`,
        data: {
          file: blob,
        },
      })
      console.log(res)
      // debugger
    },
    init() {
      const { user } = this.$store.state
      this.nickname = user ? user.nickname : '未登录'
    },
    changePassword() {
      this.dialogFormVisible = true
    },
    // 弹框 右上角 X
    handleClose(done) {
      this.dialogFormVisible = false
      done()
    },
    outLogin() {
      this.loginOut()
      window.location.reload(true)
    },
    submitForm(formName) {
      if (this.form.old_password === '' && this.form.new_password === '' && this.form.confirm_password === '') {
        this.dialogFormVisible = false
        return
      }
      if (this.form.old_password === this.form.new_password) {
        this.$message.error('新密码不能与原始密码一样')
        return
      }
      this.$refs[formName].validate(async (valid) => {
        // eslint-disable-line
        if (valid) {
          const res = await User.updatePassword(this.form)
          if (res.error_code === 0) {
            this.$message.success(`${res.msg}`)
            this.resetForm(formName)
            this.dialogFormVisible = false
          }
        } else {
          console.log('error submit!!')
          this.$message.error('请填写正确的信息')
          return false
        }
      })
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
.user-dialog /deep/ .el-dialog .el-dialog__header {
  border-bottom: 1px solid #dae1ed;
  padding-bottom: 20px;
}

.user-dialog /deep/ .el-dialog .el-dialog__body {
  padding-bottom: 00px;
}

.user {
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
    background-image: url("../../assets/img/user/user-bg.png");
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
        transition: all .2s;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .3);
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
