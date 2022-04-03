<template>
  <div>
    <div class="tool">
      <div class="search">
        <el-input v-model="account" size="mini" placeholder="请输入管理员账号" autocomplete="off" clearable
          @keyup.enter.native="search" />
        <el-button type="primary" size="mini" @click="search" :loading="loading" icon="el-icon-search">搜索</el-button>
      </div>
      <div>
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="add()">添加管理员</el-button>
        <el-button type="success" size="mini" @click="isShowTreeDialog = true">管理员关系树</el-button>
        <el-button type="danger" size="mini" :disabled="!multipleSelection.length" @click="del()">删除</el-button>
      </div>
    </div>
    <el-table :data="list" :loading="true" border row-key="id" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="36"></el-table-column>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="account" label="账号"></el-table-column>
      <el-table-column prop="true_name" label="姓名"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="department_name" label="部门"></el-table-column>
      <el-table-column prop="post_name" label="岗位"></el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="is_able" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.is_able == 1" style="color: #67C23A;">正常</span>
          <span v-else style="color: #909399;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="306">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="success" size="mini" @click="modifyPwd(scope.row.id)">重置密码</el-button>
          <el-button type="warning" size="mini" @click="modifyChildren(scope.row)">变更下级接管账号</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next" :total="count" :page-size.sync="size"
      :current-page="page" @current-change="loadList" />
    <add-or-edit :addOrEditData="addOrEditData" @close-add-or-edit-dialog="closeAddOrEditDialog" />
    <admin-tree :isShowTreeDialog="isShowTreeDialog" @close-tree-dialog="isShowTreeDialog = false" />
    <change-subordinate :changeData="changeData" @close-change-dialog="changeData.isShow = false" />
  </div>
</template>

<script>
import {
  getListData,
  addOrEdit,
  remove,
  modifyPassword,
  changeTakeover
} from '@/common/api/admin'
import {
  validatePassword
} from '@/common/utils/validate'
import AddOrEdit from '@/components/admin/AddOrEdit'
import AdminTree from '@/components/admin/AdminTree'
import ChangeSubordinate from '@/components/admin/ChangeSubordinate'
import {
  encryptData
} from '@/common/utils/rsa'

export default {
  name: 'Admin',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      account: '',
      loading: false,
      multipleSelection: [],
      isShowTreeDialog: false,
      addOrEditData: {
        title: '',
        isShow: false,
        role: [],
        dept_checked: [],
        post: [],
        form1: {}
      },
      changeData: {
        isShow: false,
        list: [],
        checked_admin_id: 0,
        admin_id: 0
      }
    }
  },
  components: {
    AddOrEdit,
    AdminTree,
    ChangeSubordinate
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
        account: this.account
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
    modifyPwd (id) {
      this.$prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: validatePassword,
        inputErrorMessage: '必须使用强密码，长度在6-10之间',
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
    modifyChildren (row) {
      changeTakeover({
        admin_id: row.id,
        check: 1
      }).then(res => {
        if (res.data.exists) {
          changeTakeover({
            check: 2
          }).then(res => {
            this.changeData.isShow = true
            this.changeData.list = res.data.list
            this.changeData.admin_id = this.changeData.checked_admin_id = row.id
          })
        } else {
          this.$message('该账号暂无下级，无需变更')
        }
      })
    },
    del () {
      if (this.multipleSelection.length <= 0) {
        this.$message.warning('请选择要删除的管理员')
        return
      }

      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        const ids = this.multipleSelection.map(item => {
          return item.id
        })
        remove({
          ids: ids
        }).then(res => {
          this.$message.success(res.msg)
          this.loadList(this.page)
        })
      }).catch(() => {})
    },
    indexMethod (index) {
      return (this.page - 1) * this.size + index + 1
    },
    add () {
      addOrEdit({
        is_init: 1
      }).then(res => {
        this.addOrEditData.title = '添加管理员'
        this.addOrEditData.isShow = true
        this.addOrEditData.role = res.data.role
        this.addOrEditData.post = res.data.post
        this.addOrEditData.form1 = this.addOrEditDataField()
      })
    },
    edit (row) {
      addOrEdit({
        is_init: 1
      }).then(res => {
        this.addOrEditData.title = '编辑管理员[' + row.account + ']'
        this.addOrEditData.isShow = true
        this.addOrEditData.role = res.data.role
        this.addOrEditData.post = res.data.post
        this.addOrEditData.dept_checked = [row.department_id]
        this.addOrEditData.form1 = {
          id: row.id,
          true_name: row.true_name,
          role_id: row.role_id ? row.role_id : '',
          post_id: row.post_id ? row.post_id : '',
          is_able: row.is_able
        }
      })
    },
    addOrEditDataField () {
      return {
        id: 0,
        account: '',
        pwd: '',
        true_name: '',
        role_id: '',
        post_id: '',
        is_able: 1
      }
    },
    closeAddOrEditDialog (res) {
      this.addOrEditData.isShow = false
      this.addOrEditData.form1 = {}
      this.addOrEditData.dept_checked = []
      if (res === true) {
        this.loadList(this.page)
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
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
