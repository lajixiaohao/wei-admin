<template>
  <div>
    <el-form :model="form" :rules="rules" ref="menuForm" label-width="100px">
      <el-form-item label="菜单类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择菜单类型"
          @change="setCheckStrictly"
          :disabled="disabled"
        >
          <el-option label="左侧菜单" :value="1"></el-option>
          <el-option label="隐式菜单" :value="2"></el-option>
        </el-select>
        <span class="form-tips">优先级：左侧菜单 > 隐式菜单</span>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentId">
        <el-cascader
          v-model="parentIds"
          :options="menuData"
          :props="props"
          @change="cascaderChange"
          :disabled="disabled"
          placeholder="默认顶级"
          clearable
          filterable
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="form.path" placeholder="请输入路由地址" clearable />
        <span class="form-tips">请以“/”开头</span>
      </el-form-item>
      <el-form-item label="组件名称" prop="componentName">
        <el-input v-model="form.componentName" placeholder="请输入组件名称(英文)" clearable />
      </el-form-item>
      <el-form-item label="组件路径" prop="componentPath">
        <el-input v-model="form.componentPath" placeholder="请输入组件路径" clearable>
          <template slot="prepend">@/views/</template>
        </el-input>
        <span class="form-tips">.vue文件名后缀可省略</span>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="form.icon" placeholder="请输入图标名称" clearable>
          <template slot="append">.svg</template>
        </el-input>
        <span class="form-tips">请使用svg图标，位于/src/assets/svg目录下</span>
      </el-form-item>
      <el-form-item label="菜单可见" prop="isShow">
        <el-radio v-model="form.isShow" :label="1">是</el-radio>
        <el-radio v-model="form.isShow" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="组件缓存" prop="isCache">
        <el-radio v-model="form.isCache" :label="1">是</el-radio>
        <el-radio v-model="form.isCache" :label="0">否</el-radio>
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
import { addOrEdit } from '@/common/api/sys/menu'

export default {
  name: 'AddOrEditMenu',
  data () {
    return {
      loading: false,
      menuData: [],
      parentIds: [47],
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
        type: '',
        componentName: '',
        componentPath: '',
        icon: '',
        isShow: 1,
        isCache: 1,
        sort: 1
      },
      rules: {
        title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.form.id = this.$route.query.id ? parseInt(this.$route.query.id) : 0
    this.init()
  },
  methods: {
    init () {
      addOrEdit({
        init: true,
        id: this.form.id
      }).then(res => {
        this.menuData = res.data.menu
        if (this.form.id) {
          this.disabled = true
          this.form = res.data.info
          this.parentIds = res.data.parentIds
          this.props.checkStrictly = res.data.info.type === 1
        }
      })
    },
    cascaderChange (v) {
      this.form.parentId = v.length > 0 ? v[v.length - 1] : 0
    },
    setCheckStrictly (v) {
      this.props.checkStrictly = v === 1
      this.parentIds = []
      this.form.parentId = 0
    },
    submitForm () {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.loading = true
          addOrEdit(this.form).then(res => {
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
      this.parentIds = []
    }
  }
}
</script>

<style scoped>
  .el-form {
    max-width: 440px;
  }
</style>
