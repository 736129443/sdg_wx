
/**
 * 如无特别需求   请勿随意修改collections 下  模块名称
 */

const LIGHTNINGDOG_CONFIG = require('../config.js')

var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};

var rrq = {
  config: LIGHTNINGDOG_CONFIG,
  global: {
    token: '',
    location: null,
    device: null,
    userId: '',
    events: {},
    ip: ''
  },
  pattern: {
    regex: {
      phone: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      string: /[^\a-\z\A-\Z0-9\u4E00-\u9FA5\@\.]/,
      money: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
      email: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    },
    check: function (regex, data) {
      let reg = new RegExp(regex);
      return reg.test(data);
    }
  },
  services: {
    collections: {
      account: {
        name: "8021",
        funcs: {
          verifycode: "user/verificationcode",
          login: "user/login",
          heartbeat: "user/heartbeat",
          info: "user/info",
          invite: "partner/invite",
          rsa: "user/message",
          ip: () => 'user/clientIp'
        }
      },
      mall: {
        name: '8031',
        funcs: {
          detail: "goods/detail",
          publish: "goods/publish",
          list: "goods/list",
          baseGoods:"goods/baseGoods/list",
          upload: (goodsId) => "goods/upload/" + goodsId,
          goodsCategory: "goods/category/list",
          search: "goods/search"
        }
      },
      integratedconfig: {
        name: '8029',
        funcs: {
          package: "package/list/all",
          vehicleList: 'vehicle/list/allVehicles'
          // vehicleList: (token) => "vehicle/list/allVehicles?token=" + token
        }
      },
      billWay: {
        name: "8029",
        funcs: {
          list: "bill_way/list/all",
          one: "bill_way/list/one",
          vehicle: "bill_way/vehicle/list/one"
        }
      },
      shoppingcart: {
        name: '8031',
        funcs: {
          sync: "shopcart/sync",
          load: "shopcart/load",
        }
      },
      order: {
        name: "8023",
        funcs: {
          create: "order/create",
          list: "order/list",
          detail: "order/detail",
          state: "order/state/change"
        }
      },
      depot: {
        name: "8025",
        funcs: {
          publish: "depot/publish",
          list: "depot/list",
          detail: "depot/detail",
          star: "depot/star",
          upload: (depotId) => "depot/upload/" + depotId
        },
      },
      wallet: {
        name: "8033",
        funcs: {
          recharge: "payment/wallet/recharge",
          info: "payment/wallet/info",
          listDetail: "payment/wallet/balance/detail",
          pay: "payment/wallet/pay"
        }
      },
      coupon: {
        name: "8025",
        funcs: {
          list: "coupon/list",
          use: "coupon/use",
          choose: "coupon/choose",
          rechargeCard: 'recharge-card/list'
        }
      },
      location: {
        name: '8021',
        funcs: {
          add: "location/personal/add",
          list: "location/personal/query",
          del: "location/personal/del",
          edit: "location/personal/edit",
        }
      }
    },
  },
  bind: (service, module) => {
    this.collections[service] = module;
  },
  unbind: (service) => {
    delete this.collections[service];
  },
};

(function (NS, rrq) {
  if (NS.rrq) return;

  NS.rrq = rrq;
  module.exports = rrq.config;
  // if (com.lightningdog.rrq.global.location == null) {
  //   wx.getLocation({
  //     success: function (res) {
  //       if (res) {
  //         debugger
  //         com.lightningdog.rrq.global.location = location
  //       }
  //     },
  //   })
  // }

  if (com.lightningdog.rrq.global.device == null) {
    wx.getSystemInfo({
      success: function (res) {
        if (res) {
          com.lightningdog.rrq.global.device = {
            osType: res.model,
            brand: res.brand,
            osVersion: res.system
          }
        }
      },
    })
  }
  require('event_helper.js')
  require('request_helper.js')
})(com.lightningdog, rrq)


