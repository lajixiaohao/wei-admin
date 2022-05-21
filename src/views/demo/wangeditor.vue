<template>
  <div>
    <h4>wangEditor5示例</h4>
    <p>官网：<a href="https://www.wangeditor.com/" target="_blank">https://www.wangeditor.com/</a></p>
    <p>本示例支持图片、视频和附件上传，具体配置请结合相关源码查看。</p>
    <WangEditor :content="content" @editorContent="getEditorContent" />
  </div>
</template>

<script>
import WangEditor from '@/components/WangEditor'

export default {
  name: 'WangEditorDemo',
  data () {
    return {
      editor: null,
      content: ''
    }
  },
  components: {
    WangEditor
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
