<template>
  <div>
    <el-form :model="form" :rules="rules" ref="menuForm" label-width="100px">
      <el-form-item label="上级菜单" prop="parentId">
        <el-cascader
          v-model="parentIds"
          :options="menuData"
          :props="props"
          clearable
          filterable
          @change="cascaderChange"
          :disabled="disabled"
        />
      </el-form-item>
      <el-form-item label="权限名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入权限名称" clearable />
      </el-form-item>
      <el-form-item label="权限标识" prop="path">
        <el-input v-model="form.path" placeholder="请输入权限标识" clearable />
        <span class="form-tips">例：api:sys:get</span>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading">立即提交</el-button>
        <el-button @click="resetForm" :disabled="disabled">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addOrEditPermission } from '@/common/api/sys/menu'

export default {
  name: 'Permission',
  data () {
    const parentId = (rule, value, callback) => {
      if (parseInt(value) <= 0) {
        callback(new Error('请选择上级菜单'))
      }
      callback()
    }
    return {
      loading: false,
      menuData: [],
      parentIds: [],
      disabled: false,
      props: {
        checkStrictly: false,
        value: 'id',
        label: 'title',
        children: 'children'
      },
      form: {
        id: 0,
        parentId: 0,
        title: '',
        path: '',
        sort: 1
      },
      rules: {
        title: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入权限标识', trigger: 'blur' }],
        parentId: [
          { required: true, message: '请选择上级菜单', trigger: 'blur' },
          { validator: parentId, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.form.id = this.$route.query.id ? parseInt(this.$route.query.id) : 0
    this.init()
  },
  methods: {
    init () {
      addOrEditPermission({
        init: true,
        id: this.form.id
      }).then(res => {
        this.menuData = res.data.menu
        if (this.form.id) {
          this.disabled = true
          this.form = res.data.info
          this.parentIds = res.data.parentIds
        }
      })
    },
    cascaderChange (v) {
      this.form.parentId = v[v.length - 1]
    },
    submitForm () {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.loading = true
          addOrEditPermission(this.form).then(res => {
            this.$message.success(res.msg)
            this.loading = false
            this.resetForm()
            this.init()
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    resetForm () {
      this.$refs.menuForm.resetFields()
    }
  }
}
</script>

<style scoped>
  .el-form {
    max-width: 440px;
  }
</style>
