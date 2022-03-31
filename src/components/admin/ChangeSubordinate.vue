<template>
  <el-dialog title="请选择接管账号" :visible.sync="changeData.isShow" @close="closeDialog" :close-on-click-modal="false">
    <el-radio v-for="item in changeData.list" v-model="changeData.checked_admin_id" :label="item.id" :key="item.id">
      {{ item.account }}</el-radio>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button v-if="changeData.list.length > 0" type="primary" @click="onSubmit" :loading="loading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  changeTakeover
} from '@/common/api/admin'

export default {
  name: 'ChangeSubordinate',
  data () {
    return {
      loading: false
    }
  },
  props: {
    changeData: {
      type: Object,
      default: function () {
        return {
          isShow: false,
          title: '',
          checked_admin_id: 0,
          list: [],
          admin_id: 0
        }
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('close-change-dialog')
    },
    onSubmit () {
      if (this.changeData.checked_admin_id <= 0) {
        this.$message.warning('请选择接管账号')
        return
      }
      this.loading = true
      changeTakeover({
        old_admin_id: this.changeData.admin_id,
        new_admin_id: this.changeData.checked_admin_id
      }).then(res => {
        this.loading = false
        this.$message.success(res.msg)
        this.closeDialog()
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>
</style>
