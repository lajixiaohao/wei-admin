<template>
  <div>
    <div>
      <el-button type="primary" size="mini" @click="addMenu">添加菜单</el-button>
      <el-button type="success" size="mini" @click="addPermission">添加权限</el-button>
    </div>
    <el-tree ref="menuTree" node-key="id" :props="props" :load="loadNode" lazy>
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <div>
          <el-tooltip v-if="data.type !== 3 && !data.isShow" class="item" effect="dark" content="菜单不可见" placement="right">
            <span class="inactive">{{ menuType(data.type) }}{{ node.label }}</span>
          </el-tooltip>
          <span v-else>{{ menuType(data.type) }}{{ node.label }}</span>
        </div>
        <div>
          <el-button type="text" size="mini" @click.stop="edit(node, data)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="remove(node, data)">删除</el-button>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
import { getTreeData, remove } from '@/common/api/sys/menu'

export default {
  name: 'Menu',
  data () {
    return {
      node: null,
      props: {
        label: 'title',
        isLeaf: 'leaf'
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
      getTreeData({ parentId: id }).then(res => {
        return resolve(res.data.menu)
      })
    },
    addMenu () {
      this.$router.push('/sys/menu/add-or-edit')
    },
    edit (node, data) {
      if (data.type !== 3) {
        this.$router.push('/sys/menu/add-or-edit?id=' + data.id)
      } else {
        this.$router.push('/sys/menu/permission?id=' + data.id)
      }
    },
    addPermission () {
      this.$router.push('/sys/menu/permission')
    },
    remove (node, data) {
      this.node = node.parent
      const msg = data.type === 3 ? '权限' : '菜单'
      this.$confirm('确定删除' + msg + '：“' + data.title + '”？若下级存在也将一并删除', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        remove({ id: data.id }).then(res => {
          this.$message.success(res.msg)
          const node = this.$refs.menuTree.getNode(this.node)
          node.loaded = false
          node.expand()
        })
      }).catch(() => {})
    },
    menuType (type) {
      if (type === 2) {
        return '【页面菜单】'
      }
      if (type === 3) {
        return '【权限】'
      }
      return ''
    }
  }
}
</script>

<style scoped>
  .el-tree {
    width: 600px;
    margin-top: 10px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }
  .inactive {
    color: #C0C4CC;
  }
</style>
