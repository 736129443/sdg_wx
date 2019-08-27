// pages/pay-order/pay-order.js
require('../../module/mall.js')
require('../../module/order.js')
var amapFile = require('../../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js



const app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
const _mall = com.lightningdog.rrq.mall;
var myAmap = new amapFile.AMapWX({ key: app.globalData.ampKey });

Page({
  _event: com.lightningdog.rrq.event,
  _order: com.lightningdog.rrq.order,
  data: {
    imgUrl: app.staticUrl,
    shopList: [],
    vanCard: 'vanCard',
    total: 0,
    remark: '',
    addressData: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.bindCreateOrderEvent();
  },
  bindCreateOrderEvent() {
    this._event.on('onCreate', "com.lightningdog.rrq.order", "createOrder", (event, data) => {
      if (data) {
        console.log('订单创建成功数据' + data);
        wx.showModal({
          title: '提示',
          content: "订单创建成功！",
          showCancel: true,
          cancelText: '前往查看',
          confirmText: '立即支付',
          confirmColor: '#ff0000',
          success: (res) => {
            if (res.confirm) {
              // 立即支付
              wx.redirectTo({
                url: '/pages/payment/index'
              })
              return;
            }
            if (res.cancel) {
              app.data.needToOrderManger = true;
              // 查看订单
              console.log('跳转直查看订单页面');
              wx.navigateBack();
            }
          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  calculate() {
    let total = 0;
    let list = this.data.shopList;
    for (let i = 0; i < list.length; i++) {
      let curItem = list[i];
      total += Number(curItem.total);
    }
    console.log(total);
    return total.toFixed(2);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  selectAddress() {
    wx.navigateTo({
      // url: "/pages/addAddress/addAddress"
      url: "/pages/common-address/index"
    })
  },
  submit(e) {
    if (app.data.isClickCart) {
    } else {
    }
    this.createOrder();
  },
  createOrder() {
    if (!this.data.addressData) {
      wx.showToast({
        title: "请选择地址!",
        icon: 'none'
      })
      return;
    }

    // wx.showLoading({
    //   title: "正在创建订单..."
    // })
    let endLoc = {
      address: this.data.addressData.address,
      province: this.data.addressData.province,
      area: this.data.addressData.area,
      county: this.data.addressData.county,
      contractor: this.data.addressData.contractor,
      phone: this.data.addressData.phone,
      latitude: this.data.addressData.latitude,
      longitude: this.data.addressData.longitude
    };
    function creatPromise(start, end) {
      return new Promise((resolve, reject) => {
        myAmap.getDrivingRoute({
          origin: `${start.longitude},${start.latitude}`,
          destination: `${end.longitude},${end.latitude}`,
          success: function (res) {
            resolve(res);
          },
          fail: function (err) {
            reject(err);
          }
        });
      });
    }
    let configInfo = wx.getStorageSync('userConfig');
    if (configInfo) {
      let proArr = [];
      let paramsArr = [];
      this.data.shopList.forEach(item => {
        let params = {};
        let roadLine = {
          locations: [item.locations, endLoc]
        }
        roadLine.direction = endLoc.province + endLoc.area + endLoc.county + endLoc.address;
        let info = JSON.parse(configInfo);
        let businessConfig = info.businessConfig;
        businessConfig.scene = 'pool';
        businessConfig.bill.way = 'BG';
        params.businessConfig = businessConfig;
        params.vehicleReqs = [];
        params.roadLine = roadLine;
        params.goodsList = item.goods;
        proArr.push(creatPromise(item.locations, endLoc));
        paramsArr.push(params);
      })
      Promise.all(proArr).then((res) => {
        console.log(res);
        res.forEach((item, index) => {
          if (item.paths.length) {
            paramsArr[index].roadLine.distance = (Number(item.paths[0].distance) / 1000).toFixed(2);
          }
        })
        console.log(paramsArr);
        this._order.create(paramsArr);
      }).catch((err) => {
        console.log(err);
      });
    }
  },
  onShow: function () {
    let arr = wx.getStorageSync('shopInfo');
    if (arr) {
      console.log(arr);
      this.setData({
        shopList: arr
      })
      this.setData({
        total: this.calculate()
      })
    }
    wx.getStorage({
      key: 'addressData',
      success: (res) => {
        console.log(res);
        this.setData({
          addressData: res.data
        })
      },
      fail: (res) => {
        this.setData({
          addressData: null
        })
      }
    })
  },
  addAddress: function () {
    wx.navigateTo({
      url: "/pages/addAddress/addAddress"
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {


  },
  setRemark(e) {
    this.setData({
      remark: e.detail
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!app.data.isClickCart) {
    }
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