/*
 RSA加解密
 https://www.npmjs.com/package/node-rsa
 */
import NodeRSA from 'node-rsa'
import Config from '@/settings'

/*
 * @param string str
 * @return string
 * */
export function encryptData (str) {
  const nodersa = new NodeRSA(Config.publicKey)
  nodersa.setOptions({ encryptionScheme: 'pkcs1' })
  return nodersa.encrypt(str, 'base64')
}
