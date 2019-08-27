Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    properties: {
        picUrl: String,
        title: String,
        price: String,
        unit: String,
    },
    methods: {
        /**
         * @description: 图片加载失败
         * @param {Object} e 事件对象 
         * @return: none
         */
        imgLoadErr(e) {
            console.log(e)
        }
    }
})