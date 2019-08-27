import { JSEncrypt } from 'JSEncrypt_min.js'
// var RSA = require('wx_rsa.js')


/**rsa加密
**@param text 需要加密的文本
**@param publicKey 加密需要的公钥  pkcs1 类型的公钥
**/
function encryptByRsa(text, publicKey) {
    console.log('加密的数据是:' + text + '\n公钥是：' + publicKey);
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    var encrypted = encrypt.encryptLong(text);
    return encrypted
}
// function encryptByRsa(text, publicKey) {
//     var encrypt_rsa = new RSA.RSAKey();
//     encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);
//     encStr = encrypt_rsa.encrypt(text)
//     encStr = RSA.hex2b64(encStr);
//     return encStr;
// }
module.exports = {
    encryptByRsa: encryptByRsa
}