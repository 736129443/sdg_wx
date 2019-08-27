require('../../module/wallet.js')

//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

Page({
    _wallet: com.lightningdog.rrq.wallet,
    _event: com.lightningdog.rrq.event,
    data: {
        dataArray: [],
        loading: false
    },
    onLoad: function () {
        this.bindListEvent();
        this.apiFetch();
    },
    bindListEvent() {
        this._event.on('onListDetail', "com.lightningdog.rrq.wallet", "listDetail", (event, data) => {
            this.setData({
                loading: false
            })
            if (data) {
                this.setData({
                    dataArray: data.reverse()
                })
            }
        });
    },
    apiFetch() {
        wx.showLoading({
            title: '加载中'
        })
        this.setData({
            loading: true
        })
        this._wallet.listDetail();
    },
    /**
     * @description: 下拉刷新
     * @return: 
     */
    pullDownMethod() {
        if (!this.data.loading) {
            this.apiFetch();
        }
    },
    /**
     * @description: 上拉加载更多
     * @return: 
     */
    pullUpMethod() {
        if (this.data.noMore) return;

        this.setData({
            curPage: this.data.curPage + 1
        });
        this.apiFetch();
    }
})