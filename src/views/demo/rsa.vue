<template>
  <div>
    <p style="color: #666;font-size: 14px;">备注：private_key_bits=>1024,digest_alg=>sha512</p>
    <p>
      <el-button type="primary" size="mini" @click="getKey" :loading="laoding">生成密钥</el-button>
    </p>
    <p>公钥</p>
    <p class="code">{{ publickey }}</p>
    <p>私钥</p>
    <p class="code">{{ privatekey }}</p>
  </div>
</template>

<script>
import { getRsaKey } from '@/common/api/demo/rsa'

export default {
  name: 'RsaDemo',
  data () {
    return {
      publickey: '',
      privatekey: '',
      laoding: false
    }
  },
  methods: {
    getKey () {
      this.laoding = true
      getRsaKey().then(res => {
        this.laoding = false
        this.publickey = res.data.publickey
        this.privatekey = res.data.privatekey
      }).catch(() => {
        this.laoding = false
      })
    }
  }
}
</script>

<style scoped>
  .code {
    padding: 10px;
    border: 1px #e2e2e2 solid;
    font-size: 14px;
    color: #757575;
    white-space: pre-wrap;
  }
</style>
