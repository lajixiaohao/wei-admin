<template>
  <div>
    <div class="search">
      <el-input v-model="account" size="mini" placeholder="请输入管理员账号" autocomplete="off" clearable
        @keyup.enter.native="search()" />
      <el-button type="primary" size="mini" @click="search()" :loading="loading" icon="el-icon-search">搜索</el-button>
      <el-button type="info" size="mini" @click="exportExcel" :loading="downloadLoading" icon="el-icon-download">导出</el-button>
    </div>
    <el-table :data="list" :loading="true" border>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="account" label="管理员"></el-table-column>
      <el-table-column prop="ip" label="ip"></el-table-column>
      <el-table-column prop="device" label="登录设备">
        <template slot-scope="scope">
          <el-link type="primary" @click="detail(scope.row.device)">{{ shortDevice(scope.row.device) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="login_at" label="登录时间"></el-table-column>
      <el-table-column prop="logout_at" label="登出时间"></el-table-column>
      <el-table-column prop="duration" label="在线时长"></el-table-column>
      <el-table-column prop="remarkType" label="备注">
        <template slot-scope="scope">
          <span v-if="scope.row.remarkType == 1" style="color: #67C23A;">当前在线</span>
          <span v-if="scope.row.remarkType == 2">正常退出</span>
          <span v-if="scope.row.remarkType == 3" style="color: #E6A23C;">其他设备登录</span>
          <span v-if="scope.row.remarkType == 4" style="color: #F56C6C;">异常</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="total, prev, pager, next" :total="count" :page-size.sync="size"
      @current-change="loadList" />
  </div>
</template>

<script>
import {
  getLoginList,
  exportLoginLog
} from '@/common/api/log'

export default {
  name: 'LoginLog',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      account: '',
      loading: false,
      downloadLoading: false
    }
  },
  created () {
    this.loadList(1)
  },
  methods: {
    loadList (page) {
      this.page = page
      getLoginList({
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
    },
    exportExcel () {
      this.downloadLoading = true
      exportLoginLog({
        account: this.account
      }).then(res => {
        this.downloadLoading = false
      }).catch(() => {
        this.downloadLoading = false
      })
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
    width: 320px;
  }

  .search .el-button {
    margin-left: 10px;
  }
</style>
