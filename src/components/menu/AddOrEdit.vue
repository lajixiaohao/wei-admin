<template>
  <el-dialog :title="addOrEditData.title" :visible.sync="addOrEditData.isShow" @close="closeDialog"
    :close-on-click-modal="false">
    <el-form :model="addOrEditData.form1" :rules="rules" ref="form1" label-width="100px">
      <el-form-item label="上级菜单" prop="parent_id">
        <el-select v-model="addOrEditData.form1.parent_id" placeholder="默认顶级" :disabled="addOrEditData.form1.id > 0">
          <el-option v-for="item in addOrEditData.first_level_menu" :key="item.id" :label="item.title"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜单名称" prop="title">
        <el-input v-model="addOrEditData.form1.title" autocomplete="off" placeholder="请输入菜单名称" clearable />
      </el-form-item>
      <el-form-item label="页面路径" prop="path">
        <el-input v-model="addOrEditData.form1.path" autocomplete="off" placeholder="请输入页面路径" clearable />
      </el-form-item>
      <el-form-item label="组件名称" prop="component_name">
        <el-input v-model="addOrEditData.form1.component_name" autocomplete="off" placeholder="请输入组件名称(英文)" clearable />
      </el-form-item>
      <el-form-item label="组件路径" prop="component_path">
        <el-input v-model="addOrEditData.form1.component_path" autocomplete="off" placeholder="请输入组件路径" clearable>
          <template slot="prepend">@/views/</template>
        </el-input>
      </el-form-item>
      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="addOrEditData.form1.icon" autocomplete="off" placeholder="请输入图标名称" clearable>
          <template slot="append">.svg</template>
        </el-input>
        <span class="form-tips">请使用svg图标，位于assets/svg目录下</span>
      </el-form-item>
      <el-form-item label="是否显示" prop="is_show">
        <el-radio v-model="addOrEditData.form1.is_show" :label="1">是</el-radio>
        <el-radio v-model="addOrEditData.form1.is_show" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="是否缓存组件" prop="is_cache">
        <el-radio v-model="addOrEditData.form1.is_cache" :label="1">是</el-radio>
        <el-radio v-model="addOrEditData.form1.is_cache" :label="0">否</el-radio>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="addOrEditData.form1.sort" :min="1" />
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
  addOrEditMenu
} from '@/common/api/menu'

export default {
  name: 'AddEditMenu',
  data () {
    return {
      loading: false,
      rules: {
        title: [{
          required: true,
          message: '请输入菜单名称',
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
          first_level_menu: [],
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
          addOrEditMenu(this.addOrEditData.form1).then(res => {
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
    max-width: 440px;
  }
</style>
