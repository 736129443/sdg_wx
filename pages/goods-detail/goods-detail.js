// pages/goods-detail/goods-detail.js
const app = getApp();
require('../../module/mall.js')
require('../../module/shopcart.js');
var syncModName = 'detailSync';
var loadModName = 'detailLoad';

var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
const _mall = com.lightningdog.rrq.mall;

Page({
  _event: com.lightningdog.rrq.event,
  _shopcart: com.lightningdog.rrq.shopcart,
  /**
   * 页面的初始数据
   */
  data: {
    goodsType: '',
    baseUrl: app.staticUrl,
    pic: '/images/fxad.jpeg',
    autoplay: true,
    interval: 3000,
    duration: 1000,
    dots: true,
    show: false,
    goodsDetail: {},
    goodsNumber: 1,
    showsNumber: 0,
    type: 'addCart',
    goodsId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        goodsId: options.id,
        goodsType: options.type
      })

      // 获取购物车列表
      this.bindListEvent();

      // 绑定详情
      this._event.on('onDetail', "com.lightningdog.rrq.mall", "detail", (event, data) => {
        if (data) {
          let info = data;
          let pics = info.goodsThumbnails.split(',');
          info.goodsThumbnails = pics;
          this.setData({
            goodsDetail: info
          });
        }
        wx.hideLoading({})
      });
      this.apiFetchInfo();

      // 同步购物车
      this._event.on(syncModName, "com.lightningdog.rrq.shopcart", "cartSync", (event, data) => {
        wx.hideLoading({
          success: () => {
            wx.showToast({
              title: '已添加购物车！',
            })
          }
        })
        setTimeout(() => {
          // 同步完购物车 获取购物车数量 更新左下角角标
          this.apiFetchLoad();
        }, 1600)
      });
    }
  },
  bindListEvent() {
    this._event.on(loadModName, "com.lightningdog.rrq.shopcart", "cartLoad", (event, data) => {
      if (data) {
        this.dealData(data);
      }
    });
  },
  dealData(info) {
    let arr = [];
    for (let key in info) {
      arr = [...arr, ...info[key]]
    }
    console.log(arr.length);
    this.setData({
      showsNumber: arr.length
    })
  },
  apiFetchLoad() {
    wx.showLoading({
      title: '加载中'
    })
    this._shopcart.load(loadModName);
  },
  cartInfoSync() {
    wx.showLoading({
      title: '加载中'
    });
    let goods = {
      goodsId: this.data.goodsId,
      goodsNum: this.data.goodsNumber
    };
    this._shopcart.sync(syncModName, [goods], '1');
  },
  /**
   * @description: 发送请求 获取详情数据
   * @return: 
   */
  apiFetchInfo() {
    wx.showLoading({
      title: '加载中'
    })
    _mall.detail(this.data.goodsId, this.data.goodsType);
  },
  shopCart() {
    var pages = getCurrentPages();
    let lastPage = pages[pages.length - 2];
    if (lastPage.route.indexOf('cart') > -1) {
      lastPage.apiFetchLoad();
      wx.navigateBack();
      return;
    }
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  },
  onChange(e) {
    this.setData({
      goodsNumber: e.detail
    });
  },
  submits(e) {
    if (e.currentTarget.dataset.type == 'addCart') {
      this.cartInfoSync();
    } else {
      app.data.isClickCart = false;
      let obj = {};
      obj.market = this.data.goodsDetail.market;
      obj.marketId = this.data.goodsDetail.marketId;
      let locations = {
        latitude: this.data.goodsDetail.latitude,
        longitude: this.data.goodsDetail.longitude,
        province: this.data.goodsDetail.province,
        area: this.data.goodsDetail.city,
        county: this.data.goodsDetail.district,
        phone: this.data.goodsDetail.phone,
        contractor: this.data.goodsDetail.contacts,
        address: this.data.goodsDetail.address
      };
      obj.locations = locations;

      let subObj = { ...this.data.goodsDetail };
      subObj.amount = this.data.goodsNumber;
      subObj.goodsPic = subObj.goodsThumbnails;
      obj.goods = [subObj];
      let total = Number(this.data.goodsDetail.price) * Number(this.data.goodsNumber);
      obj.total = total.toFixed(2);
      wx.setStorageSync('shopInfo', [obj]);
      wx.navigateTo({
        url: '/pages/pay-order/pay-order',
      })
    }
    this.setData({
      show: false,
    });
  },
  addGoods() {
    this.setData({ show: true, type: 'addCart', goodsNumber: 1 });
  },
  buyGoods() {
    this.setData({ show: true, type: 'buygoods', goodsNumber: 1 });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  onSelect(event) {
    console.log(event.detail);
  },
  swiperchange: function (e) {
    // console.log(e.detail.current)
    // this.setData({
    //   swiperCurrent: e.detail.current
    // })
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
    if (app.data.needToOrderManger) {
      app.data.needToOrderManger = false;
      wx.navigateTo({
        url: "/pages/order-manager/index"
      });
      return;
    }
    if (app.globalData.needRefresh) {
      app.globalData.needRefresh = false;
      this.apiFetchInfo();
    }
    this.apiFetchLoad();
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