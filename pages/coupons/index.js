require('../../module/coupon.js');
const app = getApp();
var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};
Page({
    _coupon: com.lightningdog.rrq.coupon,
    _event: com.lightningdog.rrq.event,
    data: {
        navH: getApp().globalData.navHeight,
        active: 0,
        pageSize: 10,
        imgUrl: app.staticUrl,
        scrollH: app.globalData.winHeight - 44 + 'px',
        tabArray: [{
            title: '未使用',
            isLoad: true,
            noMore: false,
            loading: false,
            curPage: 1,
            totle: 0,
            infoArray: []
        },
        {
            title: '已使用',
            isLoad: false,
            noMore: false,
            loading: false,
            curPage: 1,
            totle: 0,
            infoArray: []
        }, {
            title: '已过期/失效',
            isLoad: false,
            noMore: false,
            loading: false,
            curPage: 1,
            totle: 0,
            infoArray: []
        }]
    },
    /**
     * @description: 标签切换
     * @param {event} 事件对象 
     * @return: none
     */
    onChange(event) {
        let changeIndex = event.detail.index;
        let titleInfo = this.data.tabArray[changeIndex];
        this.setData({
            active: changeIndex
        });
        if (!titleInfo.isLoad) {
            let isLoad = `tabArray[${changeIndex}].isLoad`;
            this.setData({
                [isLoad]: true
            });
            this.getApiFetch();
        } else {
        }
    },
    bindListEvent() {
        this._event.on('onMore', "com.lightningdog.rrq.coupon", "list-scrollview", (event, data) => {
            if (data) {
                let dataArr = data.rows;
                let arr = this.data.tabArray[this.data.active].infoArray;
                let newArr = [];
                if (this.data.tabArray[this.data.active].curPage > 1) {
                    newArr = [...arr, ...dataArr];
                } else {
                    newArr = [...dataArr];
                }
                if (newArr.length >= Number(data.total)) {
                    this.setData({
                        [`tabArray[${this.data.active}].noMore`]: true
                    })
                }
                this.setData({
                    [`tabArray[${this.data.active}].loading`]: false,
                    [`tabArray[${this.data.active}].infoArray`]: newArr,
                    [`tabArray[${this.data.active}].total`]: data.total,
                })
            }
        });
    },
    /**
    * @description: 获取列表数据
    * @param {index} 列表类型
    * @return: none
    */
    getApiFetch(index = 1) {
        let type;
        switch (this.data.active) {
            case 0:
                type = 'ISSUED'; break;
            case 1:
                type = 'USED'; break;
            case 2:
                type = 'EXPIRED'; break;
            default:
                type = 'CANCELED';
        }
        let titInfo = this.data.tabArray[this.data.active];
        let condtion = {
            pageSize: this.data.pageSize,
            pageNum: titInfo.curPage
        };
        this.setData({
            [`tabArray[${this.data.active}].curPage`]: index,
            [`tabArray[${this.data.active}].loading`]: true,
            [`tabArray[${this.data.active}].noMore`]: false,
        })
        wx.showLoading({
            title: '正在加载'
        });
        this._coupon.list(type, condtion);
    },
    useCoupon(e) {
        console.log(e);
        wx.switchTab({
            url: '/pages/categorys/category'
        })
    },
    //下拉刷新监听函数
    _onPullDownRefresh: function () {
        this.getApiFetch();
    },

    //加载更多监听函数
    _onLoadmore: function () {
        let index = this.data.tabArray[this.data.active].curPage;
        this.getApiFetch(index + 1);
    },


    onLoad: function (options) {
        this.bindListEvent();
        this.getApiFetch();
    },
})