<template>
  <div ref="editorForm"></div>
</template>

<script>
import E from 'wangeditor'
import {
  getToken
} from '@/common/utils/auth'
import {
  UPLOAD_IMAGE_URL,
  UPLOAD_VIDEO_URL
} from '@/common/const'

export default {
  name: 'Editor',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editorContent: '',
      editor: null
    }
  },
  watch: {
    content (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.content)
      }
    }
  },
  mounted () {
    const editor = new E(this.$refs.editorForm)
    editor.config.focus = false
    editor.config.onchange = (html) => {
      this.editorContent = html
      this.$emit('editorContent', html)
    }
    editor.config.zIndex = 0
    // 自定义头部
    editor.config.uploadImgHeaders = {
      Token: getToken()
    }
    // 配置上传图片
    editor.config.uploadImgServer = UPLOAD_IMAGE_URL
    // 自定义错误提示
    editor.config.customAlert = (info) => {
      this.$message.error(info)
    }
    // 图片大小5M
    editor.config.uploadImgMaxSize = 5 * 1024 * 1024
    // 限制类型
    editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif']
    // 限制一次最多能传几张图片
    editor.config.uploadImgMaxLength = 1
    // 自定义filename
    editor.config.uploadFileName = 'weifile'
    // 自定义 timeout 时间
    editor.config.uploadImgTimeout = 30 * 1000

    // 配置上传视频
    editor.config.uploadVideoServer = UPLOAD_VIDEO_URL
    // 限制视频上传大小50M
    editor.config.uploadVideoMaxSize = 50 * 1024 * 1024
    // 限制上传类型
    editor.config.uploadVideoAccept = ['mp4']
    editor.config.uploadVideoName = 'weivideo'
    // 自定义上传视频参数
    editor.config.uploadVideoHeaders = {
      Token: getToken()
    }
    // 上传超时，3分钟
    editor.config.uploadVideoTimeout = 1000 * 60 * 3

    editor.create()
    this.editor = editor
    this.editor.txt.html(this.content)
  },
  beforeDestroy () {
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style>
</style>
