const app = getApp()
const CONFIG = require('../../config.js')
Page({
  data: {
    balance: 0.00,
    freeze: 0,
    score: 0,
    userInfo: {},
    score_sign_continuous: 0,
    order_list_array: [
      {
        picUrl: '/images/personal/personal_ic_order_ing.png',
        title: '全部'
      },
      {
        picUrl: '/images/personal/personal_ic_evaluated.png',
        title: '待支付'
      },
      {
        picUrl: '/images/personal/personal_ic_cancel.png',
        title: '已取消'
      }
    ]
  },
  onLoad() {
  },
  /**
   * @description: 跳转至优惠券页面
   * @return: none
   */
  gotoCoupon() {
    // wx.showToast({
    //   title: '该功能暂未开发！',
    //   icon: 'none'
    // })
    // return;
    wx.navigateTo({
      url: '/pages/coupons/index'
    })
  },
  onShow() {
    let that = this;
    let userInfo = wx.getStorageSync('users')

    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    if (!userInfo) {
      // app.goLoginPageTimeOut()
    } else {
      let info = userInfo;
      if (!info.nickName) {
        let phoneNum = info.phone;
        info.phone = phoneNum.substring(0, phoneNum.length - 4) + '****';
      }
      that.setData({
        userInfo: info,
        version: CONFIG.version,
        vipLevel: app.globalData.vipLevel
      })
    }
  },
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '本系统基于开源小程序商城系统 https://github.com/EastWorld/wechat-app-mall 搭建，祝大家使用愉快！',
      showCancel: false
    })
  },
  /**
     * @description: 跳转至订单管理页面
     * @return: none
     */
  gotoOrder() {
    wx.navigateTo({
      url: "/pages/order-manager/index"
    })
  },
  toWallet() {
    wx.navigateTo({
      url: "/pages/wallet/index"
    })
  },
  /**
   * @description: 跳转至相应tabs
   * @param {e} 事件对象
   * @return: none
   */
  tapItem(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: "/pages/order-manager/index?type=" + index
    })
  }
})