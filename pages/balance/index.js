// pages/balance/index.js
require('../../module/wallet.js');
require('../../module/coupon.js');

//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var modName = 'onRecharge';
Page({
  _event: com.lightningdog.rrq.event,
  _wallet: com.lightningdog.rrq.wallet,
  _coupon: com.lightningdog.rrq.coupon,
  /**
   * 页面的初始数据
   */
  data: {
    denominationList: [],
    active: 0,
    money: 0
  },
  bindRechargeEvent() {
    this._event.on(modName, "com.lightningdog.rrq.wallet", "recharge", (event, data) => {
      if (data) {
        wx.showToast({
          title: '充值成功'
        })
        app.globalData.needRefresh = true;
        wx.navigateBack({});
      }
    });
  },
  selectItem(e) {
    let info = e.currentTarget.dataset.info;
    this.setData({
      money: info.kindValue,
      active: e.currentTarget.dataset.index
    })
  },
  apiRechargeFetch() {
    this._wallet.recharge(this.data.money, modName);
  },
  recharge(e) {
    if (this.data.money == 0) {
      wx.showToast({
        title: "请选择充值卡！",
        icon: "none"
      })
      return;
    }
    this.apiRechargeFetch();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindRechargeEvent();
    this.bindRechargeCardList();
    this._coupon.rechargeCardList();
  },
  bindRechargeCardList() {
    this._event.on('onCardMore', "com.lightningdog.rrq.coupon", "list", (event, data) => {
      if (data) {
        this.setData({
          denominationList: data
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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