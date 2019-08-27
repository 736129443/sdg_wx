require("config.js")

var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var order = {
  _global: com.lightningdog.rrq.global,
  _request: com.lightningdog.rrq.request,
  _event: com.lightningdog.rrq.event,
  _order: {
    goodsList: [],
    roadLine: {},
    vehicleReqs: [],
    couponList: []
  },
  init: function () {
    return this;
  },
  cancel: function (couponId) {
    for (var i = 0; i < this._order.couponList.length; ++i) {
      if (_couponList[i].id == couponId) {
        delete _couponList[i];
      }
    }
  },
  choose: function (vehicleReq) {
    this._order.vehicleReqs = []
    this._order.vehicleReqs.push(vehicleReq);
  },
  collectGoodsList: function (shopcart) {
    this._order.goodsList.push(shopcart.getGoodsList());
  },
  collectRoadLine: function (roadLine) {
    this._order.roadLine = roadLine.toObject();
  },
  settle: function () {
    if (this._order.goodsList.length > 0) {
      return settleGoods();
    }

    return settleVehicle();
  },
  settleGoods: function () {
    var price = 0.00;
    for (var i = 0; i < this._order.goodsList.length; ++i) {
      price += this._order.goodsList[i].price;
    }
    for (var i = 0; i < this._order.couponList.length; ++i) {
      settleCoupon(price, this._order.couponList[i]);
    }
  },
  settleVehicle: function () {

  },
  settleCoupon: function (price, coupon) {

    return price;
  },
  singleCreate(params) {
    params.token = this._global.token;
    // console.log(JSON.stringify(params));
    this._request.post("order", "create", params).done((errorcode, result) => {
      if (errorcode != 0) {
        return;
      }
      this._event.trigger("onSingleCreate", "com.lightningdog.rrq.order", result);
    });
  },
  create: function (paramsArr) {
    let proArr = [];
    paramsArr.forEach(item => {
      item.token = this._global.token;
      // let itemParams = JSON.parse(JSON.stringify(params));
      // let locations = itemParams.roadLine.locations;
      // locations.unshift(item.locations);
      // itemParams.roadLine.locations = locations;
      // itemParams.goodsList = item.goods;
      let pro = this._request.post("order", "create", item).done(() => { }, true);
      proArr.push(pro);
    })
    this._request.setPromise(proArr).goon(result => {
      wx.hideLoading();
      this._event.trigger("onCreate", "com.lightningdog.rrq.order", {
        type: "pool",
        order: result
      });
    })
  },
  list: function (_condition) {
    this._request.post("order", "list", {
      token: this._global.token,
      condition: _condition
    }).done((errorcode, result) => {
      if (errorcode == 0) {
        console.log("order.result" + result);
        this._event.trigger("onMore", "com.lightningdog.rrq.order", result);
        wx.hideLoading({});
        return;
      }
      wx.showToast({
        title: '亲，网络异常',
        icon: "none",
        duration: 2000
      })
    });
  },
  detail: function (_orderId) {
    wx.showLoading({
      title: "加载中"
    })
    this._request.post("order", "detail", {
      token: this._global.token,
      orderId: _orderId
    }).done((errorcode, result) => {
      wx.hideLoading({});
      if (errorcode == 0) {
        console.log("detail order=" + result);
        this._event.trigger("onDetail", "com.lightningdog.rrq.order", result);
        return;
      }
    })
  },
  listVehicleReq: function () {
    this._request.post("order", "vehicleReq", {
      token: this._global.token
    }).done((errorcode, result) => {
      if (errorcode == 0) {
        console.log("vehicleReq list=" + result);
        this._event.trigger("onVechileReq", "com.lightningdog.rrq.order", result);
        return;
      }
    });
  },
  cancel: function (_orderId) {
    this._request.post("order", "cancel", {
      token: this._global.token,
      orderId: _orderId
    }).done((errorcode, result) => {
      if (errorcode == 0) {
        console.log("succeed in cancel order... ...");
        this._event.trigger("onCancel", "com.lightningdog.rrq.order", null);
        return;
      }

      wx.showToast({
        title: '亲，网络异常，稍后重试！',
        icon: "none",
        duration: 2000
      })
    })
  }
};

(function (NS, order) {
  NS.order = order;
})(com.lightningdog.rrq, order)
