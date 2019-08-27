Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    externalClasses: ['custom-class'],
    data: {

    },
    properties: {
        title: String,//弹出框标题
        value: String,//时间
        type: {
            type: String,
            value: 'datatime'
        },
        show: {//是否展示
            type: Boolean,
            value: false
        },
        position: {// 弹出方式  top left  right bottom
            type: String,
            value: "bottom"
        },
        maxDate: Number,//时间上限
        minDate: Number,//时间下限
        show: {//是否展示
            type: Boolean,
            value: false
        }
    },
    methods: {
        /**
         * @description:蒙层关闭/打开 
         * @param {Boolean} isSure  是否确定选择 
         * @return: none
         */
        openOrClosePopView(isSure = false) {
            this.setData({
                show: !this.properties.show
            })
            const myEventDetail = { value: this.properties.value, isSure: isSure } // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('sureOrClose', myEventDetail, myEventOption)
        },
        /**
         * @description: 确定按钮
         * @param {id} e 事件对象
         * @return: none
         */
        sureSelect(e) {
            this.setData({
                value: e.detail
            });
            this.openOrClosePopView(true);
        }
    }
})