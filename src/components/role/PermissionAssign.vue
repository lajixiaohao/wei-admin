<template>
  <el-dialog :title="assignData.title" :visible.sync="assignData.isShowDialog" @close="closeDialog"
    :close-on-click-modal="false">
    <el-tree :data="assignData.menus" ref="tree" node-key="id" show-checkbox check-strictly
      :default-checked-keys="assignData.checked">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  permissionAssign
} from '@/common/api/role'

export default {
  name: 'PermissionAssign',
  data () {
    return {
      loading: false
    }
  },
  props: {
    assignData: {
      type: Object,
      default: function () {
        return {
          title: '',
          isShowDialog: false,
          role_id: 0,
          menus: [],
          checked: []
        }
      }
    }
  },
  methods: {
    closeDialog () {
      this.assignData.menus = []
      this.$emit('close-assign-dialog')
    },
    onSubmit () {
      const ids = this.$refs.tree.getCheckedKeys().toString()
      if (ids.length < 1) {
        this.$message.warning('请选择权限')
        return
      }
      this.loading = true
      permissionAssign({
        role_id: this.assignData.role_id,
        ids: ids
      }).then(res => {
        this.loading = false
        this.$message.success(res.msg)
        this.closeDialog()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>
