<template>
  <div>
    <!-- 工具栏 -->
    <div class="tool">
      <el-input v-model="keyword" size="mini" placeholder="请输入管理员账号或姓名" @keyup.enter.native="search" clearable />
      <el-button type="primary" size="mini" @click="search" :loading="searchLoading" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加管理员</el-button>
      <el-button type="success" size="mini" @click="showAdminTree">管理员关系树</el-button>
      <el-button type="info" size="mini" @click="exportExcel" :loading="downloadLoading" icon="el-icon-download">导出</el-button>
      <el-button type="danger" size="mini" :disabled="!multipleSelection.length" @click="del">删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="tableLoading" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="36"></el-table-column>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="trueName" label="姓名"></el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
      <el-table-column prop="deptName" label="部门"></el-table-column>
      <el-table-column prop="postName" label="岗位"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column prop="isAble" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isAble == 1" style="color: #67C23A;">正常</span>
          <span v-else style="color: #909399;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="306">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="success" size="mini" @click="modifyPwd(scope.row.id)">重置密码</el-button>
          <el-button type="warning" size="mini" @click="modifyChildParent(scope.row)">变更下级接管账号</el-button>
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
    <!-- 管理员关系树 -->
    <admin-tree :treeData="treeData" @close-tree-dialog="closeTreeDialog" />
    <!-- 变更接管账号 -->
    <el-dialog
      title="变更下级接管账号"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form
        :model="form"
        :rules="rules"
        ref="modifyChildParentForm">
        <el-form-item label="请选择账号" prop="newAdminId">
          <el-select v-model="form.newAdminId" filterable clearable placeholder="请选择">
            <el-option v-for="item in adminChildren" :key="item.id" :label="item.value" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="submitLoading">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminData, deleteAdmin, modifyPassword, modifySuperior, exportData } from '@/common/api/system/admin'
import { validatePassword } from '@/common/utils/validate'
import { encryptData } from '@/common/utils/rsa'
import AdminTree from './tree'

export default {
  name: 'Admin',
  data () {
    return {
      tableData: [],
      count: 0,
      page: 1,
      size: 10,
      keyword: '',
      multipleSelection: [],
      tableLoading: false,
      searchLoading: false,
      submitLoading: false,
      downloadLoading: false,
      treeData: {
        isShow: false
      },
      dialogVisible: false,
      form: {
        oldAdminId: 0,
        newAdminId: ''
      },
      adminChildren: [],
      rules: {
        newAdminId: [{ required: true, message: '请选择下级接管账号', trigger: 'blur' }]
      }
    }
  },
  components: {
    AdminTree
  },
  created () {
    this.getDatas(1)
  },
  methods: {
    getDatas (page) {
      this.tableLoading = true
      this.page = page
      getAdminData({
        page: page,
        size: this.size,
        keyword: this.keyword
      }).then(res => {
        this.tableData = res.data.list
        this.count = res.data.count
        this.tableLoading = this.searchLoading = false
      }).catch(() => {
        this.tableLoading = this.searchLoading = false
      })
    },
    indexMethod (i) {
      return (this.page - 1) * this.size + i + 1
    },
    search () {
      this.searchLoading = true
      this.getDatas(1)
    },
    add () {
      this.$router.push('/system/admin/form')
    },
    edit (id) {
      this.$router.push('/system/admin/form?id=' + id)
    },
    modifyPwd (id) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: validatePassword,
        inputErrorMessage: '必须包含大小写字母和数字的组合，可以使用特殊字符，长度在6-15之间',
        inputType: 'password',
        closeOnClickModal: false
      }).then(({
        value
      }) => {
        modifyPassword({
          id: id,
          pwd: encryptData(value)
        }).then(res => {
          this.$message.success(res.msg)
        })
      }).catch(() => {})
    },
    modifyChildParent (row) {
      modifySuperior({
        init: true,
        oldAdminId: row.id
      }).then(res => {
        if (res.data.hasChildren === false) {
          this.$message.warning('该账号无下级，无需更换！')
        } else {
          this.adminChildren = res.data.children
          this.form.newAdminId = this.form.oldAdminId = row.id
          this.dialogVisible = true
        }
      })
    },
    onSubmit () {
      this.$refs.modifyChildParentForm.validate((valid) => {
        if (valid) {
          this.submitLoading = true
          modifySuperior(this.form).then(res => {
            this.submitLoading = false
            this.$message.success(res.msg)
            this.closeDialog()
          }).catch(() => {
            this.submitLoading = false
          })
        } else {
          return false
        }
      })
    },
    closeDialog () {
      this.dialogVisible = false
      this.$refs.modifyChildParentForm.resetFields()
    },
    del () {
      if (this.multipleSelection.length <= 0) {
        this.$message.warning('请选择要删除的管理员')
        return
      }
      this.$confirm('确定要删除该账号吗？', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => {
          return item.id
        })
        deleteAdmin({ ids: ids }).then(res => {
          this.$message.success(res.msg)
          this.getDatas(this.page)
        }).catch(() => {})
      }).catch(() => {})
    },
    showAdminTree () {
      this.treeData.isShow = true
    },
    closeTreeDialog () {
      this.treeData.isShow = false
    },
    handleSelectionChange (v) {
      this.multipleSelection = v
    },
    exportExcel () {
      this.downloadLoading = true
      exportData({
        keyword: this.keyword
      }).then(res => {
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
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
</style>
