//获取应用实例
const CONFIG = require('../../config.js')
require('../../module/mall.js')
require('../../module/wallet.js')
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var modName = 'walletRecommend';
const walletModName = 'walletMod';

// pages/wallet/index.js
Page({
  /**
   * 页面的初始数据
   */
  _event: com.lightningdog.rrq.event,
  _mall: com.lightningdog.rrq.mall,
  _wallet: com.lightningdog.rrq.wallet,
  data: {
    balance: 0,
    goodsRecommend: [],
    baseUrl: CONFIG.staticUrl,
    curPage: 1,
    pageSize: 5,
    total: 0 // 商品总数
  },
  back() {
    wx.navigateBack({})
  },
  toBalance() {
    console.log('toBalance')
    wx.navigateTo({
      url: '/pages/balance/index'
    })
  },
  toRecord() {
    wx.navigateTo({
      url: '/pages/pay-record/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      curPage: 1
    })
    // 获取精品推荐
    this.bindEvent();
    this.apiFetch();

    // 获取钱包余额
    this.bindWalletNumEvent();
    this.apiWalletFetch();
  },
  bindWalletNumEvent() {
    this._event.on(walletModName, "com.lightningdog.rrq.wallet", "wallet", (event, data) => {
      if (data && data.length) {
        let money = 0;
        data.forEach(item => {
          if (item.from == 'user') {//返回用户金额
            money = item.money;
          }
        })
        this.setData({
          balance: money
        })
      }
    });
  },
  apiWalletFetch() {
    wx.showLoading({
      title: "加载中..."
    })
    this._wallet.info(walletModName);
  },
  bindEvent: function () {
    this.loading = true;
    this._event.on(modName, "com.lightningdog.rrq.mall", "scrollview", (event, data) => {
      let dataInfo = [];
      console.log(event, data)
      if (this.data.curPage > 1) {//上拉
        dataInfo = [...this.data.goodsRecommend, ...data.rows];
      } else {
        dataInfo = [...data.rows];
      }
      this.setData({
        goodsRecommend: dataInfo,
        total: data.total
      })
      console.log('列表条目数：' + this.data.goodsRecommend.length)
      this.loading = false;
      wx.hideLoading({})
      wx.stopPullDownRefresh();
    });
    // var rrq = com.lightningdog.rrq;
  },
  apiFetch() {
    wx.showLoading({
      title: '加载中'
    })
    let condition = {
      pageNum: this.data.curPage,
      pageSize: this.data.pageSize
    }
    this._mall.list(condition, modName)
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
    if (app.globalData.needRefresh) {
      this.apiWalletFetch();
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
    this.setData({
      curPage: 1
    })
    this.apiFetch();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log(1)
    if (!this.loading && this.data.goodsRecommend.length < Number(this.data.total)) {
      this.setData({
        curPage: this.data.curPage + 1
      });
      this.apiFetch();
    } else {
      wx.showToast({
        icon: 'none',
        title: '亲，没有更多商品了！'
      })
    }
  },
  itemClick(e) {
    console.log(e);
    wx.navigateTo({
      url: '/pages/goods-detail/goods-detail?id=' + e.detail.id + '&type=' + e.detail.type
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})