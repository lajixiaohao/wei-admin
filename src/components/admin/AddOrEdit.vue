<template>
  <el-dialog :title="addOrEditData.title" :visible.sync="addOrEditData.isShow" @close="closeDialog"
    :close-on-click-modal="false">
    <el-form :model="addOrEditData.form1" :rules="rules" ref="form1" label-width="120px">
      <el-form-item v-if="!addOrEditData.form1.id" label="登录名" prop="account">
        <el-input v-model="addOrEditData.form1.account" placeholder="请输入登录名" maxlength="20"
          :disabled="addOrEditData.form1.id > 0" clearable />
      </el-form-item>
      <el-form-item v-if="!addOrEditData.form1.id" label="密码" prop="pwd">
        <el-input v-model="addOrEditData.form1.pwd" type="password" placeholder="请输入密码" maxlength="10" show-password
          clearable />
      </el-form-item>
      <el-form-item label="姓名" prop="true_name">
        <el-input v-model="addOrEditData.form1.true_name" placeholder="请输入姓名" maxlength="20" clearable />
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="addOrEditData.form1.role_id" placeholder="请选择">
          <el-option v-for="item in addOrEditData.role" :key="item.id" :label="item.role_name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门">
        <el-tree ref="deptTree" node-key="id" :props="depts" :load="loadNode" show-checkbox check-strictly
          :default-checked-keys="addOrEditData.dept_checked" @check-change="handleClick" lazy />
      </el-form-item>
      <el-form-item label="岗位" prop="post_id">
        <el-select v-model="addOrEditData.form1.post_id" placeholder="请选择">
          <el-option v-for="item in addOrEditData.post" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="is_able">
        <el-radio v-model="addOrEditData.form1.is_able" :label="1">激活</el-radio>
        <el-radio v-model="addOrEditData.form1.is_able" :label="0">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  addOrEdit
} from '@/common/api/admin'
import {
  validateAccount,
  validatePassword,
  validateTrueName
} from '@/common/utils/validate'
import {
  encryptData
} from '@/common/utils/rsa'

export default {
  name: 'AddOrEditAdmin',
  data () {
    const loginName = (rule, value, callback) => {
      if (!validateAccount(value)) {
        callback(new Error('只能是 5~20 个有效字符'))
      }
      callback()
    }
    const pwd = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error('必须使用强密码，长度在6-10之间'))
      }
      callback()
    }
    const trueName = (rule, value, callback) => {
      if (value && !validateTrueName(value)) {
        callback(new Error('长度应在2~20个字符内'))
      }
      callback()
    }
    return {
      loading: false,
      rules: {
        account: [{
          required: true,
          message: '请输入登录名',
          trigger: 'blur'
        },
        {
          validator: loginName,
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
        true_name: [{
          validator: trueName,
          trigger: 'blur'
        }]
      },
      depts: {
        label: 'name',
        isLeaf: 'leaf'
      },
      node: null,
      resolve: null
    }
  },
  props: {
    addOrEditData: {
      type: Object,
      default: function () {
        return {
          title: '',
          isShow: false,
          dept_checked: [],
          form1: {
            id: 0,
            account: '',
            pwd: '',
            true_name: '',
            role_id: '',
            post_id: '',
            is_able: 1
          }
        }
      }
    }
  },
  methods: {
    closeDialog (res) {
      if (this.node.childNodes.length) {
        this.node.childNodes = []
        this.loadNode(this.node, this.resolve)
      }

      this.$refs.form1.resetFields()
      this.$emit('close-add-or-edit-dialog', res)
    },
    onSubmit () {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          const depts = this.$refs.deptTree.getCheckedKeys()
          let departmentId = 0
          if (this.addOrEditData.form1.id <= 0 && depts.length === 1) {
            departmentId = depts[0]
          }
          if (this.addOrEditData.form1.id > 0) {
            departmentId = depts.length === 1 ? depts[0] : this.addOrEditData.dept_checked[0]
          }

          this.loading = true
          const f = {
            id: this.addOrEditData.form1.id,
            true_name: this.addOrEditData.form1.true_name,
            role_id: this.addOrEditData.form1.role_id,
            department_id: departmentId,
            post_id: this.addOrEditData.form1.post_id,
            is_able: this.addOrEditData.form1.is_able
          }
          if (this.addOrEditData.form1.id <= 0) {
            f.account = this.addOrEditData.form1.account
            f.pwd = encryptData(this.addOrEditData.form1.pwd)
          }
          addOrEdit(f).then(res => {
            this.loading = false
            this.$message.success(res.msg)
            this.closeDialog(true)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.node = node
        this.resolve = resolve
        this.loadNodeData(0, resolve)
      } else {
        this.loadNodeData(node.data.id, resolve)
      }
    },
    loadNodeData (id, resolve) {
      addOrEdit({
        is_load_dept: 1,
        department_id: id
      }).then(res => {
        return resolve(res.data.list)
      })
    },
    handleClick (data, checked, node) {
      if (checked) {
        this.$refs.deptTree.setCheckedNodes([data])
      }
    }
  }
}
</script>

<style scoped>
  .el-form {
    width: 400px;
  }

  .el-tree {
    border: 1px solid #E4E7ED;
    margin-top: 6px;
    border-radius: 4px;
  }
</style>
