<template>
  <div>
    <!-- 工具栏 -->
    <div class="tool">
      <el-input v-model="postName" size="mini" placeholder="请输入岗位名称" @keyup.enter.native="search" clearable />
      <el-button type="primary" size="mini" @click="search" :loading="searchLoading" icon="el-icon-search">搜索</el-button>
      <el-button type="primary" size="mini" icon="el-icon-plus" @click="add">添加岗位</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="list" v-loading="tableLoading" border row-key="id">
      <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
      <el-table-column prop="postName" label="岗位名称"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column prop="isAble" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isAble === 1" style="color: #67C23A;">正常</span>
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
    <!-- 分页 -->
    <el-pagination
      background
      layout="total, prev, pager, next"
      :total="count"
      :page-size.sync="size"
      @current-change="getDatas" />
    <!-- 添加或编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog">
      <el-form
        :model="form"
        :rules="rules"
        ref="postForm"
        label-width="100px">
        <el-form-item label="岗位名称" prop="postName">
          <el-input v-model="form.postName" placeholder="请输入岗位名称" clearable />
        </el-form-item>
        <el-form-item label="岗位介绍" prop="postIntroduce">
          <el-input v-model="form.postIntroduce" type="textarea" placeholder="请输入岗位介绍" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" />
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
  </div>
</template>

<script>
import { getPostData, addOrEdit, deletePost } from '@/common/api/sys/post'

export default {
  name: 'Post',
  data () {
    return {
      list: [],
      count: 0,
      page: 1,
      size: 10,
      postName: '',
      tableLoading: false,
      searchLoading: false,
      submitLoading: false,
      dialogTitle: '',
      dialogVisible: false,
      form: {},
      rules: {
        postName: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getDatas(1)
  },
  methods: {
    getDatas (page) {
      this.tableLoading = true
      this.page = page
      getPostData({
        page: page,
        size: this.size,
        postName: this.postName
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
    indexMethod (i) {
      return (this.page - 1) * this.size + i + 1
    },
    search () {
      this.searchLoading = true
      this.getDatas(1)
    },
    add () {
      this.dialogVisible = true
      this.dialogTitle = '添加岗位'
      this.form = {
        id: 0,
        postName: '',
        postIntroduce: '',
        sort: 1,
        isAble: 1
      }
    },
    edit (row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑岗位'
      this.form = {
        id: row.id,
        postName: row.postName,
        postIntroduce: row.postIntroduce,
        sort: row.sort,
        isAble: row.isAble
      }
    },
    onSubmit () {
      this.$refs.postForm.validate((valid) => {
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
    del (row) {
      this.$confirm('确定要删除岗位【' + row.postName + '】吗？', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        deletePost({ id: row.id }).then(res => {
          this.$message.success(res.msg)
          this.getDatas(this.page)
        })
      }).catch(() => {})
    },
    closeDialog (res) {
      this.dialogVisible = false
      this.$refs.postForm.resetFields()
      if (res === true) {
        this.getDatas(this.page)
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
  .el-dialog .el-form {
    max-width: 400px;
  }
</style>
