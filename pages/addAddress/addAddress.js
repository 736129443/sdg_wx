const regeneratorRuntime = require('../../utils/runtime')
//获取应用实例
var app = getApp()
Page({
  data: {
    region: [],
    addressData: {}
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindSave: function (e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;
    var region = this.data.region;
    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (region.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '地区不能为空',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }
    wx.setStorage({
      key: 'addressData',
      data: {
        linkMan: e.detail.value.linkMan,
        address: e.detail.value.address,
        mobile: e.detail.value.mobile,
        code: e.detail.value.code,
        region: region
      },
    })
    wx.navigateBack({})
  },
  onLoad: function (e) {

  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorage({
            key: 'addressData',
            success: function (res) {
              console.log(res)
              that.setData({
                addressData: {},
                region: []
              })
            }
          })
        }
      }
    })
  },
  readFromWx: function () {
    const _this = this
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        _this.setData({
          addressData: res,
          region: [res.provinceName, res.cityName, res.countyName]
        });
      }
    })
  },
  onShow() {
    wx.getStorage({
      key: 'addressData',
      success: (res) => {
        this.setData({
          addressData: {
            userName: res.data.linkMan,
            detailInfo: res.data.address,
            telNumber: res.data.mobile,
            postalCode: res.data.code,
          },
          region: res.data.region
        })
      },
    })
  }
})
