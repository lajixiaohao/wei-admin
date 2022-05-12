<template>
  <el-dialog title="角色关系树" :visible.sync="treeData.isShow" @close="closeDialog" :close-on-click-modal="false">
    <el-tree :props="props" :load="loadNode" lazy />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="refresh">刷 新</el-button>
      <el-button @click="closeDialog">关 闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTreeData } from '@/common/api/system/role'

export default {
  name: 'RoleTree',
  data () {
    return {
      props: {
        label: 'roleName',
        isLeaf: 'leaf'
      },
      node: null,
      resolve: null
    }
  },
  props: {
    treeData: {
      type: Object,
      default: function () {
        return {
          isShow: false
        }
      }
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
      getTreeData({ id: id }).then(res => {
        return resolve(res.data)
      })
    },
    refresh () {
      this.node.childNodes = []
      this.loadNode(this.node, this.resolve)
    }
  }
}
</script>
