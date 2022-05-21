<template>
  <div style="border: 1px solid #ccc; line-height: 1;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 300px; overflow-y: hidden;"
      v-model="html"
      :defaultConfig="editorConfig"
      @onChange="onChange"
      @customAlert="customAlert"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import { UPLOAD_IMAGE_URL, UPLOAD_VIDEO_URL, UPLOAD_ATTACHMENT_URL } from '@/common/const'
import { getToken } from '@/common/utils/auth'
import { Boot } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import attachmentModule from '@wangeditor/plugin-upload-attachment'

Boot.registerModule(attachmentModule)

export default {
  name: 'WangEditor',
  data () {
    const _this = this
    return {
      editor: null,
      mode: 'default',
      html: '',
      toolbarConfig: {
        insertKeys: {
          index: 0,
          keys: ['uploadAttachment']
        }
      },
      editorConfig: {
        placeholder: '请输入内容...',
        autoFocus: false,
        hoverbarKeys: {
          attachment: {
            menuKeys: ['downloadAttachment']
          }
        },
        MENU_CONF: {
          // 图片上传配置
          uploadImage: {
            server: UPLOAD_IMAGE_URL,
            fieldName: 'file',
            maxFileSize: 5 * 1024 * 1024,
            headers: { token: getToken() },
            customInsert (res, insertFn) {
              if (res.code === 0) {
                insertFn(process.env.VUE_APP_RESOURCE_URL + res.data.path)
              } else {
                _this.$message.error(res.msg)
              }
            },
            onError (file, err, res) {
              _this.$message.error(err)
            }
          },
          // 视频上传配置
          uploadVideo: {
            server: UPLOAD_VIDEO_URL,
            fieldName: 'file',
            maxFileSize: 50 * 1024 * 1024,
            headers: { token: getToken() },
            customInsert (res, insertFn) {
              if (res.code === 0) {
                insertFn(process.env.VUE_APP_RESOURCE_URL + res.data.path)
              } else {
                _this.$message.error(res.msg)
              }
            },
            onError (file, err, res) {
              _this.$message.error(err)
            }
          },
          // 附件上传配置
          uploadAttachment: {
            server: UPLOAD_ATTACHMENT_URL,
            fieldName: 'file',
            maxFileSize: 5 * 1024 * 1024,
            headers: { token: getToken() },
            customInsert (res, file, insertFn) {
              if (res.code === 0) {
                insertFn(file.name, process.env.VUE_APP_RESOURCE_URL + res.data.path)
              } else {
                _this.$message.error(res.msg)
              }
            },
            onError (file, err, res) {
              _this.$message.error(err)
            }
          }
        }
      }
    }
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  components: {
    Editor,
    Toolbar
  },
  methods: {
    onCreated (editor) {
      this.editor = Object.seal(editor)
    },
    onChange (editor) {
      this.$emit('editorContent', editor.getHtml())
    },
    customAlert (info, type) {
      this.$message.error(info)
    }
  },
  watch: {
    content (v) {
      if (v) {
        this.html = v
      }
    }
  },
  mounted () {
    setTimeout(() => {
      this.html = this.content
    }, 300)
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    editor.destroy()
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
