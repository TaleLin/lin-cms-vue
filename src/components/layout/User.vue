<template>
  <div class="user">
    <el-dropdown>
      <span class="el-dropdown-link">
        <img src="../../assets/img/user/user.png"
             alt="管理员头像"
             class="nav-avatar">
      </span>
      <el-dropdown-menu slot="dropdown"
                        class="user-box"
                        style="border:none;
                        background-color:none;
                        background:transparent;
                        margin-bottom:0;
                        padding-bottom:0;">
        <div class="user-info">
          <img src="../../assets/img/user/user.png"
               class="avatar"
               alt="管理员头像">
          <div class="text">
            <div class="username">{{nickname}}</div>
            <div class="desc">{{title}}</div>
          </div>
        </div>
        <ul class="dropdown-box">
          <li class=" password"
              @click="changePassword">
            <i class="iconfont icon-weibaoxitongshangchuanlogo-"></i>
            <span>修改登录密码</span>
          </li>
          <li class="account"
              @click="outLogin">
            <i class="iconfont icon-tuichu"></i>
            <span>退出账户</span>
          </li>
        </ul>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码"
               :append-to-body="true"
               :before-close="handleClose"
               :visible.sync="dialogFormVisible">
      <lin-1px style="margin-top:-20px;margin-bottom:20px;"></lin-1px>
      <el-form :model="form"
               status-icon
               :rules="rules"
               label-position="left"
               ref="form"
               label-width="100px">
        <el-form-item label="原始密码"
                      prop="old_password">
          <el-input type="password"
                    v-model="form.old_password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="new_password">
          <el-input type="password"
                    v-model="form.new_password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="confirm_password"
                      label-position="top">
          <el-input type="password"
                    v-model="form.confirm_password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('form')">保存</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import User from '@/lin/models/user'

export default {
  data() {
    const oldPassword = (rule, value, callback) => { // eslint-disable-line
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
    }
  },
  methods: {
    init() {
      this.nickname = this.$store.state.user
        ? this.$store.state.user.nickname
        : '未登录'
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
      // this.$router.push('/login')
      const { origin } = window.location
      window.location.href = origin
    },
    submitForm(formName) {
      if (this.form.old_password === this.form.new_password) {
        this.$message.error('新密码不能与原始密码一样')
        return
      }
      this.$refs[formName].validate(async (valid) => { // eslint-disable-line
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
    ...mapActions(['loginOut']),
  },
  computed: {
    title() {
      const { isSuper } = this.user
      if (isSuper) {
        return '超级管理员'
      }
      return '管理员'
    },
    ...mapGetters(['user']),
  },
  created() {
    this.init()
  },
}
</script>

<style type="text/scss" lang="scss" socped>
@import "~assets/styles/variable.scss";

.el-dropdown-link {
  cursor: pointer;
  .nav-avatar {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
}

.user-box {
  width: 326px;
  border: none;
  .user-info {
    background-image: url("../../assets/img/user/user-bg.png");
    background-size: 100% 100%;
    transform: translateY(-3px);
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;
    flex-direction: row;
    padding: 35px 20px 25px 30px;
    z-index: 100;
    .avatar {
      width: 80px;
      height: 80px;
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
    margin-top: -3px;
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
</style>
