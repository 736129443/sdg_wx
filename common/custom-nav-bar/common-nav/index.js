Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    externalClasses: ['custom-class'],
    properties: {
        title: String
    },
    methods: {
        /**
         * @description: 返回上一页
         * @return: 
         */
        back() {
            wx.navigateBack({})
        }
    }
})