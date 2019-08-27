Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    externalClasses: ['custom-class'],
    properties: {
        show: {
            type: Boolean,
            value: false
        },
        tips: {
            type: String,
            value: '亲，暂无数据'
        }
    },
    methods: {
    }
})