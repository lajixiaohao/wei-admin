<template>
  <div>
    <h4>WangEditor示例</h4>
    <p>文档：<a href="https://www.wangeditor.com/doc/" target="_blank">www.wangeditor.com/doc</a></p>
    <Editor :content="content" @editorContent="getEditorContent"></Editor>
  </div>
</template>

<script>
import Editor from '@/components/editor'

export default {
  name: 'WangEditor',
  data () {
    return {
      editor: null,
      content: '<p>初始化编辑器</p>'
    }
  },
  components: {
    Editor
  },
  methods: {
    getEditorContent (val) {
      this.content = val
    }
  }
}
</script>

<style scoped>
  p {
    font-size: 14px;
  }

  p a {
    color: #3399ff;
    text-decoration: none;
  }

  p a:hover {
    text-decoration: underline;
  }
</style>
