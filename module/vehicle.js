require("config.js")
var app = getApp();
var com = app.com || {};
var amapFile = require('../utils/amap-wx.js');//如：..­/..­/libs/amap-wx.js
var myAmap = new amapFile.AMapWX({ key: app.globalData.ampKey });
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var _global = com.lightningdog.rrq.global;

var vehicle = {
  _request: com.lightningdog.rrq.request,
  _event: com.lightningdog.rrq.event,
  init: function () {
    return this;
  },
  vehicleAll: function () {
    wx.showLoading({
      title: '加载中'
    })
    this._request.post("integratedconfig", "vehicleList", {
      token: _global.token
    }).done((errorcode, result) => {
      wx.hideLoading({})
      if (errorcode == 0) {
        this._event.trigger("vehicleAll", "com.lightningdog.rrq.vehicle", result);
        return;
      }
      wx.showToast({
        title: result
      })
    })
  }
};

(function (NS, vehicle) {
  NS.vehicle = vehicle;
  module.exports = NS.config;
  // var looper = function () {
  //   console.log("looper ....")
  //   var _global = NS.global;
  //   var _account = NS.account;
  //   if (_global.token) {
  //     // _account.heartbeat();
  //   }
  //   setTimeout(looper, 60000)
  // }

  // setTimeout(looper, 60000)
})(com.lightningdog.rrq, vehicle)