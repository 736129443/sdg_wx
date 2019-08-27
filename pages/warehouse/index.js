require('../../module/depot.js')

//获取应用实例
var app = getApp()
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
var modName = 'depotList';
const _depot = com.lightningdog.rrq.depot;
Page({
    _event: com.lightningdog.rrq.event,
    data: {
        navBarHeight: app.globalData.navHeight + "px", // 导航高度
        scrollH: app.globalData.winHeight - app.globalData.navHeight + 'px',//滑动组件高度
        noMore: false,
        loading: false,
        imgUrl: app.staticUrl,
        totle: 0,//条目总数
        curPage: 1,//当前页数
        pageSize: 10,//总页数
        dataInfo: []// 仓库列表
    },
    onLoad: function () {
        this.bindListEvent();
        this.apiFetch();
    },
    onShow: function () {
        if (app.globalData.needRefresh) {
            this.setData({
                curPage: 1
            });
            app.globalData.needRefresh = false;
            this.apiFetch();
        }
    },
    bindListEvent() {
        this._event.on(modName, "com.lightningdog.rrq.depot", "scrollview", (event, data) => {
            let dataInfo = [...data.rows];
            if (this.data.curPage > 1) {//上拉
                dataInfo = [...this.data.dataInfo, ...dataInfo];
            }
            this.setData({
                dataInfo: dataInfo,
                total: data.total,
                loading: false
            });
            if (Number(this.data.total) <= this.data.dataInfo.length) {
                this.setData({
                    noMore: true
                });
            }
            console.log('列表条目数：' + this.data.dataInfo.length)
        });
    },
    apiFetch() {
        wx.showLoading({
            title: '加载中'
        })
        this.setData({
            loading: true
        })
        let condition = {
            pageNum: this.data.curPage,
            pageSize: this.data.pageSize
        };
        _depot.list(condition, modName);
    },
    /**
     * @description: 返回上一页
     * @return: none
     */
    back() {
        wx.navigateBack();
    },
    /**打电话 */
    callToSeller(e) {
        if (e.currentTarget.dataset.phone) {
            wx.makePhoneCall({
                phoneNumber: e.currentTarget.dataset.phone // 仅为示例，并非真实的电话号码
            })
        }
    },
    /**
     * @description: 添加仓库信息
     * @return: none
     */
    addWarehouse() {
        wx.navigateTo({
            url: "/pages/publish-depot/index"
        })
    },
    /**
     * @description: 下拉刷新
     * @return: 
     */
    pullDownMethod() {
        if (!this.data.loading) {
            this.setData({
                curPage: 1,
                noMore: false
            })
            this.apiFetch();
        }
    },
    /**
     * @description: 去详情页
     * @param {Object} e 事件对象 
     * @return: none
     */
    gotoDetail(e) {
        let detail = e.detail.item;
        wx.navigateTo({
            url: "/pages/warehouse-detail/index?id=" + detail.depotId
        })
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