<template>
  <div>
    <el-form :model="form" :rules="rules" ref="menuForm" label-width="100px">
      <el-form-item label="菜单类型" prop="type" v-if="!form.id">
        <el-select v-model="form.type" placeholder="请选择菜单类型" @change="setCheckStrictly">
          <el-option label="显示菜单" :value="1"></el-option>
          <el-option label="隐式菜单" :value="2"></el-option>
        </el-select>
        <span class="form-tips">隐式菜单不会在左侧菜单栏展示。优先级：显示 > 隐式</span>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentId" v-if="!form.id">
        <el-cascader
          v-model="form.parentId"
          :options="menuData"
          :props="props"
          clearable
          filterable
        />
        <span class="form-tips">不选择，则默认为顶级</span>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="form.title" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="页面路径" prop="path">
        <el-input v-model="form.path" placeholder="请输入页面路径" clearable />
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
      <el-form-item label="是否显示" prop="isShow">
        <el-radio v-model="form.isShow" :label="1">是</el-radio>
        <el-radio v-model="form.isShow" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="是否缓存组件" prop="isCache">
        <el-radio v-model="form.isCache" :label="1">是</el-radio>
        <el-radio v-model="form.isCache" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="form.sort" :min="1" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading">立即提交</el-button>
        <el-button @click="resetForm">重置</el-button>
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
      props: {
        checkStrictly: false,
        value: 'id',
        label: 'title',
        children: 'children'
      },
      form: {
        id: 0,
        parentId: [],
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
      addOrEdit({ init: 1, id: this.form.id }).then(res => {
        // 编辑
        if (this.form.id) {
          this.form = res.data
        } else {
          // 添加
          this.menuData = res.data
        }
      })
    },
    setCheckStrictly (v) {
      this.props.checkStrictly = v === 1
      this.form.parentId = []
    },
    submitForm () {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          // 选中菜单数
          const l = this.form.parentId.length
          // 顶级菜单不能为隐式菜单
          if (l === 0 && this.form.type === 2) {
            this.$message.error('顶级菜单不能为隐式菜单')
            return false
          }
          // 显示菜单最多只支持到3级
          if (l === 3 && this.form.type === 1) {
            this.$message.error('显示菜单最多只支持到三级')
            return false
          }
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
    }
  }
}
</script>

<style scoped>
  .el-form {
    max-width: 440px;
  }
</style>
