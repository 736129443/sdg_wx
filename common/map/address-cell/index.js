Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    externalClasses: ['custom-class'],
    properties: {
        status: {// 0:起点  2:终点
            type: String,
            value: '0'
        },
        icon: String,//右侧图标
        placeholder: String,//提示文字
        value: String,//内容
        src: String,//最右侧图片url（顺序从右往左数）
    },
    data: {
        imgStart: '/images/order-manager/ic_homepage_start.png',
        imgEnd: '/images/order-manager/ic_homepage_last.png'
    },
    methods: {
        /**
         * @description: 右侧icon点击事件
         * @param {e} 事件对象
         * @return: none
         */
        rightIconMehtod(e) {
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('iconevent', myEventDetail, myEventOption)
        },
        /**
         * @description: 右侧img点击事件
         * @param {e} 事件对象
         * @return: none
         */
        rightImgMethod(e) {
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('imgevent', myEventDetail, myEventOption)
        },
        /**
         * @description: cell点击事件
         * @param {e} 事件对象
         * @return: none
         */
        fieldClick(e) {
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('cellevent', myEventDetail, myEventOption)
        }
    }
})