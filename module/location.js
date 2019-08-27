require("config.js")

var app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

var location = {
    _request: com.lightningdog.rrq.request,
    _global: com.lightningdog.rrq.global,
    _event: com.lightningdog.rrq.event,
    init: function () {
        return this;
    },
    list: function (condition, modName = "onMore") {
        condition.token = this._global.token;
        this._request.post("location", "list", condition).done((errorcode, result) => {
            if (errorcode == 0) {
                this._event.trigger(modName, "com.lightningdog.rrq.location", result);
                wx.hideLoading({});
                return;
            }
            wx.showToast({
                title: '亲， 加载列表失败，请稍后',
                icon: "none"
            })
        })
    },
    add: function (condition) {
        condition.token = this._global.token;
        this._request.post("location", "add", condition).done((errorcode, result) => {
            if (errorcode == 0) {
                this._event.trigger("addAddress", "com.lightningdog.rrq.location", result);
                wx.hideLoading({});
                return;
            }
            wx.showToast({
                title: '亲， 添加地址失败，请稍后',
                icon: "none"
            })
        })
    },
    del: function (id) {
        this._request.post("location", "del", {
            token: this._global.token,
            id: id
        }).done((errorcode, result) => {
            if (errorcode == 0) {
                this._event.trigger("delAddress", "com.lightningdog.rrq.location", result);
                wx.hideLoading({});
                return;
            }

            wx.showToast({
                title: '亲， 删除地址失败，请稍后',
                icon: "none"
            })
        })
    },
    edit: function (condition) {
        condition.token = this._global.token;
        this._request.post("location", "edit", condition).done((errorcode, result) => {
            if (errorcode == 0) {
                this._event.trigger("editAddress", "com.lightningdog.rrq.location", result);
                wx.hideLoading({});
                return;
            }

            wx.showToast({
                title: '亲， 编辑失败，请重试',
                icon: "none"
            })
        })
    },
};

(function (NS, location) {
    NS.location = location;
})(com.lightningdog.rrq, location)
