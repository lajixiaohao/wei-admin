<template>
  <div>
    <p class="top">部门累计：{{ deptNum }}（个）</p>
    <el-tree ref="tree" node-key="id" :props="props" :load="loadNode" lazy>
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}{{ getChildrenNums(data.cnum) }}</span>
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
          this.deptNum = res.data.deptNum
        }
        return resolve(res.data.dept)
      })
    },
    getChildrenNums (num) {
      return num > 0 ? '(' + num + ')' : ''
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
