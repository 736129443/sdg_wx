require('../../module/order.js');
const app = getApp();

var com = app.com || {};
com.lightningdog = com.lightningdog || {};
com.lightningdog.rrq = com.lightningdog.rrq || {};

Page({
    _order: com.lightningdog.rrq.order,
    _event: com.lightningdog.rrq.event,
    data: {
        scrollH: 0,
        active: 0,
        pageSize: 10,
        tabArray: [{
            title: '全部',
            isLoad: false,
            curPage: 1,
            noMore: false,
            loading: false,
            totle: 0,
            infoArray: []
        }, {
            title: '待支付',
            isLoad: false,
            noMore: false,
            loading: false,
            curPage: 1,
            totle: 0,
            infoArray: []
        }, {
            title: '已取消',
            isLoad: false,
            noMore: false,
            loading: false,
            curPage: 1,
            totle: 0,
            infoArray: []
        }]
    },
    /**
     * @description: 生命周期函数 初始加载函数
     * @param {option} 页面参数
     * @return: none
     */
    onLoad(option) {
        this.setData({
            scrollH: app.globalData.winHeight - 44
        });
        this.bindListEvent();
        if (option.type) {
            let index = option.type;
            this.setData({
                active: Number(index)
            });
        }
        this.getApiFetch();
    },
    bindListEvent() {
        this._event.on('onMore', "com.lightningdog.rrq.order", "list", (event, data) => {
            if (data) {
                let dataArr = data.result;
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
                    [`tabArray[${this.data.active}].infoArray`]: newArr
                })
            }
        });
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
        })
        if (!titleInfo.isLoad) {
            this.getApiFetch();
        }
    },
    /**
     * @description: 下拉刷新
     * @return: 
     */
    pullDownMethod() {
        this.getApiFetch();
    },
    /**
     * @description: 上拉加载更多
     * @return: 
     */
    pullUpMethod() {
        let index = this.data.tabArray[this.data.active].curPage;
        this.getApiFetch(index + 1);
    },
    /**
     * @description: 获取列表数据
     * @param {index} 列表类型
     * @return: none
     */
    getApiFetch(index = 1) {
        let status = this.getStatusNum();
        this.setData({
            [`tabArray[${this.data.active}].curPage`]: index,
            [`tabArray[${this.data.active}].loading`]: true,
            [`tabArray[${this.data.active}].noMore`]: false,
            [`tabArray[${this.data.active}].isLoad`]: true
        })
        let titInfo = this.data.tabArray[this.data.active];
        let condtion = {
            pageSize: this.data.pageSize,
            pageNum: titInfo.curPage
        };
        if (status.length) {
            condtion.status = status;
        }
        wx.showLoading({
            title: '正在加载'
        });
        this._order.list(condtion);
    },
    getStatusNum() {
        switch (this.data.active) {
            case 1:
                return 'done';
            case 2:
                return 'canceled';
            default:
                return '';
        }
    },
    /**
     * @description: 去详情页
     * @param {e} 组件自定义数据
     * @return: none
     */
    toDetail(e) {
        let id = e.detail.info.id;
        console.log(id);
        wx.navigateTo({
            url: '/pages/order-detail/index?id=' + id
        })
    },
    /**
     * @description: 底部按钮组件事件
     * @param {e} 组件自定义数据
     * @return: none
     */
    bottomBtnMethod(event) {
        console.log(event.detail.buttonName);
        switch (event.detail.buttonName) {
            case 'cancel'://取消订单
                break;
            case 'again'://再次下单

                break;
            case 'evaluate'://立即评价

                break;
            case 'track'://查看轨迹

                break;
        }
    }
});