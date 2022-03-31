<template>
  <el-dialog title="管理员关系树" :visible.sync="isShowTreeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-tree ref="tree" node-key="id" :props="props" :load="loadNode" lazy></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="refresh">刷 新</el-button>
      <el-button @click="closeDialog">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getTreeData
} from '@/common/api/admin'

export default {
  name: 'AdminTree',
  data () {
    return {
      props: {
        label: 'account',
        isLeaf: 'leaf'
      },
      node: null,
      resolve: null
    }
  },
  props: {
    isShowTreeDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close-tree-dialog')
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        this.node = node
        this.resolve = resolve
        this.loadNodeData(0, resolve)
      } else {
        this.loadNodeData(node.data.id, resolve)
      }
    },
    loadNodeData (id, resolve) {
      getTreeData({
        id: id
      }).then(res => {
        return resolve(res.data.list)
      })
    },
    refresh () {
      this.node.childNodes = []
      this.loadNode(this.node, this.resolve)
    }
  }
}
</script>

<style scoped>
  .el-button {
    margin-bottom: 10px;
  }
</style>
