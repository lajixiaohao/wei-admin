<template>
  <el-dialog :title="registerRouteData.title" :visible.sync="registerRouteData.isShow" @close="closeDialog"
    :close-on-click-modal="false">
    <el-form :model="registerRouteData.form1" :rules="rules" ref="form1" label-width="100px">
      <el-form-item label="上级菜单" prop="parents">
        <el-cascader v-model="registerRouteData.form1.parents" :options="registerRouteData.menus" />
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="registerRouteData.form1.title" autocomplete="off" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="页面路径" prop="path">
        <el-input v-model="registerRouteData.form1.path" autocomplete="off" placeholder="请输入页面路径" clearable />
      </el-form-item>
      <el-form-item label="组件名称" prop="component_name">
        <el-input v-model="registerRouteData.form1.component_name" autocomplete="off" placeholder="请输入组件名称(英文)"
          clearable />
      </el-form-item>
      <el-form-item label="组件路径" prop="component_path">
        <el-input v-model="registerRouteData.form1.component_path" autocomplete="off" placeholder="请输入组件路径" clearable>
          <template slot="prepend">@/views/</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否缓存组件" prop="is_cache">
        <el-radio v-model="registerRouteData.form1.is_cache" :label="1">是</el-radio>
        <el-radio v-model="registerRouteData.form1.is_cache" :label="0">否</el-radio>
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
  addOrEditRegisterRoute
} from '@/common/api/menu'

export default {
  name: 'RegisterRoute',
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
          message: '请输入菜单名称',
          trigger: 'blur'
        }],
        path: [{
          required: true,
          message: '请输入页面路径',
          trigger: 'blur'
        }],
        component_name: [{
          required: true,
          message: '请输入组件名称',
          trigger: 'blur'
        }],
        component_path: [{
          required: true,
          message: '请输入组件路径',
          trigger: 'blur'
        }]
      }
    }
  },
  props: {
    registerRouteData: {
      type: Object,
      default: function () {
        return {
          title: '',
          isShow: false,
          menus: [],
          form1: {}
        }
      }
    }
  },
  methods: {
    closeDialog (res) {
      this.$refs.form1.resetFields()
      this.$emit('close-register-route-dialog', res)
    },
    onSubmit () {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.loading = true
          addOrEditRegisterRoute(this.registerRouteData.form1).then(res => {
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
