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
      name: ''
    }
  },
  created () {
    this.name = this.$route.query.name || '无'
  }
}
</script>

<style>
</style>
