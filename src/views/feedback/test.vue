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
  },
  mounted () {
    this.$store.commit('UPDATE_NAV_TITLE', { path: this.$route.path, title: this.name })
  }
}
</script>

<style>
</style>
