<template>
  <el-dialog :title="addOrEditData.title" :visible.sync="addOrEditData.isShow" @close="closeDialog"
    :close-on-click-modal="false">
    <el-form :model="addOrEditData.form1" :rules="rules" ref="form1" label-width="120px">
      <el-form-item label="组织全称" prop="name">
        <el-input v-model="addOrEditData.form1.name" autocomplete="off" placeholder="请输入组织机构全称" clearable />
      </el-form-item>
      <el-form-item label="组织简称">
        <el-input v-model="addOrEditData.form1.abbreviation" autocomplete="off" placeholder="请输入组织机构简称" clearable />
      </el-form-item>
      <el-form-item label="组织简介">
        <el-input type="textarea" v-model="addOrEditData.form1.introduction" placeholder="请输入组织机构简介" />
      </el-form-item>
      <el-form-item label="组织logo">
        <el-upload
          class="avatar-uploader"
          name="weifile"
          :action="uploadImageUrl"
          :show-file-list="false"
          :on-success="handleHeadSuccess"
          :before-upload="beforeUpload"
          :headers="header">
          <img v-if="addOrEditData.form1.logo" :src="resourceUrl+addOrEditData.form1.logo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">只支持jpg/png/gif文件，且不超过3MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态" prop="is_able">
        <el-radio v-model="addOrEditData.form1.is_able" :label="1">激活</el-radio>
        <el-radio v-model="addOrEditData.form1.is_able" :label="0">禁用</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addOrEdit } from '@/common/api/organization'
import { UPLOAD_IMAGE_URL } from '@/common/const'
import { getToken } from '@/common/utils/auth'

export default {
  name: 'AddOrEditOrganization',
  data () {
    return {
      loading: false,
      header: {
        Token: getToken()
      },
      uploadImageUrl: UPLOAD_IMAGE_URL,
      resourceUrl: process.env.VUE_APP_RESOURCE_URL,
      rules: {
        name: [{
          required: true,
          message: '请输入组织机构全称',
          trigger: 'blur'
        }]
      }
    }
  },
  props: {
    addOrEditData: {
      type: Object,
      default: function () {
        return {
          title: '',
          isShow: false,
          form1: {}
        }
      }
    }
  },
  methods: {
    closeDialog (res) {
      this.$refs.form1.resetFields()
      this.$emit('close-add-or-edit-dialog', res)
    },
    onSubmit () {
      this.$refs.form1.validate((valid) => {
        if (valid) {
          this.loading = true
          addOrEdit(this.addOrEditData.form1).then(res => {
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
    beforeUpload (file) {
      const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')
      const isLt = file.size / 1024 / 1024 < 3
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 3MB!')
      }
      return isJPG && isLt
    },
    handleHeadSuccess (res, file) {
      this.addOrEditData.form1.logo = res.relative_path
    }
  }
}
</script>

<style scoped>
  .el-form {
    width: 440px;
  }
</style>
