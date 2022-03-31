<template>
  <div>
    <div class="tool">
      <div class="search">
        <el-input v-model="role_name" size="mini" placeholder="请输入角色名称" autocomplete="off" clearable
          @keyup.enter.native="search" />
        <el-button type="primary" size="mini" @click="search" :loading="loading" icon="el-icon-search">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加角色</el-button>
        <el-button type="success" size="mini" @click="isShowTreeDialog = true">角色关系树</el-button>
      </div>
    </div>
    <el-table :data="list" :loading="true" border row-key="id">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="role_name" label="角色名称"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="is_able" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.is_able == 1" style="color: #67C23A;">正常</span>
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
    <el-pagination background layout="total, prev, pager, next" :total="count" :page-size.sync="size"
      :current-page="page" @current-change="loadList" />
    <add-or-edit :addOrEditData="addOrEditData" @close-add-or-edit-dialog="closeAddOrEditDialog" />
    <role-tree :isShowTreeDialog="isShowTreeDialog" @close-tree-dialog="isShowTreeDialog = false" />
    <permission-assign :assignData="assignData" @close-assign-dialog="assignData.isShowDialog = false" />
  </div>
</template>

<script>
import {
  getListData,
  remove,
  permissionAssign
} from '@/common/api/role'
import RoleTree from '@/components/role/RoleTree'
import PermissionAssign from '@/components/role/PermissionAssign'
import AddOrEdit from '@/components/role/AddOrEdit'

export default {
  name: 'Role',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      role_name: '',
      loading: false,
      isShowTreeDialog: false,
      assignData: {
        title: '',
        isShowDialog: false,
        role_id: 0,
        menus: [],
        checked: []
      },
      addOrEditData: {
        title: '',
        isShowDialog: false,
        form1: {}
      }
    }
  },
  components: {
    RoleTree,
    PermissionAssign,
    AddOrEdit
  },
  created () {
    this.loadList(1)
  },
  methods: {
    loadList (page) {
      this.page = page
      getListData({
        page: page,
        size: this.size,
        role_name: this.role_name
      }).then(res => {
        this.list = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    search () {
      this.loading = true
      this.loadList(1)
    },
    add () {
      this.addOrEditData.title = '添加角色'
      this.addOrEditData.isShow = true
      this.addOrEditData.form1 = this.fields()
    },
    edit (row) {
      this.addOrEditData.title = '编辑角色：' + row.role_name
      this.addOrEditData.isShow = true
      this.addOrEditData.form1 = {
        id: row.id,
        role_name: row.role_name,
        role_describe: row.role_describe,
        is_able: row.is_able
      }
    },
    del (row) {
      this.$confirm('确定要删除角色【' + row.role_name + '】吗？其所属角色也将一并删除！', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        remove({
          id: row.id
        }).then(res => {
          this.$message.success(res.msg)
          this.loadList(this.page)
        })
      }).catch(() => {})
    },
    indexMethod (index) {
      return (this.page - 1) * this.size + index + 1
    },
    assignPermission (row) {
      permissionAssign({
        is_init: 1,
        role_id: row.id
      }).then(res => {
        this.assignData.isShowDialog = true
        this.assignData.role_id = row.id
        this.assignData.title = '为角色【' + row.role_name + '】分配权限'
        this.assignData.menus = res.data.trees
        this.assignData.checked = res.data.checked
      })
    },
    fields () {
      return {
        id: 0,
        role_name: '',
        role_describe: '',
        is_able: 1
      }
    },
    closeAddOrEditDialog (res) {
      this.addOrEditData.isShow = false
      this.addOrEditData.form1 = {}
      if (res) {
        this.loadList(this.page)
      }
    }
  }
}
</script>

<style scoped>
  .tool {
    display: flex;
    align-items: center;
  }

  .search {
    display: flex;
    width: 260px;
    margin-right: 10px;
  }

  .search .el-button {
    margin-left: 10px;
  }
</style>
