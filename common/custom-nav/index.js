//获取应用实例
var app = getApp()
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        navigationBarHeight: app.globalData.navHeight + "px",
    },
    externalClasses: ['custom-class'],
    properties: {
        title: String,
        showBack: {
            type: Boolean,
            value: false
        }
    },
    methods: {
        /**
         * @description: 返回上一页
         * @return: none
         */
        back() {
            wx.navigateBack({});
        },
        /**
         * @description: 标题点击事件
         * @return: none
         */
        titleClick() {
            const myEventDetail = {} // detail对象，提供给事件监听函数
            const myEventOption = {} // 触发事件的选项
            this.triggerEvent('navevent', myEventDetail, myEventOption)
        }
    }
})