require("config.js")
var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var integratedconfig = {
    _request: com.lightningdog.rrq.request,
    _global: com.lightningdog.rrq.global,
    _event: com.lightningdog.rrq.event,
    init: function () {
        return this;
    },
    package: function () {
        this._request.post("integratedconfig", "package", null).done((errorcode, result) => {
            if (errorcode == 0) {
                this._event.trigger("onPackage", "com.lightningdog.rrq.integratedconfig", result)
                return;
            }
            wx.showToast({
                title: '亲，暂无数据',
                icon: "none",
                duration: 2000
            })
        });
    },
    vehicleList: function () {
        this._request.post("integratedconfig", "vehicleList", { token: this._global.token }).done((errorcode, result) => {
            if (errorcode == 0) {
                this._event.trigger("onVehichle", "com.lightningdog.rrq.integratedconfig", result)
                wx.hideLoading({});
                return;
            }
            wx.showToast({
                title: '亲，暂无数据',
                icon: "none",
                duration: 2000
            })
        });
    },
};

(function (NS, integratedconfig) {
    NS.integratedconfig = integratedconfig;
    module.exports = NS.config;
})(com.lightningdog.rrq, integratedconfig)
