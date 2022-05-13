<template>
  <div>
    <!-- 工具栏 -->
    <div class="tool">
      <el-input v-model="account" size="mini" placeholder="请输入管理员账号" clearable @keyup.enter.native="search" />
      <el-button type="primary" size="mini" @click="search" :loading="searchLoading" icon="el-icon-search">搜索</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" v-loading="tableLoading" border>
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="account" label="管理员"></el-table-column>
      <el-table-column prop="ip" label="ip">
        <template slot-scope="scope">
          <el-link type="primary" :href="'https://www.ip138.com/iplookup.asp?ip=' + scope.row.ip + '&action=2'" target="_blank">{{ scope.row.ip }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="device" label="登录设备">
        <template slot-scope="scope">
          <el-link @click="detail(scope.row.device)">{{ shortDevice(scope.row.device) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="loginAt" label="登录时间"></el-table-column>
      <el-table-column prop="logoutAt" label="登出时间"></el-table-column>
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
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="count"
      :page-size.sync="size"
      @current-change="getDatas" />
  </div>
</template>

<script>
import { getLoginLogs } from '@/common/api/log/login'

export default {
  name: 'LoginLog',
  data () {
    return {
      tableData: [],
      count: 0,
      page: 1,
      size: 10,
      account: '',
      searchLoading: false,
      tableLoading: false
    }
  },
  created () {
    this.getDatas(1)
  },
  methods: {
    getDatas (page) {
      this.tableLoading = true
      this.page = page
      getLoginLogs({
        page: page,
        size: this.size,
        account: this.account
      }).then(res => {
        this.tableData = res.data.list
        this.count = res.data.count
        this.searchLoading = this.tableLoading = false
      }).catch(() => {
        this.searchLoading = this.tableLoading = false
      })
    },
    indexMethod (index) {
      return (this.page - 1) * this.size + index + 1
    },
    search () {
      this.searchLoading = true
      this.getDatas(1)
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
  .tool .el-input {
    width: 180px;
  }
  .tool .el-button {
    margin-left: 10px;
  }
</style>
