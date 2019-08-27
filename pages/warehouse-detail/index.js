// pages/warehouse-detail/index.js
const app = getApp();
require('../../module/depot.js')
require('../../module/location.js')



var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
Page({
  _location: com.lightningdog.rrq.location,
  _event: com.lightningdog.rrq.event,
  _depot: com.lightningdog.rrq.depot,
  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: app.staticUrl,
    depotId: '',//仓库id
    banners: ['/images/banners/banner2.png'],
    pageAll: 1,
    page: 0,
    depotDetail: {},
    isCommon: false
  },
  call() {
    if (this.data.depotDetail.contractorPhone) {
      wx.makePhoneCall({
        phoneNumber: this.data.depotDetail.contractorPhone // 仅为示例，并非真实的电话号码
      })
    }
  },
  setIsCommon() {
    let type = 'star';
    if (this.data.isCommon) {
      type = 'unStar';
    }
    this._depot.star(type, this.data.depotId);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id.length) {
      this.setData({
        depotId: options.id
      });
      this.bindDetailEvent();
      this.bindStarOrUnStarEvent();
      this.detailApiFetch();
    }
  },
  bindStarOrUnStarEvent() {
    this._event.on('onAddressStar', "com.lightningdog.rrq.depot", "star", (event, data) => {
      this.setData({
        isCommon: !this.data.isCommon
      })
      let tips = '已取消';
      if (this.data.isCommon) {
        tips = "已收藏至常用地址";
      }
      wx.showToast({
        title: tips,
        icon: "none"
      })
    });
  },
  swiperchange(e) {
    this.setData({
      page: e.detail.current
    })
  },
  /**
   * @description: 绑定详情事件
   * @return: none
   */
  bindDetailEvent() {
    this._event.on('onDetail', "com.lightningdog.rrq.depot", "detail", (event, data) => {
      if (data.length) {
        let info = data[0];
        // let pics = info.goodsThumbnails.split(',');
        // info.goodsThumbnails = pics;
        this.setData({
          depotDetail: info,
          isCommon: (info.starStatus && info.starStatus == 1) ? true : false
        });
        if (info.details.depotThumbnails) {
          let arr = JSON.parse(info.details.depotThumbnails);
          this.setData({ banners: arr, pageAll: arr.length });
        }
      }
      wx.hideLoading({})
    });
  },
  /**
   * @description: 详情接口请求
   * @return: none
   */
  detailApiFetch() {
    this._depot.detail({
      pageNum: 1,
      pageSize: 2,
      depotId: this.data.depotId
    })
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