<template>
  <div>
    <!-- 工具栏 -->
    <div class="tool">
      <el-input v-model="roleName" size="mini" placeholder="请输入角色名称" @keyup.enter.native="search" clearable />
      <el-button type="primary" size="mini" @click="search" :loading="searchLoading" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加角色</el-button>
      <el-button type="success" size="mini" @click="showRoleTree">角色关系树</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="list" v-loading="tableLoading" border row-key="id">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column prop="isAble" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isAble === 1" style="color: #67C23A;">正常</span>
          <span v-else style="color: #909399;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="234">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="assignPermission(scope.row)">分配权限</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="count"
      :page-size.sync="size"
      @current-change="getDatas" />
    <!-- 添加、编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form
        :model="form"
        :rules="rules"
        ref="roleForm"
        label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="角色介绍" prop="roleIntroduce">
          <el-input v-model="form.roleIntroduce" type="textarea" placeholder="请输入角色介绍" />
        </el-form-item>
        <el-form-item label="状态" prop="isAble">
          <el-radio v-model="form.isAble" :label="1">激活</el-radio>
          <el-radio v-model="form.isAble" :label="0">禁用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 角色关系树 -->
    <role-tree :treeData="treeData" @close-tree-dialog="closeTreeDialog" />
  </div>
</template>

<script>
import { getRoleData, addOrEdit, deleteRole } from '@/common/api/sys/role'
import RoleTree from './tree'

export default {
  name: 'Role',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      roleName: '',
      tableLoading: false,
      searchLoading: false,
      submitLoading: false,
      treeData: {
        isShow: false
      },
      dialogVisible: false,
      dialogTitle: '',
      form: {},
      rules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      }
    }
  },
  components: {
    RoleTree
  },
  created () {
    this.getDatas(1)
  },
  methods: {
    getDatas (page) {
      this.tableLoading = true
      this.page = page
      getRoleData({
        page: page,
        size: this.size,
        roleName: this.roleName
      }).then(res => {
        this.list = res.data.list
        this.count = res.data.count
        this.tableLoading = false
        this.searchLoading = false
      }).catch(() => {
        this.tableLoading = false
        this.searchLoading = false
      })
    },
    search () {
      this.searchLoading = true
      this.getDatas(1)
    },
    indexMethod (i) {
      return (this.page - 1) * this.size + i + 1
    },
    add () {
      this.dialogVisible = true
      this.dialogTitle = '添加角色'
      this.form = {
        id: 0,
        roleName: '',
        roleIntroduce: '',
        isAble: 1
      }
    },
    edit (row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑角色'
      this.form = {
        id: row.id,
        roleName: row.roleName,
        roleIntroduce: row.roleIntroduce,
        isAble: row.isAble
      }
    },
    onSubmit () {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          addOrEdit(this.form).then(res => {
            this.submitLoading = false
            this.$message.success(res.msg)
            this.closeDialog(true)
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    closeDialog (res) {
      this.dialogVisible = false
      this.$refs.roleForm.resetFields()
      if (res === true) {
        this.getDatas(this.page)
      }
    },
    showRoleTree () {
      this.treeData.isShow = true
    },
    closeTreeDialog () {
      this.treeData.isShow = false
    },
    del (row) {
      this.$confirm('确定要删除角色【' + row.roleName + '】吗？其所属角色也将一并删除！', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        deleteRole({ id: row.id }).then(res => {
          this.$message.success(res.msg)
          this.getDatas(this.page)
        })
      }).catch(() => {})
    },
    assignPermission (row) {
      this.$router.push('/sys/role/permission?roleId=' + row.id)
    }
  }
}
</script>

<style scoped>
  .tool .el-input {
    width: 180px;
  }
  .tool .el-button {
    margin-left: 10px;
  }
  .el-dialog .el-form {
    max-width: 400px;
  }
</style>
