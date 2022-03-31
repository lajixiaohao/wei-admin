<template>
  <el-dialog :title="addOrEditData.title" :visible.sync="addOrEditData.isShow" @close="closeDialog"
    :close-on-click-modal="false">
    <el-form :model="addOrEditData.form1" :rules="rules" ref="form1" label-width="120px">
      <el-form-item label="角色名称" prop="role_name">
        <el-input v-model="addOrEditData.form1.role_name" autocomplete="off" placeholder="请输入角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="role_describe">
        <el-input v-model="addOrEditData.form1.role_describe" type="textarea" placeholder="请输入角色描述" />
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
  addOrEditRole
} from '@/common/api/role'

export default {
  name: 'AddOrEditRole',
  data () {
    return {
      loading: false,
      rules: {
        role_name: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }]
      }
    }
  },
  props: {
    addOrEditData: {
      type: Object,
      default: function () {
        return {
          title: '',
          isShow: false,
          form1: {}
        }
      }
    }
  },
  methods: {
    closeDialog (res) {
      this.$refs.form1.resetFields()
      this.$emit('close-add-or-edit-dialog', res)
    },
    onSubmit () {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.loading = true
          addOrEditRole(this.addOrEditData.form1).then(res => {
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
    width: 400px;
  }
</style>
