require("config.js")
var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

const _services = com.lightningdog.rrq.services.collections;

var mall = {
  _global: com.lightningdog.rrq.global,
  _request: com.lightningdog.rrq.request,
  _event: com.lightningdog.rrq.event,
  port: _services.mall.name,
  init: function () {
    return this;
  },
  detail: function (_goodsId, type) {
    var params = {
      token: this._global.token,
      type,
      id: _goodsId
    }
    this._request.post('mall', 'detail', params).done((errorcode, result) => {
      if (errorcode != 0) {
        return;
      }
      this._event.trigger("onDetail", "com.lightningdog.rrq.mall", result);
    });
    return this;
  },
  publish: function (info) {
    var param = {
      token: this._global.token,
      goods: info
    }
    this._request.post("mall", 'publish', param).done((errorcode, result) => {
      console.log("publish goods, errorcode=" + errorcode)
      if (errorcode == 0) {
        console.log("mall goods publish")
        this._event.trigger("onCreate", "com.lightningdog.rrq.mall", result);
        return;
      }
      wx.showToast({
        title: '发布失败! 亲, 请重新提交一次。',
        icon: "none",
        duration: 2000
      });
    });
    return this;
  },
  list: function (condition, modName = 'onMore', needUserId = false) {
    console.log("mall list goods, condition=" + condition)
    if (needUserId) {
      condition.userId = this._global.userId;
    }
    var params = {
      token: this._global.token,
      condition: condition
    }
    this._request.post("mall", "list", params).done((errorcode, result) => {
      console.log("mall list, errorcode=" + errorcode + ", result=" + result);
      if (errorcode == 0) {
        this._event.trigger(modName, "com.lightningdog.rrq.mall", result);
        return;
      }
      wx.showToast({
        title: '亲，没有其他商品可选了！',
        icon: "none",
        duration: 2000
      })
    });
    return this;
  },
  baseGoodsList: function (name) {
    var params = {
      name
    }
    this._request.post("mall", "baseGoods", params).done((errorcode, result) => {
      console.log("mall list, errorcode=" + errorcode + ", result=" + result);
      if (errorcode == 0) {
        this._event.trigger('onBaseGoods', "com.lightningdog.rrq.mall", result);
        return;
      }
    });
    return this;
  },
  goodsCategory: function (condition, subModName = 'goodsCategory') {
    var params = {
      token: this._global.token,
    }
    this._request.post("mall", "goodsCategory", params).done((errorcode, result) => {
      console.log("mall goodsCategory, errorcode=" + errorcode + ", result=" + result);
      if (errorcode == 0) {
        this._event.trigger(subModName, "com.lightningdog.rrq.mall", result);
        return;
      }
      wx.showToast({
        title: '亲，没有其他商品可选了！',
        icon: "none",
        duration: 2000
      })
    });
    return this;
  },
  search: function (condition) {
    wx.showLoading({
      title: '查询中...'
    })
    this._request.post("mall", "search", condition).done((errorcode, result) => {
      wx.hideLoading({});
      if (errorcode == 0) {
        this._event.trigger("onSearch", "com.lightningdog.rrq.mall", result)
        return;
      }
      wx.showToast({
        title: '亲，没有匹配商品！',
        icon: "none",
        duration: 2000
      });
    });
  },
  upload: function (imageArray, id) {
    wx.showLoading({
      title: '加载中'
    })
    this._request.uploadImg("mall", "upload", imageArray, id, this._global.token, 'goodsId').goon((res) => {
      this._event.trigger("mall", 'com.lightningdog.rrq.mall', res);
    })
  }
};

(function (NS, mall) {
  NS.mall = mall;
  module.exports = NS.config;
})(com.lightningdog.rrq, mall)
