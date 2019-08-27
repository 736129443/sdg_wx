require("config.js")

var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

const _services = com.lightningdog.rrq.services.collections;

var depot = {
  _global: com.lightningdog.rrq.global,
  _request: com.lightningdog.rrq.request,
  _event: com.lightningdog.rrq.event,
  port: _services.depot.name,
  init: function () {
    return this;
  },
  publish: function (info) {
    info.token = this._global.token;
    this._request.post("depot", "publish", info).done((errorcode, result) => {
      if (errorcode == 0) {
        console.log("succeed in publish depot... ...");
        this._event.trigger("onCreate", "com.lightningdog.rrq.depot", result);
        return;
      }
      wx.showToast({
        title: '发布失败! 亲, 请重新提交一次。',
        icon: "none",
        duration: 2000
      })
    });
    return this;
  },
  detail: function (condition) {
    var params = {
      token: this._global.token,
      condition: condition
    }
    this._request.post('depot', 'detail', params).done((errorcode, result) => {
      if (errorcode != 0) {
        return;
      }
      wx.hideLoading({});
      this._event.trigger("onDetail", "com.lightningdog.rrq.depot", result);
    });
    return this;
  },
  list: function (_condition, modName = "onMore") {
    var params = {
      token: this._global.token,
      condition: _condition
    }
    this._request.post("depot", "list", params).done((errorcode, result) => {
      if (errorcode == 0) {
        this._event.trigger(modName, "com.lightningdog.rrq.depot", result);
        wx.hideLoading({});
        return;
      }
      wx.showToast({
        title: '亲，没有更多仓库信息啦！！！',
        icon: "none",
        duration: 2000
      })
    })
    return this;
  },
  upload: function (imageArray, id) {
    wx.showLoading({
      title: '加载中'
    })
    this._request.uploadImg("depot", "upload", imageArray, id, this._global.token, 'depotId').goon((res) => {
      this._event.trigger("depot", 'com.lightningdog.rrq.depot', res);
    })
  },
  star: function (type, id) {
    var params = {
      token: this._global.token,
      type,
      condition: {
        depotId: id
      }
    }
    wx.showLoading({
      title: '加载中'
    });
    this._request.post('depot', 'star', params).done((errorcode, result) => {
      wx.hideLoading({});
      if (errorcode == 0) {
        this._event.trigger("onAddressStar", "com.lightningdog.rrq.depot", result);
        return;
      }
    });
    return this;
  }
};

(function (NS, depot) {
  NS.depot = depot;
  module.exports = NS.config;
})(com.lightningdog.rrq, depot)
