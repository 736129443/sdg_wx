const fun_aes = require('aeswh.js'); //引用AES源码js

var uuid = UUID();

function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
/**
  * 加密（需要先加载lib/aes/aes.min.js文件）
  * @param word
  * @returns {*}
*/
function AesEncrypt(word, key) {
  key = fun_aes.CryptoJS.enc.Utf8.parse(key);
  var srcs = fun_aes.CryptoJS.enc.Utf8.parse(word);
  var encrypted = fun_aes.CryptoJS.AES.encrypt(srcs, key, { mode: fun_aes.CryptoJS.mode.ECB, padding: fun_aes.CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}
/**
  * 解密
  * @param word
  * @returns {*}
  */
function AesDecrypt(word, key) {
  key = fun_aes.CryptoJS.enc.Utf8.parse(key);
  var decrypt = fun_aes.CryptoJS.AES.decrypt(word, key, { mode: fun_aes.CryptoJS.mode.ECB, padding: fun_aes.CryptoJS.pad.Pkcs7 });
  return fun_aes.CryptoJS.enc.Utf8.stringify(decrypt).toString();
}


//暴露接口
module.exports = {
  AesEncrypt,
  AesDecrypt,
  uuid
}