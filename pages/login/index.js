// pages/login/login.js
require('../../module/account.js');
const common = require('../../utils/commonReg.js');
const AESUtil = require('../../utils/aes_util.js');
//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
let _global = com.lightningdog.rrq.global;

let times;
Page({
  _event: com.lightningdog.rrq.event,
  _account: com.lightningdog.rrq.account,
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    codeText: '获取验证码',
    ishowCode: false,
    codeTime: 60,
    verifyRes: "" //验证码反馈的10位密钥
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.bindVerifyCodeEvent();
    this.bindLoginEvent();
  },
  /**
   * @description: 绑定登录事件
   * @return: none
   */
  bindLoginEvent() {
    this._event.on('onLogin', "com.lightningdog.rrq.account", "login", (event, data) => {
      if (data) {
        wx.setStorageSync('users', data)
        wx.reLaunch({
          url: '../home/index'
        })
      }
      wx.hideLoading({})
    });
  },
  /**
   * @description: 登录请求
   * @return: none
   */
  loginApiFetch() {
    wx.showLoading({
      title: '登录中'
    })
    let uuid = AESUtil.uuid;
    console.log(uuid);
    if (this.data.verifyRes.length) {
      let codeStr = this.data.code + this.data.verifyRes;
      let params = {
        deviceInfo: {
          randomKey: uuid,
        },
        phone: this.data.phone,
        verifyCode: codeStr
      }
      let paramsJson = JSON.stringify(params);
      let ciphertext = AESUtil.AesEncrypt(paramsJson, codeStr);
      console.log('加密前数据为：' + paramsJson);
      console.log('加密后的密文是：' + ciphertext);
      this._account.login(this.data.phone, ciphertext);
    }
  },
  /**
   * @description: 绑定验证码获取事件
   * @return: none
   */
  bindVerifyCodeEvent() {
    this._event.on('onVerify', "com.lightningdog.rrq.account", "verify", (event, data) => {
      if (data) {
        this.setData({
          verifyRes: data
        })
      }
      wx.hideLoading({})
    });
  },
  /**
   * @description: 验证码获取请求
   * @return: none
   */
  verifyCodeApiFetch() {
    this._account.verifyCode(this.data.phone);
  },
  del() {
    this.setData({
      phone: ''
    })
  },
  setPone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode() {
    let that = this;
    if (that.data.phone == '') {
      that.showToast('手机号不能为空', 'none')
      return;
    }

    if (!common.regPhone(that.data.phone)) {
      that.showToast('手机号格式有误', 'none')
      return;
    }
    this.verifyCodeApiFetch();
    that.timeFun();
  },
  timeFun() {
    let that = this;
    that.setData({
      ishowCode: true,
    })
    times = setInterval(function () {
      if (that.data.codeTime == 0) {
        that.clearTimeAndInit();
        return;
      }
      that.data.codeTime--
      that.setData({
        codeTime: that.data.codeTime
      })
    }, 1000)
  },
  clearTimeAndInit() {
    clearInterval(times);
    this.setData({
      ishowCode: false,
      codeTime: 60
    })
  },
  showToast(msg, type) {
    wx.showToast({
      title: msg,
      icon: type,
      duration: 1000
    })
  },
  loginQuest() {
    let that = this;
    if (that.data.phone == '') {
      that.showToast('手机号不能为空', 'none')
      return;
    }
    if (that.data.code == '') {
      that.showToast('验证码不能为空', 'none')
      return;
    }
    if (!common.regPhone(that.data.phone)) {
      that.showToast('手机号格式有误', 'none')
      return;
    }
    if (!common.regCode(that.data.code)) {
      that.showToast('验证码格式有误', 'none')
      return;
    }
    this.loginApiFetch();
  },
  toAgreement() {
    wx.navigateTo({
      url: '../agreement/agreement'
    })
  },
  toLosePassword() {
    wx.navigateTo({
      url: '../losePassword/losePassword'
    })
  },
  onGotUserInfo(e) {
    console.log(e)
    const userInfo = e.detail.userInfo
    app.data.userInfo = userInfo;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideNavigationBarLoading();
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // wx.removeStorageSync('users');
    try {
      let users = wx.getStorageSync("users");
      if (users) {
        let obj = users;
        console.log(obj);
        _global.token = obj.token;
        _global.userId = obj.id;
        wx.reLaunch({
          url: '../home/index'
        })
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})