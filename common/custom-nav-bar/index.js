Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    externalClasses: ['custom-class'],
    properties: {
        title: String,
        showBack: {
            type: Boolean,
            value: false
        },
        icon: String
    },
    methods: {
        /**
         * @description: 标题点击事件
         * @return: none
         */
        titleClick() {
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('navevent', myEventDetail, myEventOption)
        },
        /**
         * @description: 右侧按钮点击事件
         * @return: none
         */
        leftClick() {
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('leftevent', myEventDetail, myEventOption)
        }
    }
})