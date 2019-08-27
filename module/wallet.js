require("config.js")
var jsencrypt = require('../utils/rsa_toos.js');

var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

function requestPayment(modName, event, condition) {
  // 发起支付
  wx.requestPayment({
    timeStamp: condition.timeStamp,
    nonceStr: condition.nonceStr,
    package: condition.package,
    signType: condition.signType,
    paySign: condition.paySign,
    fail: function (aaa) {
      wx.showToast({
        title: '支付失败!',
        icon: 'none'
      })
    },
    success: (res) => {
      this._event.trigger(modName, event, res);
    }
  })
}
var wallet = {
  _page: null,
  _global: com.lightningdog.rrq.global,
  _request: com.lightningdog.rrq.request,
  _event: com.lightningdog.rrq.event,
  _wallet: null,
  init: function (page) {
    _page = page;
    return this;
  },
  info: function (modName = 'walletMod') {
    var param = {
      token: this._global.token
    }
    this._request.post("wallet", "info", param).done((errorcode, result) => {
      wx.hideLoading();
      if (errorcode == 0) {
        this._wallet = result;
        this._event.trigger(modName, "com.lightningdog.rrq.wallet", result)
        return;
      }
      wx.showToast({
        title: '亲， 网络繁忙，等一会儿访问!!!',
        icon: "none",
        duration: 2000
      })
    });
  },
  listDetail: function (orginId) {
    var params = {
      token: this._global.token
    }
    if (orginId) {
      params.organizationId = orginId;
    }
    this._request.post("wallet", "listDetail", params).done((errorcode, result) => {
      wx.hideLoading();
      if (errorcode == 0) {
        this._event.trigger('onListDetail', "com.lightningdog.rrq.wallet", result)
        return;
      }
      wx.showToast({
        title: '亲， 网络繁忙，等一会儿访问!!!',
        icon: "none",
        duration: 2000
      })
    });
  },
  pay: function (_orderId) {
    var param = {
      token: _global.token,
      orderId: _orderId,
      channel: 'wechat'
    }
    this._request.post("wallet", "pay", param).done((errorcode, result) => {
      if (errorcode == 0) {
        wx.requestPayment({
          timeStamp: result.timeStamp,
          nonceStr: result.nonceStr,
          package: result.package,
          signType: result.signType,
          paySign: result.paySign,
          success: function (res) {
            if (res) {
              console.log("支付成功");
              if (res.errMsg == "requestPayment:ok") {
                this._event.trigger("onPay", "com.lightningdog.rrq.wallet", {
                  orderId: _orderId
                })
              }
            }
          }
        })
        return;
      }
      wx.showToast({
        title: '亲，发起支付失败，请重新尝试',
        duration: 2000
      })
    })
  },
  recharge: function (_money, modName = 'onRecharge') {
    wx.showLoading({
      title: '充值中...'
    })
    if (!this._global.ip) return;
    wx.login({
      success: (res) => {
        console.log(res);
        let body = {
          money: _money,
          // money: '0.01',
          channel: 'wechat',
          category: 3,
          spbillCreateIp: this._global.ip,
          code: res.code
        };
        let userInfo = wx.getStorageSync('users');
        if (!userInfo) return;
        /// 加密
        let ciphertext = jsencrypt.encryptByRsa(JSON.stringify(body), userInfo.publicKey);
        console.log('加密后的数据是：' + ciphertext);
        let params = {
          body: ciphertext,
          token: this._global.token
        };
        // debugger
        // return;
        this._request.post("wallet", "recharge", params).done((errorcode, result) => {
          wx.hideLoading({});
          if (errorcode == 0) {
            console.log("succeed in recharging, money=" + _money);
            requestPayment(modName, "com.lightningdog.rrq.wallet", result)
            return;
          }
          wx.showToast({
            title: "充值失败", icon: 'none'
          })
        })
      }
    })
  }
};

(function (NS, wallet) {
  NS.wallet = wallet;
})(com.lightningdog.rrq, wallet)
