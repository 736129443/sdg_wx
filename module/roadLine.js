require("config.js")

var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var roadLine = {
  _direction: "",
  _distance: 0.0,
  _locations: [],
  _request: com.lightningdog.rrq.request,
  _global: com.lightningdog.rrq.global,
  _event: com.lightningdog.rrq.event,
  init: function () {
    return this;
  },
  setDirection: function (direction) {
    this._direction = direction;
  },
  add: function (_location) {
    this._locations.push(_location);
    this._request.post("location", "add", {
      token: this._global.token,
      location: _location
    }).done((errorcode, result) => {
      if (errorcode == 0) {
        console.log("succeed in collect personal location");
      } else {
        wx.showToast({
          title: '亲，网络异常，稍后再使用！',
          icon: "none",
          duration: 2000
        })
      }
    });
  },
  search: function (_keywords) {
    this._request.post("location", "search", {
      token: this._global.token,
      keywords: _keywords
    }).done((errorcode, result) => {
      var params = _locations
      if (errorcode == 0) {
        params = result;
      }
      _event.trigger("onLoad", "com.lightningdog.rrq.roadline", params);
    })
  },
  list: function () {
    this._request.post("location", "list", {
      token: this._global.token,
    }).done((errorcode, result) => {
      if (errorcode == 0) {
        this._locations = [];
        this._locations.push(result);
      }
    });
  },
  toObject: function () {
    return {
      direction: this._direction,
      distance: this._distance,
      locations: this._locations
    }
  }
}

  (function (NS, roadLine) {
    NS.roadLine = roadLine;
  })(com.lightning.rrq, roadLine)
