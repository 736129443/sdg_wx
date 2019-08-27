require("config.js")

var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var coupon = {
  _request: com.lightningdog.rrq.request,
  _global: com.lightningdog.rrq.global,
  _event: com.lightningdog.rrq.event,
  init: function () {
    return this;
  },
  list: function (_type, condition) {
    let params = {
      condition,
      coupon: {
        status: _type
      }
    };
    params.condition.userId = this._global.userId;
    this._request.post("coupon", "list", params).done((errorcode, result) => {
      wx.hideLoading({});
      if (errorcode == 0) {
        console.log("coupon list OK");
        this._event.trigger("onMore", "com.lightningdog.rrq.coupon", result);
        return;
      }
      wx.showToast({
        title: '亲， 优惠券同步失败， 请稍后',
        icon: "none"
      })
    })
  },
  rechargeCardList: function () {
    let params = {
      card: {
        status: "ISSUED"
      }
    };
    this._request.post("coupon", "rechargeCard", params).done((errorcode, result) => {
      wx.hideLoading({});
      if (errorcode == 0) {
        this._event.trigger("onCardMore", "com.lightningdog.rrq.coupon", result);
        return;
      }
      wx.showToast({
        title: '亲，网络开小差，稍后重试',
        icon: "none"
      })
    })
  }
};

(function (NS, coupon) {
  NS.coupon = coupon;
})(com.lightningdog.rrq, coupon)
