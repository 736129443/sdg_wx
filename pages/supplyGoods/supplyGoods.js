// pages/supplyGoods/supplyGoods.js
require('../../module/mall.js')

// 获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var listModName = 'supplyGoods';
const _mall = com.lightningdog.rrq.mall;
Page({
  _event: com.lightningdog.rrq.event,
  /**
   * 页面的初始数据
   */
  data: {
    isBig: true,
    goods: [],
    pageSize: 10,
    imgUrl: app.staticUrl,
    curPage: 1,
    total: 0,
    maxWidth: 'small'
  },
  addGoods() {
    wx.navigateTo({
      url: '../add-goods/add-goods'
    })
  },
  onClickLeft() {
    wx.showToast({ title: '点击返回', icon: 'none' });
  },
  onClickRight() {
    wx.showToast({ title: '点击按钮', icon: 'none' });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.needRefresh) {
      this.setData({
        curPage: 1
      });
      app.globalData.needRefresh = false;
      this.apiFetch();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      maxWidth: 'small'
    })
    this.bindEvent();
    this.apiFetch();
  },
  /**
   * @description: 获取数据
   * @param {type} 
   * @return: 
   */
  apiFetch() {
    wx.showLoading({ title: '加载中' });
    this.loading = true;
    let condition = {
      pageNum: this.data.curPage,
      pageSize: this.data.pageSize,
    };
    _mall.list(condition, listModName, true)
  },
  bindEvent: function () {
    this._event.on(listModName, "com.lightningdog.rrq.mall", "scrollview", (event, data) => {
      let dataInfo = [];
      if (this.data.curPage > 1) {//上拉
        dataInfo = [...this.data.goods, ...data.rows];
      } else {
        dataInfo = [...data.rows];
      }
      this.setData({
        goods: dataInfo,
        total: data.total
      })
      console.log('列表条目数：' + this.data.goods.length)
      this.loading = false;
      wx.hideLoading({})
      wx.stopPullDownRefresh();
    });
    // var rrq = com.lightningdog.rrq;
  },
  /**
   * @description: 下拉加载更多
   * @return: none
   */
  myReachBottom() {
    if (!this.loading && this.data.goods.length < Number(this.data.total)) {
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
      this.setData({
        curPage: 1
      });
      app.globalData.needRefresh = false;
      this.apiFetch();
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

  },



  submits() {
    wx.navigateTo({
      url: '../add-goods/add-goods'
    })
  }
})