const CONFIG = require('../../config.js')
require('../../module/mall.js')
require('../../module/account.js');
require('../../module/billWay.js');
const amapFile = require('../../utils/amap-wx.js')

//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var modName = 'recommend';
const _mall = com.lightningdog.rrq.mall;

Page({
  global: com.lightningdog.rrq.global,
  _event: com.lightningdog.rrq.event,
  _billWay: com.lightningdog.rrq.billWay,
  _account: com.lightningdog.rrq.account,
  data: {
    navigationBarHeight: app.globalData.navHeight + "px",
    navTitle: "西安市",
    inputShowed: false, // 是否显示搜索框
    inputVal: "", // 搜索框内容
    category_box_width: 750, //分类总宽度
    baseUrl: CONFIG.staticUrl,
    goodsRecommend: [], // 推荐商品

    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    swiperCurrent: 0,
    categories: [
      {
        name: '快车',
        picUrl: '/images/home/nav_ic_car.png'
      },
      {
        name: '仓库',
        picUrl: '/images/home/nav_ic_storehouse.png'
      }, {
        name: '货源发布',
        picUrl: '/images/home/nav_ic_load.png'
      }, {
        name: '充值中心',
        picUrl: '/images/home/nav_ic_purchase.png'
      },
    ],
    banners: [
      {
        picUrl: "/images/banners/banner2.png",
        id: 2
      }
    ],// 轮播图
    coupons: [],
    curPage: 1,
    pageSize: 10,
    total: 0 // 商品总数
  },
  /**
   * @description: 打电话给商家
   * @param {Object} e 事件对象 
   * @return: none
   */
  callToSeller(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index;
    let phone = this.data.goodsRecommend[Number(index)].phone;
    if (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    }
  },
  //事件处理函数
  swiperchange: function (e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  /**
   * @description: 分类方法
   * @param {index} 下标
   * @return: none
   */
  categoryTap(event) {
    let url;
    let index = event.currentTarget.dataset.index;
    switch (index) {
      case 0://快车
        url = "/pages/fast-ride/index";
        break;
      case 1:
        url = "/pages/warehouse/index";
        break;
      case 2:
        url = "/pages/supplyGoods/supplyGoods";
        break;
      case 3:
        url = "/pages/balance/index";
        break;
    }
    if (url) {
      wx.navigateTo({
        url: url
      })
    }
  },
  /**
   * @description: 扫一扫
   * @return: none
   */
  scan() {
    wx.scanCode({
      success: (data) => {
        if (data.result) {
          // wx.showModal({
          //   title: '提示',
          //   content: data.result
          // })
          let obj = JSON.parse(data.result);
          let userInfo = wx.getStorageSync('users');
          if (!userInfo) {
            wx.showToast({
              title: "用户信息不存在！"
            })
            return;
          }
          if (!obj.nameValuePairs) return;

          let condition = {
            token: obj.nameValuePairs.token,
            invitedUser: JSON.stringify({
              id: userInfo.id,
              phone: userInfo.phone
            }),
            userType: obj.nameValuePairs.userType
          };
          this._account.invite(condition);
        }
      }
    })
  },
  /**
   * @description: 去往详情页面
   * @param {Object} e 事件对象 
   * @return: none
   */
  toDetailsTap: function (e) {
    wx.navigateTo({
      url: "/pages/goods-detail/goods-detail?id=" + e.currentTarget.dataset.id + "&type=" + e.currentTarget.dataset.type
    })
  },
  // tapBanner: function (e) {
  //   if (e.currentTarget.dataset.id != 0) {
  //     wx.navigateTo({
  //       url: "/pages/goods-detail/goods-detail?id=" + e.currentTarget.dataset.id
  //     })
  //   }
  // },
  /**
   * @description: 下拉刷新
   * @param {type} 
   * @return: 
   */
  onPullDownRefresh() {
    this.setData({
      curPage: 1
    })
    this.apiFetch()
  },
  /**
   * @description: 获取数据
   * @param {type} 
   * @return: 
   */
  apiFetch() {
    wx.showLoading({
      title: '加载中'
    })
    this.loading = true;
    let condition = {
      pageNum: this.data.curPage,
      pageSize: this.data.pageSize
    }
    _mall.list(condition, modName)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 调试个人中心页
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        showTabbar: true
      })
    }
  },
  onLoad: function (e) {
    wx.showShareMenu({
      withShareTicket: true
    })
    if (!this.global.location) {
      this.getLocation();
    } else {
      app.globalData.defaultCity = this.global.location.city;
      app.globalData.defaultCounty = this.global.location.district;
      this.setData({
        navTitle: this.global.location.city
      })
    }
    /// 获取本机Ip地址
    this._account.getIp();
    this.setData({
      curPage: 1
    })
    this.bindInviteEvent();
    this.bindUserInfoEvent();
    this.apiUserInfoFetch();
    this.bindEvent();
    this.apiFetch();
    this.bindBillAllEvent();
    this.apiBillAllFetch();
    this.bindBillOneEvent();
    this.apiBillOneFetch();
  },
  apiBillAllFetch() {
    this._billWay.billAll();
  },
  apiBillOneFetch() {
    let params = "BG"
    this._billWay.billOne(params);
  },
  bindBillOneEvent() {
    this._event.on('billWayOne', "com.lightningdog.rrq.billWay", "list", (event, data) => {
      console.log(data)
      // app.data.valuation=data;
      // if (data) {
      //   wx.setStorage({
      //     key: 'userConfig',
      //     data: data,
      //   })
      // }
    });
  },
  bindBillAllEvent() {
    this._event.on('billWayAll', "com.lightningdog.rrq.billWay", "list", (event, data) => {
      console.log(data)
      app.data.valuation = data[5];
      // if (data) {
      //   wx.setStorage({
      //     key: 'userConfig',
      //     data: data,
      //   })
      // }
    });
  },
  bindInviteEvent() {
    this._event.on('onInvite', "com.lightningdog.rrq.account", "invite", (event, data) => {
      if (data) {
        wx.showModal({
          title: "提示",
          content: '您已成功被邀请'
        })
      }
    });
  },
  bindUserInfoEvent() {
    this._event.on('onUser', "com.lightningdog.rrq.account", "info", (event, data) => {
      if (data) {
        wx.setStorage({
          key: 'userConfig',
          data: data,
        })
      }
    });
  },
  apiUserInfoFetch() {
    this._account.user();
  },
  /**
   * @description: 定位当前城市
   * @return: none
   */
  getLocation() {
    let that = this;
    var mapFun = new amapFile.AMapWX({ key: app.globalData.ampKey });
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: (result) => {
        getRegeo(`${result.longitude},${result.latitude}`);
      },
      fail: () => {
        wx.showToast({
          title: '定位失败，请检查网络',
          icon: 'none'
        });
      }
    });
    function getRegeo(location) {
      mapFun.getRegeo({
        location: location,
        success: (res) => {
          app.globalData.defaultCity = res[0].regeocodeData.addressComponent.city;
          app.globalData.defaultCounty = res[0].regeocodeData.addressComponent.district;
          that.setData({
            navTitle: res[0].regeocodeData.addressComponent.city
          })
        },
        fail: () => {
        }
      })
    }
  },
  bindEvent: function () {
    this._event.on(modName, "com.lightningdog.rrq.mall", "scrollview", (event, data) => {
      let dataInfo = [];
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
  /**
   * @description: 选择区域
   * @return: none
   */
  selectArea() {
    return;
    console.log('选择区域');
    wx.navigateTo({
      url: '/pages/switchcity/switchcity'
    })
  },
  onShareAppMessage: function () {
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  /**
   * @description: 下拉刷新
   * @return: none
   */
  onReachBottom: function () {
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
  goCart: function (e) {
    wx.navigateTo({
      url: "/pages/cart/cart"
    })
  }
})
