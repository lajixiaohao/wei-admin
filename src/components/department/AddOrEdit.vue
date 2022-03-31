<template>
  <el-dialog :title="addOrEditData.title" :visible.sync="addOrEditData.isShow" @close="closeDialog"
    :close-on-click-modal="false">
    <el-form :model="addOrEditData.form1" :rules="rules" ref="form1" label-width="120px">
      <el-form-item label="上级部门">
        <el-input v-model="addOrEditData.parent_name" :disabled="true" />
      </el-form-item>
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="addOrEditData.form1.name" autocomplete="off" placeholder="请输入部门名称" clearable />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="addOrEditData.form1.sort" :min="1" />
      </el-form-item>
      <el-form-item label="状态" prop="is_able">
        <el-radio v-model="addOrEditData.form1.is_able" :label="1">激活</el-radio>
        <el-radio v-model="addOrEditData.form1.is_able" :label="0">停用</el-radio>
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
} from '@/common/api/department'

export default {
  name: 'AddOrEditDepartment',
  data () {
    return {
      loading: false,
      rules: {
        name: [{
          required: true,
          message: '请输入部门名称',
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
          parent_name: '',
          form1: {
            id: 0,
            parent_id: 0,
            name: '',
            sort: 1,
            is_able: 1
          }
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
          addOrEdit(this.addOrEditData.form1).then(res => {
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
