require("config.js")

var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
const _services = com.lightningdog.rrq.services.collections;

var shopcart = {
  _global: com.lightningdog.rrq.global,
  _request: com.lightningdog.rrq.request,
  _event: com.lightningdog.rrq.event,
  _money: null,
  port: _services.shoppingcart.name,
  init: function () {
    return this;
  },
  sync: function (modName = 'cartPageSync', goodsList, flag) {
    var params = {
      token: this._global.token,
      goods: goodsList,
      flag: flag
    }
    this._request.post("shoppingcart", "sync", params).done((errorcode, result) => {
      if (errorcode != 0) {
        wx.showToast({
          title: '亲，网络不佳，请重试...',
          icon: "none",
          duration: 2000
        });
        return;
      }
      this._event.trigger(modName, "com.lightningdog.rrq.shopcart", result);
    });
  },
  load: function (modName = 'onLoad') {
    let params = {
      token: this._global.token,
      userId: this._global.userId
    }
    this._request.post("shoppingcart", "load", params).done((errorcode, result) => {
      wx.hideLoading();
      if (errorcode == 0) {
        if (result) {
          this._event.trigger(modName, "com.lightningdog.rrq.shopcart", result)
        }
      } else {
        wx.showToast({
          title: '亲，网络不佳，请重试...',
          icon: "none",
          duration: 2000
        })
      }
    });
  }
};

(function (NS, shopcart) {
  NS.shopcart = shopcart;
})(com.lightningdog.rrq, shopcart)
