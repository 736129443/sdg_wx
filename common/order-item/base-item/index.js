
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        roadLine: []
    },
    properties: {
        status: String,// 状态
        isAppointment: { // 是否是预约单
            type: Boolean,
            value: false
        },
        info: Object //数据
    },
    lifetimes: {
        attached() {
            // 在组件实例进入页面节点树时执行
            this.setData({
                roadLine: this.properties.info.params.roadLine.locations
            })
        },
        ready() {
            //在组件在视图层布局完成后执行

        },
        detached() {
            // 在组件实例被从页面节点树移除时执行
        },
    },
    methods: {
        /**
         * @description:取消订单
         * @return: none
         */
        cancel() {
            const myEventDetail = {// detail对象，提供给事件监听函数
                buttonName: 'cancel'
            };
            this.triggerEvent('myevent', myEventDetail, {});
        },
        /**
         * @description:再次下单
         * @return: none
         */
        again() {
            const myEventDetail = {// detail对象，提供给事件监听函数
                buttonName: 'again'
            };
            this.triggerEvent('myevent', myEventDetail, {});
        },
        /**
         * @description:立即评价
         * @return: none
         */
        evaluate() {
            const myEventDetail = {// detail对象，提供给事件监听函数
                buttonName: 'evaluate'
            };
            this.triggerEvent('myevent', myEventDetail, {});
        },
        /**
         * @description:查看轨迹
         * @return: none
         */
        track() {
            const myEventDetail = {// detail对象，提供给事件监听函数
                buttonName: 'track'
            };
            this.triggerEvent('myevent', myEventDetail, {});
        },
        /**
         * @description:item点击事件
         * @return: none
         */
        tapEvent() {
            const myEventDetail = {// detail对象，提供给事件监听函数
                info: this.properties.info
            };
            this.triggerEvent('itemclick', myEventDetail, {});
        }
    }
})