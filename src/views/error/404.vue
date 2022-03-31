<template>
  <div>
    <p style="margin-left: 10px; font-size: 15px;">页面没有找到或无权访问，3s后自动返回首页！</p>
  </div>
</template>

<script>
export default {
  name: 'PageNotFount',
  created () {
    setTimeout(() => {
      this.$router.push('/dashboard')
    }, 3000)
  }
}
</script>

<style></style>
