<template>
  <div>
    <p>若没有自动打开，请点击：<a href="https://github.com/lajixiaohao/" target="_blank" id="github">项目地址</a></p>
  </div>
</template>

<script>
export default {
  name: 'ProjectLink',
  mounted () {
    setTimeout(() => {
      document.getElementById('github').click()
    }, 100)
  }
}
</script>

<style scoped>
  p {
    font-size: 14px;
  }
  p a {
    color: #3399ff;
  }
</style>
