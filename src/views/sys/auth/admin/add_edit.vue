<template>
  <div>
    id={{ id }}
  </div>
</template>

<script>
export default {
  name: 'AddEditAdmin',
  data () {
    return {
      id: 0
    }
  },
  created () {
    this.id = this.$route.query.id || '无'
  }
}
</script>

<style>
</style>
