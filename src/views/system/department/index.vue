<template>
  <div>
    <p class="top">部门累计：{{ departmentNum }}（个）</p>
    <el-tree ref="tree" node-key="id" :props="props" :load="loadNode" lazy>
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <el-tooltip v-if="!data.is_able" class="item" effect="dark" content="该部门已停用" placement="right">
          <span class="inactive">{{ node.label }}{{ getChildrenNums(data.cnum) }}</span>
        </el-tooltip>
        <span v-else>{{ node.label }}{{ getChildrenNums(data.cnum) }}</span>

        <span v-if="departmentId == data.id">
          <el-button type="text" size="mini" @click.stop="add(node, data)">添加</el-button>
        </span>
        <span v-else>
          <el-button type="text" size="mini" @click.stop="add(node, data)">添加</el-button>
          <el-button type="text" size="mini" @click.stop="edit(node, data)">编辑</el-button>
          <el-button type="text" size="mini" @click.stop="remove(node, data)">删除</el-button>
        </span>
      </div>
    </el-tree>
    <add-or-edit :addOrEditData="addOrEditData" @close-add-or-edit-dialog="closeAddOrEditDialog" />
  </div>
</template>

<script>
import {
  getTreeData,
  remove
} from '@/common/api/department'
import AddOrEdit from '@/components/department/AddOrEdit'

export default {
  name: 'Department',
  data () {
    return {
      props: {
        label: 'name',
        isLeaf: 'leaf'
      },
      departmentId: 0,
      departmentNum: 0,
      node: null,
      addOrEditData: {
        title: '',
        isShow: false,
        parent_name: '',
        form1: {}
      }
    }
  },
  components: {
    AddOrEdit
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
      getTreeData({
        parent_id: id
      }).then(res => {
        if (id === 0) {
          this.departmentId = res.data.departmentId
          this.departmentNum = res.data.departmentNum
        }
        return resolve(res.data.list)
      })
    },
    addOrEditDataField () {
      return {
        id: 0,
        parent_id: 0,
        name: '',
        sort: 1,
        is_able: 1
      }
    },
    add (node, data) {
      this.node = node
      this.addOrEditData.title = '添加部门'
      this.addOrEditData.isShow = true
      this.addOrEditData.form1 = this.addOrEditDataField()
      this.addOrEditData.form1.parent_id = data.id
      this.addOrEditData.parent_name = data.name
    },
    edit (node, data) {
      this.node = node.parent
      this.addOrEditData.title = '编辑部门'
      this.addOrEditData.isShow = true
      this.addOrEditData.form1 = {
        id: data.id,
        parent_id: node.parent.data.id,
        name: data.name,
        sort: data.sort,
        is_able: data.is_able
      }
      this.addOrEditData.parent_name = node.parent.data.name
    },
    remove (node, data) {
      this.node = node.parent
      this.$confirm('确定要删除部门【' + data.name + '】吗？其下属部门也将一并删除', '提示', {
        confirmButtonText: '是的',
        cancelButtonText: '再想想',
        type: 'warning'
      }).then(() => {
        remove({
          id: data.id
        }).then(res => {
          this.$message.success(res.msg)
          this.departmentNum = res.data.departmentNum
          const node = this.$refs.tree.getNode(this.node)
          node.data.cnum--
          node.loaded = false
          node.expand()
        })
      }).catch(() => {})
    },
    closeAddOrEditDialog (res) {
      this.addOrEditData.isShow = false
      if (res === true) {
        const node = this.$refs.tree.getNode(this.node)
        node.loaded = false
        node.expand()

        if (this.addOrEditData.form1.id === 0) {
          this.departmentNum++
          if (node.data.id > 1) {
            node.data.cnum++
          }
        }
      }
      this.addOrEditData.form1 = {}
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

  .inactive {
    color: #C0C4CC;
  }
</style>
