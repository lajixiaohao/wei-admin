<template>
  <div>
    <p>为角色：“{{ roleName }}”分配权限</p>
    <el-tree
      :data="menus"
      ref="permissionTree"
      node-key="id"
      show-checkbox
      check-strictly
      default-expand-all
      :default-checked-keys="checked"
      v-loading="treeLoading" />
    <div class="submit">
      <el-button type="primary" size="mini" @click="onSubmit" :loading="submitLoading">立即提交</el-button>
    </div>
  </div>
</template>

<script>
import { permissionAssign } from '@/common/api/sys/role'

export default {
  name: 'AssignPermission',
  data () {
    return {
      roleId: 0,
      roleName: '',
      treeLoading: false,
      menus: [],
      checked: [],
      submitLoading: false
    }
  },
  created () {
    this.roleId = this.$route.query.roleId ? parseInt(this.$route.query.roleId) : 0
    this.init()
  },
  methods: {
    init () {
      this.treeLoading = true
      permissionAssign({
        isInit: 1,
        roleId: this.roleId
      }).then(res => {
        this.treeLoading = false
        this.menus = res.data.menus
        this.checked = res.data.checked
        this.roleName = res.data.roleName
      }).catch(() => {
        this.treeLoading = false
      })
    },
    onSubmit () {
      const ids = this.$refs.permissionTree.getCheckedKeys().toString()
      if (ids.length < 1) {
        this.$message.error('请选择权限')
        return
      }
      this.submitLoading = true
      permissionAssign({
        roleId: this.roleId,
        ids: ids
      }).then(res => {
        this.submitLoading = false
        this.$message.success(res.msg)
      }).catch(() => {
        this.submitLoading = false
      })
    }
  }
}
</script>

<style scoped>
  p {
    font-size: 15px;
  }
  .el-tree {
    max-width: 600px;
    margin-top: 10px;
    border-left: 1px solid #e2e2e2;
  }
  .submit {
    margin: 20px 0 0 10px;
  }
</style>
