Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        baseUrl: getApp().staticUrl
    },
    externalClasses: ['custom-class'],
    properties: {
        item: Object
    },
    methods: {
    }
})