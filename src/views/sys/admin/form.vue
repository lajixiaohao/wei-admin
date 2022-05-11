<template>
  <div>
    <el-form :model="form" :rules="rules" ref="adminForm" label-width="70px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" placeholder="请输入登录账号" clearable :disabled="form.id > 0" />
        <span class="form-tips">必须以字母开头，长度在5-20之间，只能包含字母、数字和下划线的组合</span>
      </el-form-item>
      <el-form-item v-if="!form.id" label="密码" prop="pwd">
        <el-input v-model="form.pwd" type="password" placeholder="请输入登录密码" maxlength="15" show-password clearable />
        <span class="form-tips">必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-15之间</span>
      </el-form-item>
      <el-form-item label="姓名" prop="trueName">
        <el-input v-model="form.trueName" placeholder="请输入姓名" maxlength="20" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="form.roleId" placeholder="请选择">
          <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-tree
          ref="adminDeptTree"
          v-loading="treeLoading"
          :data="depts"
          node-key="id"
          show-checkbox
          check-strictly
          :default-checked-keys="deptChecked"
          @check-change="handleClick"
          default-expand-all />
      </el-form-item>
      <el-form-item label="岗位" prop="postId">
        <el-select v-model="form.postId" placeholder="请选择">
          <el-option v-for="item in posts" :key="item.id" :label="item.postName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="isAble">
        <el-radio v-model="form.isAble" :label="1">激活</el-radio>
        <el-radio v-model="form.isAble" :label="0">禁用</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="submitLoading">立即提交</el-button>
        <el-button @click="resetForm" :disabled="disabled">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validateAccount, validatePassword, validateTrueName } from '@/common/utils/validate'
import { encryptData } from '@/common/utils/rsa'
import { addOrEdit } from '@/common/api/sys/admin'

export default {
  name: 'AdminForm',
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
    const trueName = (rule, value, callback) => {
      if (value && !validateTrueName(value)) {
        callback(new Error('长度应在2-20个字符内'))
      }
      callback()
    }
    return {
      form: {
        id: 0,
        account: '',
        pwd: '',
        trueName: '',
        roleId: '',
        deptId: 0,
        postId: '',
        isAble: 1
      },
      rules: {
        account: [{
          required: true,
          message: '请输入登录账号',
          trigger: 'blur'
        },
        {
          validator: account,
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '请输入登录密码',
          trigger: 'blur'
        },
        {
          validator: pwd,
          trigger: 'blur'
        }],
        trueName: [{
          validator: trueName,
          trigger: 'blur'
        }]
      },
      roles: [],
      depts: [],
      deptChecked: [],
      posts: [],
      disabled: false,
      submitLoading: false,
      treeLoading: false
    }
  },
  created () {
    this.form.id = this.$route.query.id ? parseInt(this.$route.query.id) : 0
    this.init()
  },
  methods: {
    init () {
      this.treeLoading = true
      addOrEdit({ init: true, id: this.form.id }).then(res => {
        this.treeLoading = false
        this.roles = res.data.roles
        this.posts = res.data.posts
        this.depts = res.data.depts
        if (this.form.id > 0) {
          this.disabled = true
          this.form = res.data.info
          this.deptChecked.push(res.data.info.deptId)
        }
      }).catch(() => {
        this.treeLoading = false
      })
    },
    submitForm () {
      this.$refs.adminForm.validate((valid) => {
        if (valid) {
          const depts = this.$refs.adminDeptTree.getCheckedKeys()
          const f = {
            id: this.form.id,
            trueName: this.form.trueName,
            roleId: this.form.roleId,
            deptId: depts.length > 0 ? depts[0] : 0,
            postId: this.form.postId,
            isAble: this.form.isAble
          }
          if (f.id <= 0) {
            f.account = this.form.account
            f.pwd = encryptData(this.form.pwd)
          }
          this.submitLoading = true
          addOrEdit(f).then(res => {
            this.submitLoading = false
            this.$message.success(res.msg)
            this.resetForm()
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs.adminForm.resetFields()
      this.init()
    },
    handleClick (data, checked, node) {
      if (checked) {
        this.$refs.adminDeptTree.setCheckedNodes([data])
      }
    }
  }
}
</script>

<style scoped>
  .el-form {
    max-width: 400px;
  }
  .el-form .el-tree {
    border: 1px solid #E4E7ED;
    margin-top: 6px;
    border-radius: 4px;
  }
</style>
