<template>
  <div>
    <p class="top">部门累计：{{ deptNum }}（个）</p>
    <el-tree ref="tree" node-key="id" :props="props" :load="loadNode" lazy>
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}{{ getChildrenNums(data.cnum) }}</span>
        <span v-if="deptId === data.id">
          <el-button type="text" size="mini" @click.stop="add(node, data)">添加</el-button>
        </span>
        <span v-else>
          <el-button type="text" size="mini" @click.stop="add(node, data)">添加</el-button>
          <el-button type="text" size="mini" @click.stop="edit(node, data)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="remove(node, data)">删除</el-button>
        </span>
      </div>
    </el-tree>
  </div>
</template>

<script>
import { getDeptData } from '@/common/api/sys/dept'

export default {
  name: 'Dept',
  data () {
    return {
      deptNum: 0,
      deptId: 0,
      props: {
        label: 'deptName',
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
      getDeptData({ parentId: id }).then(res => {
        if (id === 0) {
          this.deptId = res.data.deptId
          this.deptNum = res.data.deptNum
        }
        return resolve(res.data.dept)
      })
    },
    getChildrenNums (num) {
      return num > 0 ? '(' + num + ')' : ''
    },
    add (node, data) {
      //
    },
    edit () {
      //
    },
    remove () {
      //
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
</style>
