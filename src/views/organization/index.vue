<template>
  <div>
    <div class="search">
      <el-input v-model="name" size="small" placeholder="请输入组织机构名称" autocomplete="off" clearable
        @keyup.enter.native="search()" />
      <el-button type="primary" size="small" @click="search()" :loading="loading" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加</el-button>
    </div>
    <el-table :data="list" :loading="true" border>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="name" label="组织机构"></el-table-column>
      <el-table-column prop="logo" label="logo">
        <template slot-scope="scope">
          <el-image style="width: 60px; height: 45px;" :src="getImageUrl(scope.row.logo)"
            :preview-src-list="[getImageUrl(scope.row.logo)]" />
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
      <el-table-column prop="is_able" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.is_able == 1" style="color: #67C23A;">正常</span>
          <span v-else style="color: #909399;">禁用</span>
        </template>
      </el-table-column>
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
  </div>
</template>

<script>
import {
  getTableData,
  remove
} from '@/common/api/organization'
import AddOrEdit from '@/components/organization/AddOrEdit'

export default {
  name: 'Organization',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      name: '',
      loading: false,
      addOrEditData: {
        title: '',
        isShow: false,
        form1: {}
      }
    }
  },
  components: {
    AddOrEdit
  },
  created () {
    this.loadList(1)
  },
  methods: {
    loadList (page) {
      this.page = page
      getTableData({
        page: page,
        size: this.size,
        name: this.name
      }).then(res => {
        this.list = res.data.list
        this.count = res.data.count
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    indexMethod (index) {
      return (this.page - 1) * this.size + index + 1
    },
    search () {
      this.loading = true
      this.loadList(1)
    },
    addOrEditDataField () {
      return {
        id: 0,
        name: '',
        abbreviation: '',
        introduction: '',
        logo: '',
        is_able: 1
      }
    },
    add () {
      this.addOrEditData.title = '添加组织机构'
      this.addOrEditData.isShow = true
      this.addOrEditData.form1 = this.addOrEditDataField()
    },
    edit (row) {
      this.addOrEditData.title = '编辑组织机构：' + row.name
      this.addOrEditData.isShow = true
      this.addOrEditData.form1 = {
        id: row.id,
        name: row.name,
        abbreviation: row.abbreviation,
        introduction: row.introduction,
        logo: row.logo,
        is_able: row.is_able
      }
    },
    closeAddOrEditDialog (res = false) {
      this.addOrEditData.isShow = false
      this.addOrEditData.form1 = {}
      if (res) {
        this.loadList(this.page)
      }
    },
    del (row) {
      this.$confirm('确定要删除该组织机构吗？', '提示', {
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
    getImageUrl (url) {
      return process.env.VUE_APP_RESOURCE_URL + url
    }
  }
}
</script>

<style scoped>
  .search {
    display: flex;
    width: 340px;
  }

  .search .el-button {
    margin-left: 10px;
  }
</style>
