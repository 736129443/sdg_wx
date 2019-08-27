
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        isExtend: false,
    },
    externalClasses: ['custom-class'],
    properties: {
        title: String,// 标题
        picUrl: String,// 图片链接
        state: {// 状态
            type: String,
            value: 'ISSUED' // ISSUED-发放, USED-已使用, EXPIRED-已过期,
        },
        info: Object,
        sharePrice: String,// 拼单价格
        discounts: String,// 优惠后价格
        couponPrice: String,// 优惠券面值
        surplus: String, //剩余多少
        limit: String // 使用限制
    },
    methods: {
        extendOrshrink() {
            this.setData({
                isExtend: !this.data.isExtend
            })
        },
        useIt() {
            const myEventDetail = { index: this.properties.info } // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('usecoupon', myEventDetail, myEventOption)
        }
    }
})