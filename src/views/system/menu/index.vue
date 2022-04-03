<template>
  <div>
    <el-button type="primary" size="mini" icon="el-icon-plus" @click="add()">添加左侧菜单</el-button>
    <el-button type="success" size="mini" @click="addRoute()">添加页面按钮级菜单</el-button>
    <el-button type="warning" size="mini" icon="el-icon-plus" @click="addPermission()">添加权限</el-button>
    <el-button type="primary" size="mini" icon="el-icon-info" @click="$router.push('/system/menu/instruction')">菜单管理使用说明
    </el-button>
    <el-table :data="list" border row-key="id" :tree-props="{children: 'children'}">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="title" label="菜单名称">
        <template slot-scope="scope">
          <span v-if="scope.row.menu_type == 2" class="third-style">【按钮级菜单】{{ scope.row.title }}</span>
          <span v-else-if="scope.row.menu_type == 3" class="third-style">【权限】{{ scope.row.title }}</span>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="页面路径"></el-table-column>
      <el-table-column prop="component_name" label="组件名称"></el-table-column>
      <el-table-column prop="component_path" label="组件路径"></el-table-column>
      <el-table-column prop="is_show" label="是否显示">
        <template slot-scope="scope">
          <span v-if="scope.row.is_show" style="color: #409EFF;">是</span>
          <span v-else style="color: #F56C6C;">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="is_cache" label="组件缓存">
        <template slot-scope="scope">
          <span v-if="scope.row.is_cache" style="color: #409EFF;">是</span>
          <span v-else style="color: #F56C6C;">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column label="操作" fixed="right" width="144">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next" :total="count" :page-size.sync="size"
      @current-change="loadList" />
    <add-or-edit :addOrEditData="addOrEditData" @close-add-or-edit-dialog="closeAddOrEditDialog" />
    <register-route :registerRouteData="registerRouteData" @close-register-route-dialog="closeRegisterRouteDialog" />
    <permission :permissionData="permissionData" @close-permission-dialog="closePermissionDialog" />
  </div>
</template>

<script>
import {
  getListData,
  remove,
  getTwoLevelMenu
} from '@/common/api/menu'
import AddOrEdit from '@/components/menu/AddOrEdit'
import RegisterRoute from '@/components/menu/RegisterRoute'
import Permission from '@/components/menu/permission'

export default {
  name: 'Menu',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      addOrEditData: {
        title: '',
        isShow: false,
        first_level_menu: [],
        form1: {}
      },
      registerRouteData: {
        title: '',
        isShow: false,
        menus: [],
        form1: {}
      },
      permissionData: {
        title: '',
        isShow: false,
        menus: [],
        form1: {}
      }
    }
  },
  components: {
    AddOrEdit,
    RegisterRoute,
    Permission
  },
  created () {
    this.loadList(1)
  },
  methods: {
    loadList (page) {
      this.page = page
      getListData({
        page: page,
        size: this.size
      }).then(res => {
        this.list = res.data.list
        this.count = res.data.count
        if (page === 1) {
          this.addOrEditData.first_level_menu = res.data.first_level_menu
        }
      })
    },
    add () {
      this.addOrEditData.title = '添加菜单'
      this.addOrEditData.isShow = true
      this.addOrEditData.form1 = this.fields()
    },
    edit (row) {
      if (row.menu_type === 1) {
        this.addOrEditData.title = '编辑菜单《' + row.title + '》'
        this.addOrEditData.isShow = true
        this.addOrEditData.form1 = {
          id: row.id,
          parent_id: row.parent_id > 0 ? row.parent_id : '',
          title: row.title,
          path: row.path,
          component_name: row.component_name,
          component_path: row.component_path,
          icon: row.icon,
          sort: row.sort,
          is_show: row.is_show,
          is_cache: row.is_cache
        }
      }
      if (row.menu_type === 2) {
        getTwoLevelMenu().then(res => {
          this.registerRouteData.title = '编辑页面按钮级菜单《' + row.title + '》'
          this.registerRouteData.isShow = true
          this.registerRouteData.menus = res.data.list
          this.registerRouteData.form1 = {
            id: row.id,
            parents: row.parents,
            title: row.title,
            path: row.path,
            component_name: row.component_name,
            component_path: row.component_path,
            is_cache: row.is_cache
          }
        })
      }
      if (row.menu_type === 3) {
        getTwoLevelMenu().then(res => {
          this.permissionData.title = '编辑权限《' + row.title + '》'
          this.permissionData.isShow = true
          this.permissionData.menus = res.data.list
          this.permissionData.form1 = {
            id: row.id,
            parents: row.parents,
            title: row.title,
            path: row.path,
            sort: row.sort
          }
        })
      }
    },
    fields () {
      return {
        id: 0,
        parent_id: '',
        title: '',
        path: '',
        component_name: '',
        component_path: '',
        icon: '',
        sort: 1,
        is_show: 1,
        is_cache: 0
      }
    },
    registerRouteDataField () {
      return {
        id: 0,
        parents: [],
        title: '',
        path: '',
        component_name: '',
        component_path: '',
        is_cache: 0
      }
    },
    del (row) {
      let msg = '确定要删除该菜单吗？若下级菜单或权限存在也将一并删除！'
      if (row.menu_type === 2) {
        msg = '确定要删除该页面按钮级菜单吗'
      }
      if (row.menu_type === 3) {
        msg = '确定要删除该权限吗'
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
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
    closeAddOrEditDialog (res) {
      this.addOrEditData.isShow = false
      this.addOrEditData.form1 = {}
      if (res === true) {
        this.loadList(this.page)
      }
    },
    addRoute () {
      getTwoLevelMenu().then(res => {
        this.registerRouteData.isShow = true
        this.registerRouteData.title = '添加页面按钮级菜单'
        this.registerRouteData.menus = res.data.list
        this.registerRouteData.form1 = this.registerRouteDataField()
      })
    },
    closeRegisterRouteDialog (res) {
      this.registerRouteData.isShow = false
      this.registerRouteData.form1 = {}
      if (res === true) {
        this.loadList(this.page)
      }
    },
    permissionDataFiled () {
      return {
        id: 0,
        parents: [],
        title: '',
        path: '',
        sort: 1
      }
    },
    addPermission () {
      getTwoLevelMenu().then(res => {
        this.permissionData.isShow = true
        this.permissionData.title = '添加权限'
        this.permissionData.form1 = this.permissionDataFiled()
        this.permissionData.menus = res.data.list
      })
    },
    closePermissionDialog (res) {
      this.permissionData.isShow = false
      this.permissionData.form1 = {}
      if (res === true) {
        this.loadList(this.page)
      }
    }
  }
}
</script>

<style scoped>
  .third-style {
    font-size: 12px;
    color: #909399;
  }
</style>
