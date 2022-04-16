<template>
  <div>
    <p class="top">部门累计：{{ deptNum }}（个）</p>
    <el-tree ref="deptTree" node-key="id" :props="props" :load="loadNode" lazy>
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}{{ getChildrenNums(data.cnum) }}</span>
        <span v-if="data.parentId === 0">
          <el-button type="text" size="mini" @click.stop="add(node, data)">添加</el-button>
        </span>
        <span v-else>
          <el-button type="text" size="mini" @click.stop="add(node, data)">添加</el-button>
          <el-button type="text" size="mini" @click.stop="edit(node, data)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="remove(node, data)">删除</el-button>
        </span>
      </div>
    </el-tree>
    <!-- 添加、编辑 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="deptForm"
        label-width="100px"
      >
        <el-form-item label="上级部门" v-show="form.id === 0">
          <el-input v-model="parentName" :disabled="true" />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入部门名称" clearable />
        </el-form-item>
        <el-form-item label="部门介绍" prop="deptIntroduce">
          <el-input type="textarea" v-model="form.deptIntroduce" placeholder="请输入部门介绍" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="onSubmit" :loading="loading">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDeptData, addOrEdit, remove } from '@/common/api/sys/dept'

export default {
  name: 'Dept',
  data () {
    return {
      node: null,
      deptNum: 0,
      props: {
        label: 'deptName',
        isLeaf: 'leaf'
      },
      dialogTitle: '',
      dialogVisible: false,
      loading: false,
      parentName: '',
      form: {},
      rules: {
        deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.loadNodeData(0, resolve)
      } else {
        this.loadNodeData(node.data.id, resolve)
      }
    },
    loadNodeData (id, resolve) {
      getDeptData({ parentId: id }).then(res => {
        if (id === 0) {
          this.deptNum = res.data.deptNum
        }
        return resolve(res.data.dept)
      })
    },
    getChildrenNums (num) {
      return num > 0 ? '(' + num + ')' : ''
    },
    formField () {
      return {
        id: 0,
        parentId: 0,
        deptName: '',
        deptIntroduce: '',
        sort: 1
      }
    },
    add (node, data) {
      this.node = node
      this.dialogVisible = true
      this.dialogTitle = '添加部门'
      this.parentName = data.deptName
      this.form = this.formField()
      this.form.parentId = data.id
    },
    edit (node, data) {
      this.node = node.parent
      this.dialogVisible = true
      this.dialogTitle = '编辑部门'
      this.form = {
        id: data.id,
        parentId: data.parentId,
        deptName: data.deptName,
        deptIntroduce: data.deptIntroduce,
        sort: data.sort
      }
    },
    onSubmit () {
      this.$refs.deptForm.validate((valid) => {
        if (valid) {
          this.loading = true
          addOrEdit(this.form).then(res => {
            this.loading = false
            this.$message.success(res.msg)
            this.closeDialog(true)
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    remove (node, data) {
      this.node = node.parent
      this.$confirm('确定删除部门：' + data.deptName + '？若下级存在也将一并删除', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        remove({ id: data.id }).then(res => {
          this.$message.success(res.msg)
          this.deptNum -= res.data.deleteNum
          const node = this.$refs.deptTree.getNode(this.node)
          node.data.cnum--
          node.loaded = false
          node.expand()
        })
      }).catch(() => {})
    },
    closeDialog (res) {
      this.dialogVisible = false
      if (res === true) {
        const node = this.$refs.deptTree.getNode(this.node)
        node.loaded = false
        node.expand()

        if (this.form.id === 0) {
          this.deptNum++
          if (node.data.id > 1) {
            node.data.cnum++
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .top {
    font-size: 14px;
    color: #909399;
  }
  .el-tree {
    width: 600px;
    border: 1px solid #E4E7ED;
    margin-top: 6px;
    border-radius: 4px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-dialog .el-form {
    max-width: 400px;
  }
</style>
