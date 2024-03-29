<template>
  <div>
    <el-descriptions :column="1" :size="size" border>
      <el-descriptions-item label="登录账号">{{ profile.account }}</el-descriptions-item>
      <el-descriptions-item label="姓名/昵称">{{ profile.trueName }}</el-descriptions-item>
      <el-descriptions-item label="上级管理员">{{ profile.superior }}</el-descriptions-item>
      <el-descriptions-item label="所属角色">{{ profile.role }}</el-descriptions-item>
      <el-descriptions-item label="所属部门">{{ profile.dept }}</el-descriptions-item>
      <el-descriptions-item label="岗位">{{ profile.post }}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{ profile.createdAt }}</el-descriptions-item>
    </el-descriptions>
    <p>
      <el-button type="primary" size="mini" icon='el-icon-edit-outline' @click="editName()">修改姓名</el-button>
      <el-button type="warning" size="mini" icon="el-icon-refresh-left" @click="resetPwd()">重置登录密码</el-button>
    </p>
  </div>
</template>

<script>
import { getProfileData, modifyName, modifyPassword } from '@/common/api/public'
import { validateTrueName, validatePassword } from '@/common/utils/validate'
import { encryptData } from '@/common/utils/rsa'
import { removeToken } from '@/common/utils/auth'

export default {
  name: 'Profile',
  data () {
    return {
      size: 'medium',
      profile: {
        account: '',
        trueName: '',
        superior: '',
        createdAt: '',
        role: '',
        dept: '',
        post: ''
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      getProfileData().then(res => {
        this.profile = res.data.profile
      })
    },
    editName () {
      this.$prompt('修改姓名', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: validateTrueName,
        inputErrorMessage: '长度应在2~20个字符内',
        inputValue: this.profile.trueName,
        closeOnClickModal: false
      }).then(({
        value
      }) => {
        if (value === this.profile.trueName) {
          this.$message.success('本次未作任何更改')
        } else {
          modifyName({
            name: value
          }).then(res => {
            this.$message.success(res.msg)
            this.$store.dispatch('updateAdminName', value)
            this.profile.trueName = value
          })
        }
      }).catch(() => {})
    },
    resetPwd () {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: validatePassword,
        inputErrorMessage: '必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-15之间',
        inputType: 'password',
        closeOnClickModal: false
      }).then(({
        value
      }) => {
        modifyPassword({
          pwd: encryptData(value)
        }).then(res => {
          this.$message.success(res.msg)
          setTimeout(() => {
            removeToken()
            window.location.reload()
          }, 1000)
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
  p {
    font-size: 14px;
  }
  .el-descriptions {
    max-width: 400px;
  }
</style>
