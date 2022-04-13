<template>
  <div style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 500px; overflow-y: hidden;"
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
import '@wangeditor/editor/dist/css/style.css'
import { UPLOAD_IMAGE_URL, UPLOAD_VIDEO_URL } from '@/common/const'
import { getToken } from '@/common/utils/auth'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  name: 'WangEditor',
  data () {
    return {
      editor: null,
      html: '',
      toolbarConfig: {},
      editorConfig: {
        placeholder: '请输入内容...',
        autoFocus: false,
        MENU_CONF: this.menuConf()
      },
      mode: 'default'
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
    },
    menuConf () {
      const _this = this
      return {
        uploadImage: {
          server: UPLOAD_IMAGE_URL,
          fieldName: 'file',
          maxFileSize: 5 * 1024 * 1024,
          headers: {
            token: getToken()
          },
          customInsert (res, insertFn) {
            if (res.code === 0) {
              insertFn(res.data.url, '', '')
            } else {
              _this.$message.error(res.msg)
            }
          },
          onError (file, err, res) {
            _this.$message.error(err)
          }
        },
        uploadVideo: {
          server: UPLOAD_VIDEO_URL,
          fieldName: 'file',
          maxFileSize: 50 * 1024 * 1024,
          headers: {
            token: getToken()
          },
          customInsert (res, insertFn) {
            if (res.code === 0) {
              insertFn(res.data.url, '', '')
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
  },
  mounted () {
    setTimeout(() => {
      this.html = this.content
    }, 100)
  },
  beforeDestroy () {
    const editor = this.editor
    if (editor == null) return
    editor.destroy()
  }
}
</script>
