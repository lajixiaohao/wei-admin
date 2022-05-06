<template>
  <div>
    <el-tree
      :data="menus"
      ref="permissionTree"
      node-key="id"
      show-checkbox
      check-strictly
      :default-checked-keys="checked"
      v-loading="treeLoading" />
  </div>
</template>

<script>
import { permissionAssign } from '@/common/api/sys/role'

export default {
  name: 'AssignPermission',
  data () {
    return {
      roleId: 0,
      treeLoading: false,
      menus: [],
      checked: []
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
      }).catch(() => {
        this.treeLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .el-tree {
    width: 600px;
    margin-top: 10px;
  }
</style>
