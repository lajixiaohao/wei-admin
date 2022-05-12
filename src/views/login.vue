<template>
  <div class="bg">
    <el-row>
      <!-- 左侧 -->
      <el-col>
        <div class="box-left">
          <div class="welcome">欢迎使用</div>
          <div class="system">{{ webTitle }}</div>
        </div>
      </el-col>
      <!-- 右侧 -->
      <el-col>
        <div class="box-right">
          <el-form :model="loginForm" :rules="rules" ref="loginForm">
            <el-form-item prop="account">
              <el-input
                prefix-icon="el-icon-user"
                v-model.trim="loginForm.account"
                placeholder="账号"
                clearable
              />
            </el-form-item>
            <el-form-item prop="pwd">
              <el-input
                prefix-icon="el-icon-lock"
                v-model.trim="loginForm.pwd"
                type="password"
                placeholder="密码"
                clearable
                show-password
                @keyup.enter.native="onSubmit"
              />
            </el-form-item>
            <el-form-item prop="captcha">
              <el-col :span="13">
                <el-input
                  v-model.trim="loginForm.captcha"
                  placeholder="验证码"
                  maxlength="3"
                  @keyup.enter.native="onSubmit">
                  <svg-icon slot="prefix" icon-class="safety" style="margin-left: 5px;" />
                </el-input>
              </el-col>
              <el-col :span="10" :offset="1" style="height: 38px;">
                <img style="cursor: pointer;" :src="codeImageUrl" @click="getCode" />
              </el-col>
            </el-form-item>
            <el-form-item class="loginBtn">
              <el-button type="primary" @click="onSubmit" :loading="loading">登录</el-button>
              <el-button type="info" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { setToken } from '@/common/utils/auth'
import { validateAccount, validatePassword } from '@/common/utils/validate'
import { login, getCaptcha } from '@/common/api/public'
import { encryptData } from '@/common/utils/rsa'
import Config from '@/settings'

export default {
  name: 'Login',
  data () {
    const account = (rule, value, callback) => {
      if (!validateAccount(value)) {
        callback(new Error('账号输入有误'))
      }
      callback()
    }
    const pwd = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error('密码输入有误'))
      }
      callback()
    }
    const captcha = (rule, value, callback) => {
      if (!/^(-)?\d+$/.test(value)) {
        callback(new Error('验证码输入有误'))
      }
      callback()
    }
    return {
      webTitle: Config.webTitle,
      loginForm: {
        account: 'admin',
        pwd: 'Admin1234',
        captcha: ''
      },
      codeImageUrl: '',
      fit: 'contain',
      uid: '',
      loading: false,
      rules: {
        account: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        },
        {
          validator: account,
          trigger: 'blur'
        }
        ],
        pwd: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          validator: pwd,
          trigger: 'blur'
        }
        ],
        captcha: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        },
        {
          validator: captcha,
          trigger: 'blur'
        }
        ]
      }
    }
  },
  created () {
    this.getCode()
  },
  methods: {
    onSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          login({
            account: this.loginForm.account,
            pwd: encryptData(this.loginForm.pwd),
            uid: this.uid,
            captcha: this.loginForm.captcha
          }).then(res => {
            this.loading = false
            this.$message.success(res.msg)
            setToken(res.data.token)
            this.$router.push(this.redirectPath()).catch(() => {})
          }).catch(() => {
            this.loading = false
            this.loginForm.captcha = ''
            this.getCode()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    redirectPath () {
      return (this.$route.query.redirect !== undefined && this.$route.query.redirect.length > 0) ? this.$route.query.redirect : '/dashboard'
    },
    resetForm () {
      this.$refs.loginForm.resetFields()
    },
    getCode () {
      getCaptcha({
        appkey: Config.appKey
      }).then(res => {
        this.codeImageUrl = res.data.img
        this.uid = res.data.uid
      })
    }
  }
}
</script>

<style scoped>
  .bg {
    background-color: #24364c;
    height: inherit;
  }
  .el-row {
    display: flex;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -45%);
    width: 840px;
    height: 380px;
  }
  .box-left, .box-right {
    height: 100%;
  }
  .box-left {
    background-color: #008ecfed;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: #e6e6e6;
  }
  .welcome {
    font-size: 14px;
  }
  .system {
    margin-top: 20px;
    font-size: 18px;
    font-weight: 600;
  }
  .box-right {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
  }
  .loginBtn {
    display: flex;
    justify-content: flex-end;
  }
  .el-form {
    width: 70%;
  }
</style>
