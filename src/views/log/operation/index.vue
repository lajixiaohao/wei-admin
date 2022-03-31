<template>
  <div>
    <div class="search">
      <el-input v-model="account" size="mini" placeholder="请输入管理员账号" autocomplete="off" clearable
        @keyup.enter.native="search()" />
      <el-button type="primary" size="mini" @click="search()" :loading="loading" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table :data="list" :loading="true" border>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="account" label="管理员"></el-table-column>
      <el-table-column prop="api" label="API标识"></el-table-column>
      <el-table-column prop="ip" label="ip"></el-table-column>
      <el-table-column prop="describe" label="描述"></el-table-column>
      <el-table-column prop="device" label="操作设备">
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row.device)">{{ shortDevice(scope.row.device) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间"></el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next" :total="count" :page-size.sync="size"
      @current-change="loadList" />
  </div>
</template>

<script>
import {
  getOperationList
} from '@/common/api/log'

export default {
  name: 'OperationLog',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      account: '',
      loading: false
    }
  },
  created () {
    this.loadList(1)
  },
  methods: {
    loadList (page) {
      this.page = page
      getOperationList({
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
    indexMethod (index) {
      return (this.page - 1) * this.size + index + 1
    },
    search () {
      this.loading = true
      this.loadList(1)
    },
    detail (v) {
      this.$alert(v)
    }
  },
  computed: {
    shortDevice: function (v) {
      return (v) => {
        return v.length > 20 ? v.substring(0, 20) + '...' : v
      }
    }
  }
}
</script>

<style scoped>
  .search {
    display: flex;
    width: 260px;
  }

  .search .el-button {
    margin-left: 10px;
  }
</style>
