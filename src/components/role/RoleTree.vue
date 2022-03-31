<template>
  <el-dialog title="角色关系树" :visible.sync="isShowTreeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-tree :props="props" :load="loadNode" lazy></el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="refresh">刷 新</el-button>
      <el-button @click="closeDialog">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  getTreeData
} from '@/common/api/role'

export default {
  name: 'RoleTree',
  data () {
    return {
      props: {
        label: 'role_name',
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

<style>
</style>
