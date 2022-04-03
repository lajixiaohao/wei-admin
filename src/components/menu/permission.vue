<template>
  <el-dialog :title="permissionData.title" :visible.sync="permissionData.isShow" @close="closeDialog"
    :close-on-click-modal="false">
    <el-form :model="permissionData.form1" :rules="rules" ref="form1" label-width="100px">
      <el-form-item label="上级菜单" prop="parents">
        <el-cascader v-model="permissionData.form1.parents" :options="permissionData.menus" />
      </el-form-item>
      <el-form-item label="权限名称" prop="title">
        <el-input v-model="permissionData.form1.title" autocomplete="off" placeholder="请输入权限名称" clearable />
      </el-form-item>
      <el-form-item label="权限标识" prop="path">
        <el-input v-model="permissionData.form1.path" autocomplete="off" placeholder="请输入权限标识" clearable />
        <span class="form-tips">例如：api:role:list</span>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="permissionData.form1.sort" :min="1" />
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
  addOrEditPermission
} from '@/common/api/menu'

export default {
  name: 'Permission',
  data () {
    return {
      loading: false,
      rules: {
        parents: [{
          required: true,
          message: '请选择上级菜单',
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请输入权限名称',
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: '请输入权限标识',
          trigger: 'blur'
        }]
      }
    }
  },
  props: {
    permissionData: {
      type: Object,
      default: function () {
        return {
          title: '',
          isShow: false,
          menus: [],
          form1: {
            id: 0,
            parents: [],
            title: '',
            path: '',
            sort: 1
          }
        }
      }
    }
  },
  methods: {
    closeDialog (res) {
      this.$refs.form1.resetFields()
      this.$emit('close-permission-dialog', res)
    },
    onSubmit () {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.loading = true
          addOrEditPermission(this.permissionData.form1).then(res => {
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
    }
  }
}
</script>

<style scoped>
  .el-form {
    max-width: 400px;
  }
</style>
