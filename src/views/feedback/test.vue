<template>
  <div>
    name={{ name }}
  </div>
</template>

<script>
export default {
  name: 'FeedbackTest',
  data () {
    return {
      name: 0
    }
  },
  created () {
    this.name = this.$route.query.name || '无'
  }
}
</script>

<style>
</style>
